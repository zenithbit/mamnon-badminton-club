import { Plus } from 'lucide-react'
import type { AttendanceMember } from '@/lib/types'

interface Props {
  members: AttendanceMember[]
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-xs font-bold text-white"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

export default function AttendanceTracker({ members }: Props) {
  return (
    <section className="flex flex-col bg-[#161c2d] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between px-4 py-3 border-b border-white/5">
        <div>
          <h2 className="text-sm font-semibold text-white">Active Member Attendance Tracker</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">Current members at/more at the club</p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white transition-colors shrink-0"
          aria-label="Add member"
        >
          <Plus size={12} />
          Add Member
        </button>
      </div>

      {/* Member list */}
      <ul className="flex-1 overflow-y-auto divide-y divide-white/5">
        {members.map((member) => (
          <li key={member.id} className="flex items-center gap-3 px-4 py-2.5">
            <Avatar initials={member.initials} color={member.color} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{member.name}</p>
              <p className="text-[11px] text-gray-500">{member.tag}</p>
            </div>
            <time className="text-xs text-gray-400 shrink-0">{member.time}</time>
          </li>
        ))}
      </ul>
    </section>
  )
}
