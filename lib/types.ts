export interface SessionVoter {
  id: string
  name: string
  initials: string
  color: string
  avatarUrl?: string
  gender?: string | null
}

export type Gender = 'male' | 'female'

export interface GuestEntry {
  id: string
  gender: Gender
  count: number
  addedBy?: string
}

export interface AttendanceSession {
  id: string
  date: string        // ISO date, e.g. "2026-05-19"
  label: string       // e.g. "Thứ 3, 19/05/2026"
  dayShort: string    // e.g. "19.05"
  isPast: boolean
  voters: SessionVoter[]
  guests: GuestEntry[]
}

export interface AttendanceMember {
  id: string
  name: string
  tag: string
  time: string
  initials: string
  color: string
}

export interface RevenueDataPoint {
  hour: string
  courtBooking: number
  coaching: number
  proShop: number
}

export interface TopMember {
  rank: number
  name: string
  points: number
  initials: string
  color: string
}

export interface RevenueSummary {
  courtBooking: number
  coaching: number
  proShop: number
  total: number
}
