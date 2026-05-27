'use server'

import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'
import { setCoreMember } from '@/lib/users'

export async function toggleCoreMember(memberId: string, value: boolean): Promise<void> {
  const session = await verifySession()
  if (session.role !== 'admin') throw new Error('Không có quyền thực hiện.')
  await setCoreMember(memberId, value)
  revalidatePath('/dashboard/members')
}
