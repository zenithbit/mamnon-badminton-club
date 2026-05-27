import type { TopMember } from '@/lib/types'

interface Props {
  members: TopMember[]
}

function RankBadge({ rank }: { rank: number }) {
  const colors = ['text-yellow-400', 'text-gray-300', 'text-amber-600']
  return (
    <span className={`text-sm font-bold w-4 text-center shrink-0 ${colors[rank - 1] ?? 'text-gray-500'}`}>
      {rank}
    </span>
  )
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-full shrink-0 text-xs font-bold text-white"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}

export default function TopMembers({ members }: Props) {
  return (
    <section className="flex flex-col bg-[#161c2d] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <h2 className="text-sm font-semibold text-white">Top 5 Members of the Week</h2>
        <p className="text-[11px] text-gray-500 mt-0.5">Activity, attendance, performance</p>
      </div>

      {/* List */}
      <ul className="flex-1 divide-y divide-white/5">
        {members.map((member) => (
          <li key={member.rank} className="flex items-center gap-3 px-4 py-2.5">
            <RankBadge rank={member.rank} />
            <Avatar initials={member.initials} color={member.color} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{member.name}</p>
              <p className="text-[11px] text-gray-500">Hours played</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-white">{member.points}</p>
              <p className="text-[11px] text-gray-500">Points</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
