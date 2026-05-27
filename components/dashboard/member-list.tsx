import Image from 'next/image'
import { getInitials, getUserColor } from '@/lib/utils'
import type { StoredUser } from '@/lib/users'

interface Props {
  members: StoredUser[]
  currentUserId: string
}

function Avatar({ user }: { user: StoredUser }) {
  const initials = getInitials(user.name)
  const color = getUserColor(user.id)

  if (user.avatarUrl) {
    return (
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-white/10">
        <Image
          src={user.avatarUrl}
          alt={user.name}
          width={36}
          height={36}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    )
  }

  return (
    <div
      className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-xs font-bold text-white ring-2 ring-white/10"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  return role === 'admin' ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
      Quản trị viên
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-gray-400 border border-white/10">
      Thành viên
    </span>
  )
}

function GenderLabel({ gender }: { gender: string | null }) {
  if (!gender) return <span className="text-gray-600">—</span>
  if (gender === 'male') return <span className="text-blue-400">Nam</span>
  if (gender === 'female') return <span className="text-pink-400">Nữ</span>
  return <span className="text-gray-400">{gender}</span>
}

function formatDate(dateStr: string | Date | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function MemberList({ members, currentUserId }: Props) {
  return (
    <section className="flex flex-col bg-[#161c2d] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-white">Danh sách thành viên</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">{members.length} thành viên đã đăng ký</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider w-8">#</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Thành viên</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Điện thoại</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map((member, index) => (
              <tr
                key={member.id}
                className={`transition-colors hover:bg-white/3 ${
                  member.id === currentUserId ? 'bg-blue-600/5' : ''
                }`}
              >
                <td className="px-5 py-3 text-gray-600 text-xs">{index + 1}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={member} />
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">
                        {member.name}
                        {member.id === currentUserId && (
                          <span className="ml-1.5 text-[10px] text-blue-400">(bạn)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-400 truncate max-w-[180px]">{member.email}</td>
                <td className="px-5 py-3 text-gray-400">{member.phone ?? <span className="text-gray-600">—</span>}</td>
                <td className="px-5 py-3"><GenderLabel gender={member.gender} /></td>
                <td className="px-5 py-3"><RoleBadge role={member.role} /></td>
                <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(member.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">
            Chưa có thành viên nào.
          </div>
        )}
      </div>
    </section>
  )
}
