import { getOptionalSession } from '@/lib/dal'
import { findUserById } from '@/lib/users'
import { getInitials } from '@/lib/utils'
import TopBar from '@/components/dashboard/top-bar'
import AttendanceVoting from '@/components/dashboard/attendance-voting'
import TopMembers from '@/components/dashboard/top-members'
import {
  getAttendanceSessions,
  topMembers,
} from '@/lib/data'
import type { SessionVoter } from '@/lib/types'
import { getUserColor } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getOptionalSession()

  const attendanceSessions = await getAttendanceSessions()

  let currentUser: SessionVoter | null = null
  let topBarUser: { name: string; role: 'admin' | 'member'; avatarUrl?: string } | null = null

  if (session) {
    const user = await findUserById(session.userId)
    if (user) {
      currentUser = {
        id: session.userId,
        name: session.name,
        initials: getInitials(session.name),
        color: getUserColor(session.userId),
        avatarUrl: user.avatarUrl ?? undefined,
        gender: user.gender,
        isCoreMember: user.isCoreMember,
      }
      topBarUser = {
        name: session.name,
        role: session.role,
        avatarUrl: user.avatarUrl ?? undefined,
      }
    }
  }

  return (
    <>
      <TopBar user={topBarUser} />

      <main className="flex-1 overflow-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4 lg:h-full lg:min-h-0">
          <div className="flex flex-col min-h-0">
            <AttendanceVoting sessions={attendanceSessions} currentUser={currentUser} />
          </div>
          <div className="flex flex-col gap-4 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-4">
              <TopMembers members={topMembers} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
