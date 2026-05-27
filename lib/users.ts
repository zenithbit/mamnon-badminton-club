import 'server-only'
import { eq } from 'drizzle-orm'
import { db } from './db'
import { users } from './schema'

export type StoredUser = typeof users.$inferSelect

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const rows = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1)
  return rows[0]
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1)
  return rows[0]
}

export async function createUser(data: {
  name: string
  email: string
  passwordHash: string
}): Promise<StoredUser> {
  const [anyUser] = await db.select({ id: users.id }).from(users).limit(1)
  const [user] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash: data.passwordHash,
      role: anyUser ? 'member' : 'admin',
    })
    .returning()
  return user
}

type ProfileFields = Partial<
  Pick<StoredUser, 'name' | 'phone' | 'gender' | 'dateOfBirth' | 'bio' | 'avatarUrl'>
>

export async function updateUserProfile(id: string, data: ProfileFields): Promise<void> {
  if (Object.keys(data).length === 0) return
  await db.update(users).set(data).where(eq(users.id, id))
}

export async function getAllMembers(): Promise<StoredUser[]> {
  return db
    .select()
    .from(users)
    .orderBy(users.createdAt)
}

export async function setCoreMember(id: string, value: boolean): Promise<void> {
  await db.update(users).set({ isCoreMember: value }).where(eq(users.id, id))
}
