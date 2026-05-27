import { z } from 'zod'

export const SignupSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }).trim(),
  email: z.string().email({ message: 'Email không hợp lệ.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự.' })
    .trim(),
})

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Email không hợp lệ.' }).trim(),
  password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu.' }).trim(),
})

export interface SessionPayload {
  userId: string
  name: string
  role: 'admin' | 'member'
  expiresAt: Date
}

export type SignupFormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type LoginFormState =
  | {
      errors?: {
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export const ProfileSchema = z.object({
  name: z.string().min(2, { message: 'Tên phải có ít nhất 2 ký tự.' }).trim(),
  phone: z
    .string()
    .regex(/^[0-9+\s\-()]{0,15}$/, { message: 'Số điện thoại không hợp lệ.' })
    .optional()
    .or(z.literal('')),
  gender: z.enum(['male', 'female', 'other']).optional().or(z.literal('')),
  dateOfBirth: z.string().optional().or(z.literal('')),
  bio: z
    .string()
    .max(200, { message: 'Bio tối đa 200 ký tự.' })
    .optional()
    .or(z.literal('')),
})

export type ProfileFormState =
  | {
      errors?: {
        name?: string[]
        phone?: string[]
        gender?: string[]
        dateOfBirth?: string[]
        bio?: string[]
      }
      message?: string
      success?: boolean
    }
  | undefined

export type AvatarFormState =
  | { error?: string; success?: boolean }
  | undefined
