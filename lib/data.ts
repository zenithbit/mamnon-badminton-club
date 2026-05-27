import 'server-only'
import { eq, inArray } from 'drizzle-orm'
import { db } from './db'
import { attendanceVotes, attendanceGuests, users } from './schema'
import { getInitials, getUserColor } from './utils'
import type {
  AttendanceSession,
  AttendanceMember,
  RevenueDataPoint,
  RevenueSummary,
  TopMember,
} from './types'

function generateTuesdaySessions(
  today: Date,
  pastWeeks: number,
  futureWeeks: number,
): Array<Omit<AttendanceSession, 'voters' | 'guests'>> {
  const sessions: Array<Omit<AttendanceSession, 'voters' | 'guests'>> = []

  const start = new Date(today)
  start.setDate(today.getDate() - pastWeeks * 7)
  const daysToTue = (2 - start.getDay() + 7) % 7
  start.setDate(start.getDate() + daysToTue)

  const end = new Date(today)
  end.setDate(today.getDate() + futureWeeks * 7)

  const todayStr = today.toISOString().split('T')[0]
  const d = new Date(start)

  while (d <= end) {
    const dateStr = d.toISOString().split('T')[0]
    const [year, month, day] = dateStr.split('-')
    sessions.push({
      id: dateStr,
      date: dateStr,
      label: `Thứ 3, ${day}/${month}/${year}`,
      dayShort: `${day}.${month}`,
      isPast: dateStr < todayStr,
    })
    d.setDate(d.getDate() + 7)
  }

  return sessions
}

export async function getAttendanceSessions(): Promise<AttendanceSession[]> {
  const today = new Date()
  const sessions = generateTuesdaySessions(today, 3, 4)
  const dates = sessions.map((s) => s.date)

  if (dates.length === 0) return sessions.map((s) => ({ ...s, voters: [], guests: [] }))

  const [votes, guests] = await Promise.all([
    db
      .select({
        sessionDate: attendanceVotes.sessionDate,
        userId: attendanceVotes.userId,
        userName: users.name,
        avatarUrl: users.avatarUrl,
        gender: users.gender,
      })
      .from(attendanceVotes)
      .innerJoin(users, eq(attendanceVotes.userId, users.id))
      .where(inArray(attendanceVotes.sessionDate, dates)),

    db
      .select()
      .from(attendanceGuests)
      .where(inArray(attendanceGuests.sessionDate, dates)),
  ])

  return sessions.map((session) => ({
    ...session,
    voters: votes
      .filter((v) => v.sessionDate === session.date)
      .map((v) => ({
        id: v.userId,
        name: v.userName,
        initials: getInitials(v.userName),
        color: getUserColor(v.userId),
        avatarUrl: v.avatarUrl ?? undefined,
        gender: v.gender,
      })),
    guests: guests
      .filter((g) => g.sessionDate === session.date)
      .map((g) => ({
        id: g.id,
        gender: g.gender as 'male' | 'female',
        count: g.count,
        addedBy: g.addedBy,
      })),
  }))
}

export const attendanceMembers: AttendanceMember[] = []

export const revenueData: RevenueDataPoint[] = [
  { hour: '08', courtBooking: 12, coaching: 20, proShop: 28 },
  { hour: '10', courtBooking: 18, coaching: 32, proShop: 42 },
  { hour: '12', courtBooking: 28, coaching: 48, proShop: 65 },
  { hour: '14', courtBooking: 22, coaching: 42, proShop: 72 },
  { hour: '16', courtBooking: 20, coaching: 38, proShop: 58 },
  { hour: '18', courtBooking: 16, coaching: 30, proShop: 46 },
  { hour: '20', courtBooking: 10, coaching: 24, proShop: 38 },
  { hour: '22', courtBooking: 8, coaching: 18, proShop: 26 },
  { hour: '24', courtBooking: 5, coaching: 12, proShop: 18 },
]

export const revenueSummary: RevenueSummary = {
  courtBooking: 225,
  coaching: 529,
  proShop: 2333,
  total: 3338,
}

export const topMembers: TopMember[] = []
