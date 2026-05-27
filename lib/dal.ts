import 'server-only'
import { cache } from 'react'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { decrypt } from './session'
import type { SessionPayload } from './definitions'

/** Call in Server Components / Server Actions that require a logged-in user. */
export const verifySession = cache(async (): Promise<SessionPayload> => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
  if (!session?.userId) redirect('/login')
  return session
})

/** Returns the session without redirecting — use where auth is optional. */
export const getOptionalSession = cache(async (): Promise<SessionPayload | null> => {
  const cookie = (await cookies()).get('session')?.value
  return decrypt(cookie)
})
