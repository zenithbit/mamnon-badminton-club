'use server'

import { redirect } from 'next/navigation'
import { hash, compare } from 'bcryptjs'
import { headers } from 'next/headers'
import {
  SignupSchema,
  LoginSchema,
  type SignupFormState,
  type LoginFormState,
} from '@/lib/definitions'
import { createUser, findUserByEmail, countUsersByIp } from '@/lib/users'
import { createSession, deleteSession } from '@/lib/session'

const IP_REGISTRATION_LIMIT = 2

async function getClientIp(): Promise<string> {
  const headersList = await headers()
  const forwarded = headersList.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return headersList.get('x-real-ip') ?? 'unknown'
}

export async function signup(
  _state: SignupFormState,
  formData: FormData,
): Promise<SignupFormState> {
  const result = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { name, email, password } = result.data

  if (await findUserByEmail(email)) {
    return { message: 'Email này đã được đăng ký. Vui lòng đăng nhập.' }
  }

  const ip = await getClientIp()
  const registrationCount = await countUsersByIp(ip)
  if (registrationCount >= IP_REGISTRATION_LIMIT) {
    return { message: `Địa chỉ IP của bạn đã đạt giới hạn ${IP_REGISTRATION_LIMIT} tài khoản.` }
  }

  const passwordHash = await hash(password, 12)
  const user = await createUser({ name, email, passwordHash, registrationIp: ip })
  await createSession({ id: user.id, name: user.name, role: user.role as 'admin' | 'member' })
  redirect('/dashboard')
}

export async function login(
  _state: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const result = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { email, password } = result.data
  const user = await findUserByEmail(email)

  if (!user || !(await compare(password, user.passwordHash))) {
    return { message: 'Email hoặc mật khẩu không đúng.' }
  }

  await createSession({ id: user.id, name: user.name, role: user.role as 'admin' | 'member' })
  redirect('/dashboard')
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/login')
}
