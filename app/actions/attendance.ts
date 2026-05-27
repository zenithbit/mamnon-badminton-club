'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'
import { db } from '@/lib/db'
import { attendanceVotes, attendanceGuests } from '@/lib/schema'
import type { Gender } from '@/lib/types'

export async function voteForSession(sessionDate: string): Promise<void> {
  const session = await verifySession()
  await db
    .insert(attendanceVotes)
    .values({ sessionDate, userId: session.userId })
    .onConflictDoNothing()
  revalidatePath('/dashboard')
}

export async function removeVote(sessionDate: string): Promise<void> {
  const session = await verifySession()
  await db
    .delete(attendanceVotes)
    .where(
      and(
        eq(attendanceVotes.sessionDate, sessionDate),
        eq(attendanceVotes.userId, session.userId),
      ),
    )
  revalidatePath('/dashboard')
}

export async function addGuest(
  sessionDate: string,
  gender: Gender,
  count: number,
): Promise<string> {
  const session = await verifySession()
  const [row] = await db
    .insert(attendanceGuests)
    .values({ sessionDate, addedBy: session.userId, gender, count })
    .returning({ id: attendanceGuests.id })
  revalidatePath('/dashboard')
  return row.id
}

export async function removeGuest(guestId: string): Promise<void> {
  const session = await verifySession()
  await db
    .delete(attendanceGuests)
    .where(
      and(
        eq(attendanceGuests.id, guestId),
        eq(attendanceGuests.addedBy, session.userId),
      ),
    )
  revalidatePath('/dashboard')
}
