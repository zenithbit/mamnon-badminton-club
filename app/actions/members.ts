'use server'

import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'
import { setCoreMember, updateMemberByAdmin } from '@/lib/users'

export async function toggleCoreMember(memberId: string, value: boolean): Promise<void> {
  const session = await verifySession()
  if (session.role !== 'admin') throw new Error('Không có quyền thực hiện.')
  await setCoreMember(memberId, value)
  revalidatePath('/dashboard/members')
}

export interface MemberEditData {
  name: string
  phone: string
  gender: string
  dateOfBirth: string
  bio: string
  role: 'admin' | 'member'
  isCoreMember: boolean
}

export async function editMember(memberId: string, data: MemberEditData): Promise<void> {
  const session = await verifySession()
  if (session.role !== 'admin') throw new Error('Không có quyền thực hiện.')
  await updateMemberByAdmin(memberId, {
    name: data.name || undefined,
    phone: data.phone || undefined,
    gender: data.gender || undefined,
    dateOfBirth: data.dateOfBirth || undefined,
    bio: data.bio || undefined,
    role: data.role,
    isCoreMember: data.isCoreMember,
  })
  revalidatePath('/dashboard/members')
  revalidatePath('/dashboard')
}
