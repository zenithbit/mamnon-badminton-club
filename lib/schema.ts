import { pgTable, text, uuid, timestamp, date, smallint, unique, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('member'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  phone: text('phone'),
  gender: text('gender'),
  dateOfBirth: date('date_of_birth'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  isCoreMember: boolean('is_core_member').notNull().default(false),
})

export const attendanceVotes = pgTable(
  'attendance_votes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sessionDate: date('session_date').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    votedAt: timestamp('voted_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [unique('attendance_votes_uniq').on(t.sessionDate, t.userId)],
)

export const attendanceGuests = pgTable('attendance_guests', {
  id: uuid('id').primaryKey().defaultRandom(),
  sessionDate: date('session_date').notNull(),
  addedBy: uuid('added_by')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  gender: text('gender').notNull(),
  count: smallint('count').notNull().default(1),
  addedAt: timestamp('added_at', { withTimezone: true }).notNull().defaultNow(),
})
