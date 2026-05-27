import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/dal'
import { findUserById, getAllMembers } from '@/lib/users'
import TopBar from '@/components/dashboard/top-bar'
import MemberList from '@/components/dashboard/member-list'

export default async function MembersPage() {
  const session = await verifySession()
  const [user, members] = await Promise.all([
    findUserById(session.userId),
    getAllMembers(),
  ])

  if (!user) redirect('/api/logout')

  return (
    <>
      <TopBar
        user={{ name: session.name, role: session.role, avatarUrl: user.avatarUrl ?? undefined }}
      />

      <main className="flex-1 overflow-auto px-4 sm:px-6 py-5">
        <MemberList members={members} currentUserId={session.userId} isAdmin={session.role === 'admin'} />
      </main>
    </>
  )
}
