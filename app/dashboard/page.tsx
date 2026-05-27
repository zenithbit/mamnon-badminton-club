import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { findUserById } from '@/lib/users'
import { getInitials } from '@/lib/utils'
import TopBar from '@/components/dashboard/top-bar'
import AttendanceVoting from '@/components/dashboard/attendance-voting'
// import AttendanceTracker from '@/components/dashboard/attendance-tracker'
// import RevenueChart from '@/components/dashboard/revenue-chart'
import TopMembers from '@/components/dashboard/top-members'
import {
  getAttendanceSessions,
  // attendanceMembers,
  // revenueData,
  // revenueSummary,
  topMembers,
} from '@/lib/data'
import type { SessionVoter } from '@/lib/types'
import { getUserColor } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await verifySession()
  const [user, attendanceSessions] = await Promise.all([
    findUserById(session.userId),
    getAttendanceSessions(),
  ])

  if (!user) redirect('/api/logout')

  const currentUser: SessionVoter = {
    id: session.userId,
    name: session.name,
    initials: getInitials(session.name),
    color: getUserColor(session.userId),
    avatarUrl: user.avatarUrl ?? undefined,
  }

  return (
    <>
      <TopBar
        userName={session.name}
        userRole={session.role}
        avatarUrl={user.avatarUrl ?? undefined}
      />

      <main className="flex-1 overflow-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4 lg:h-full lg:min-h-0">
          <div className="flex flex-col min-h-0">
            <AttendanceVoting sessions={attendanceSessions} currentUser={currentUser} />
          </div>
          <div className="flex flex-col gap-4 min-h-0">
            {/* <div className="lg:flex-1 lg:min-h-0">
              <AttendanceTracker members={attendanceMembers} />
            </div> */}
            <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-4">
              {/* <RevenueChart data={revenueData} summary={revenueSummary} /> */}
              <TopMembers members={topMembers} />
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
