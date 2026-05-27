'use client'

import { useState } from 'react'
import { Calculator, Check, ChevronDown, ChevronUp, UserCheck, Users, X } from 'lucide-react'
import type { AttendanceSession, SessionVoter, GuestEntry } from '@/lib/types'
import AttendanceModal from './attendance-modal'
import {
  voteForSession,
  removeVote,
  addGuest,
  removeGuest,
} from '@/app/actions/attendance'

interface Props {
  sessions: AttendanceSession[]
  currentUser: SessionVoter
}

function VoterAvatar({
  voter,
  className = '',
  style = {},
}: {
  voter: SessionVoter
  className?: string
  style?: React.CSSProperties
}) {
  if (voter.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={voter.avatarUrl}
        alt={voter.name}
        title={voter.name}
        className={`rounded-full object-cover shrink-0 ${className}`}
        style={style}
      />
    )
  }
  return (
    <div
      title={voter.name}
      className={`flex items-center justify-center rounded-full font-bold text-white shrink-0 ${className}`}
      style={{ backgroundColor: voter.color, ...style }}
    >
      {voter.initials}
    </div>
  )
}

function AvatarStack({ voters, max = 5 }: { voters: SessionVoter[]; max?: number }) {
  const visible = voters.slice(0, max)
  const overflow = voters.length - max

  return (
    <div className="flex items-center">
      {visible.map((v, i) => (
        <VoterAvatar
          key={v.id}
          voter={v}
          className="w-7 h-7 border-2 border-[#161c2d] text-[10px]"
          style={{ marginLeft: i === 0 ? 0 : -8 }}
        />
      ))}
      {overflow > 0 && (
        <div
          className="flex items-center justify-center w-7 h-7 rounded-full border-2 border-[#161c2d] bg-[#2a3047] text-[10px] font-bold text-gray-400 shrink-0"
          style={{ marginLeft: -8 }}
        >
          +{overflow}
        </div>
      )}
    </div>
  )
}

function adderLabel(
  addedBy: string | undefined,
  voters: SessionVoter[],
  currentUser: SessionVoter,
): string {
  if (!addedBy) return 'thành viên'
  if (addedBy === currentUser.id) return currentUser.name
  return voters.find((v) => v.id === addedBy)?.name ?? 'thành viên'
}

function NumInput({
  label,
  value,
  onChange,
  placeholder,
  suffix,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-400 flex-1 leading-tight">{label}</label>
      <div className="flex items-center bg-[#1a2035] border border-white/10 rounded-lg overflow-hidden shrink-0">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? '0'}
          className="w-20 px-2.5 py-1.5 bg-transparent text-sm text-white placeholder:text-gray-600 focus:outline-none text-right"
        />
        {suffix && (
          <span className="pr-2.5 text-xs text-gray-500 select-none">{suffix}</span>
        )}
      </div>
    </div>
  )
}

function FeeCalculatorModal({
  sessionLabel,
  voters,
  guests,
  onClose,
}: {
  sessionLabel: string
  voters: SessionVoter[]
  guests: GuestEntry[]
  onClose: () => void
}) {
  const initFixedMale = voters.filter((v) => v.isCoreMember && v.gender === 'male').length
  const initFixedFemale = voters.filter((v) => v.isCoreMember && v.gender === 'female').length
  const initGuestMale = voters.filter((v) => !v.isCoreMember && v.gender === 'male').length + guests.filter((g) => g.gender === 'male').reduce((s, g) => s + g.count, 0)
  const initGuestFemale = voters.filter((v) => !v.isCoreMember && v.gender === 'female').length + guests.filter((g) => g.gender === 'female').reduce((s, g) => s + g.count, 0)

  const [courts, setCourts] = useState('2')
  const [courtPrice, setCourtPrice] = useState('240')
  const [shuttlecocks, setShuttlecocks] = useState('')
  const [shuttlePrice, setShuttlePrice] = useState('')

  const [guestMale, setGuestMale] = useState(initGuestMale > 0 ? String(initGuestMale) : '')
  const [guestFemale, setGuestFemale] = useState(initGuestFemale > 0 ? String(initGuestFemale) : '')
  const [fixedMale, setFixedMale] = useState(initFixedMale > 0 ? String(initFixedMale) : '')
  const [fixedFemale, setFixedFemale] = useState(initFixedFemale > 0 ? String(initFixedFemale) : '')

  const n = (v: string) => parseFloat(v) || 0

  const totalCourt = n(courts) * n(courtPrice)
  const totalShuttle = (n(shuttlecocks) / 12) * n(shuttlePrice)
  const totalCost = totalCourt + totalShuttle

  const deducted = n(fixedMale) * 75 + n(fixedFemale) * 60 + n(guestFemale) * 65
  const remaining = totalCost - deducted
  const guestMaleCount = n(guestMale)
  const perGuestMale = guestMaleCount > 0 ? Math.ceil(remaining / guestMaleCount) : null
  const canCalculate = totalCost > 0 && guestMaleCount > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#161c2d] rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <div>
            <h3 className="text-sm font-semibold text-white">Tính tiền buổi</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{sessionLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
          {/* Court */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Sân</p>
            <NumInput label="Số sân" value={courts} onChange={setCourts} placeholder="2" suffix="sân" />
            <NumInput label="Giá mỗi sân" value={courtPrice} onChange={setCourtPrice} placeholder="240" suffix="k" />
          </div>

          {/* Shuttlecock */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Cầu lông</p>
            <NumInput label="Số cầu đã dùng" value={shuttlecocks} onChange={setShuttlecocks} suffix="quả" />
            <NumInput label="Giá 1 ống (12 quả)" value={shuttlePrice} onChange={setShuttlePrice} suffix="k" />
          </div>

          {/* People */}
          <div className="space-y-2.5">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Thành viên</p>
            <NumInput label="Nam giao lưu" value={guestMale} onChange={setGuestMale} suffix="người" />
            <NumInput label="Nữ giao lưu" value={guestFemale} onChange={setGuestFemale} suffix="người" />
            <NumInput label="Nam cố định" value={fixedMale} onChange={setFixedMale} suffix="người" />
            <NumInput label="Nữ cố định" value={fixedFemale} onChange={setFixedFemale} suffix="người" />
          </div>

          {/* Result */}
          <div className={`rounded-xl border transition-all ${canCalculate ? 'bg-blue-600/10 border-blue-600/20' : 'bg-white/3 border-white/5'}`}>
            <div className="px-4 py-3 space-y-2">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Tiền sân</span>
                <span className="text-gray-300">{totalCourt.toLocaleString('vi-VN')}k</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Tiền cầu</span>
                <span className="text-gray-300">{totalShuttle.toLocaleString('vi-VN')}k</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Đã trừ (cố định + nữ GL)</span>
                <span className="text-gray-300">-{deducted.toLocaleString('vi-VN')}k</span>
              </div>
              <div className="border-t border-white/5 pt-2 flex justify-between items-center">
                <span className="text-xs text-gray-400">Nam giao lưu đóng</span>
                {perGuestMale !== null ? (
                  <span className="text-lg font-bold text-blue-400">
                    {perGuestMale.toLocaleString('vi-VN')}k
                  </span>
                ) : (
                  <span className="text-xs text-gray-600">—</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

function SessionRow({
  session,
  isNext,
  currentUser,
}: {
  session: AttendanceSession
  isNext: boolean
  currentUser: SessionVoter
}) {
  const [voters, setVoters] = useState<SessionVoter[]>(session.voters)
  const [guests, setGuests] = useState<GuestEntry[]>(session.guests)
  const [expanded, setExpanded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [feeModalOpen, setFeeModalOpen] = useState(false)

  const hasVoted = voters.some((v) => v.id === currentUser.id)
  const totalGuests = guests.reduce((sum, g) => sum + g.count, 0)
  const totalCount = voters.length + totalGuests
  const totalMale = voters.filter((v) => v.gender === 'male').length + guests.filter((g) => g.gender === 'male').reduce((s, g) => s + g.count, 0)
  const totalFemale = voters.filter((v) => v.gender === 'female').length + guests.filter((g) => g.gender === 'female').reduce((s, g) => s + g.count, 0)

  async function handleSelfVote() {
    if (!hasVoted) {
      setVoters((prev) => [...prev, currentUser])
      await voteForSession(session.date)
    }
  }

  async function handleGuestVote(newGuests: GuestEntry[]) {
    for (const ng of newGuests) {
      const dbId = await addGuest(session.date, ng.gender, ng.count)
      setGuests((prev) => [
        ...prev,
        { id: dbId, gender: ng.gender, count: ng.count, addedBy: currentUser.id },
      ])
    }
  }

  async function handleRemoveVote(voterId: string) {
    setVoters((prev) => prev.filter((v) => v.id !== voterId))
    await removeVote(session.date)
  }

  async function handleRemoveGuest(guestId: string) {
    setGuests((prev) => prev.filter((g) => g.id !== guestId))
    await removeGuest(guestId)
  }

  const isPast = session.isPast
  const isFuture = !isPast && !isNext
  const hasAny = totalCount > 0

  return (
    <>
      <li
        className={`border-b border-white/5 last:border-0 ${
          isPast || isFuture ? 'opacity-50' : ''
        }`}
      >
        {/* Main row */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Date badge */}
          <div
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0 text-center ${
              isPast
                ? 'bg-[#1f2844]/50 text-gray-500'
                : isNext
                ? 'bg-blue-600/20 text-blue-400'
                : 'bg-[#1f2844]/30 text-gray-600'
            }`}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wide">T3</span>
            <span className="text-sm font-bold leading-tight">{session.dayShort}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{session.label}</p>
            <div className="flex items-center gap-2 mt-1">
              <Users size={12} className="text-gray-500 shrink-0" />
              <span className="text-xs text-gray-400">
                {isNext
                  ? <>{totalMale} nam, {totalFemale} nữ đã đăng ký</>
                  : <>{totalCount} người{isPast ? ' tham gia' : ' đã đăng ký'}</>
                }
              </span>
            </div>
          </div>

          {/* Avatar stack */}
          {voters.length > 0 && (
            <div className="hidden sm:block">
              <AvatarStack voters={voters} />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isNext && (
              <>
                <button
                  onClick={() => setModalOpen(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    hasVoted
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {hasVoted ? (
                    <>
                      <Check size={12} />
                      Đã đăng ký
                    </>
                  ) : (
                    <>
                      <UserCheck size={12} />
                      Điểm danh
                    </>
                  )}
                </button>
                <button
                  onClick={() => setFeeModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-all"
                >
                  <Calculator size={12} />
                  Tính tiền
                </button>
              </>
            )}

            {hasAny && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
                aria-label={expanded ? 'Thu gọn' : 'Xem danh sách'}
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
          </div>
        </div>

        {/* Expanded list */}
        {expanded && hasAny && (
          isNext ? (
            /* 4-column layout for today's session */
            <div className="px-4 pb-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { key: 'fixedMale',   label: 'Nam CĐ',  color: 'text-blue-400',  voters: voters.filter((v) => v.isCoreMember && v.gender === 'male'),                                                                              guests: [] },
                    { key: 'fixedFemale', label: 'Nữ CĐ',   color: 'text-pink-400',  voters: voters.filter((v) => v.isCoreMember && v.gender === 'female'),                                                                             guests: [] },
                    { key: 'guestMale',   label: 'Nam GL',  color: 'text-blue-300',  voters: voters.filter((v) => !v.isCoreMember && v.gender === 'male'),   guests: guests.filter((g) => g.gender === 'male') },
                    { key: 'guestFemale', label: 'Nữ GL',   color: 'text-pink-300',  voters: voters.filter((v) => !v.isCoreMember && v.gender === 'female'),  guests: guests.filter((g) => g.gender === 'female') },
                  ] as const
                ).map((col) => (
                  <div key={col.key}>
                    <p className={`text-[10px] font-semibold uppercase tracking-wider mb-1.5 ${col.color}`}>
                      {col.label}
                    </p>
                    <ul className="space-y-1">
                      {col.voters.map((voter) => (
                        <li
                          key={voter.id}
                          className="flex items-center gap-1.5 bg-[#1a2035] rounded-lg px-2 py-1.5 group"
                        >
                          <VoterAvatar voter={voter} className="w-5 h-5 text-[9px] shrink-0" />
                          <span className="text-[11px] text-gray-300 truncate flex-1 min-w-0">{voter.name}</span>
                          {voter.id === currentUser.id && (
                            <button
                              onClick={() => handleRemoveVote(voter.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                              aria-label="Xóa"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </li>
                      ))}
                      {col.guests.map((g) => (
                        <li
                          key={g.id}
                          className="flex items-center gap-1.5 bg-[#1a2035] rounded-lg px-2 py-1.5 group"
                        >
                          <span className="text-[11px] text-gray-300 flex-1">
                            {g.count} người
                            <span className="text-gray-500"> · {adderLabel(g.addedBy, voters, currentUser)}</span>
                          </span>
                          {(!g.addedBy || g.addedBy === currentUser.id) && (
                            <button
                              onClick={() => handleRemoveGuest(g.id)}
                              className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                              aria-label="Xóa"
                            >
                              <X size={10} />
                            </button>
                          )}
                        </li>
                      ))}
                      {col.voters.length === 0 && col.guests.length === 0 && (
                        <li className="text-[11px] text-gray-600 px-2 py-1">—</li>
                      )}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Voters without gender */}
              {voters.filter((v) => !v.gender).length > 0 && (
                <div className="mt-2 pt-2 border-t border-white/5">
                  <ul className="grid grid-cols-2 gap-1">
                    {voters.filter((v) => !v.gender).map((voter) => (
                      <li
                        key={voter.id}
                        className="flex items-center gap-1.5 bg-[#1a2035] rounded-lg px-2 py-1.5 group"
                      >
                        <VoterAvatar voter={voter} className="w-5 h-5 text-[9px] shrink-0" />
                        <span className="text-[11px] text-gray-400 truncate flex-1 min-w-0">{voter.name}</span>
                        {voter.id === currentUser.id && (
                          <button
                            onClick={() => handleRemoveVote(voter.id)}
                            className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                            aria-label="Xóa"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Default layout for past/future sessions */
            <div className="px-4 pb-3 flex flex-col gap-1.5">
              <ul className="grid grid-cols-2 gap-1.5">
                {voters.map((voter) => (
                  <li
                    key={voter.id}
                    className="flex items-center gap-2 bg-[#1a2035] rounded-lg px-2.5 py-1.5 group"
                  >
                    <VoterAvatar voter={voter} className="w-6 h-6 text-[10px]" />
                    <span className="text-xs text-gray-300 truncate flex-1">{voter.name}</span>
                    {voter.id === currentUser.id && (
                      <span className="text-[10px] text-blue-400 shrink-0">(bạn)</span>
                    )}
                    {voter.id === currentUser.id && (
                      <button
                        onClick={() => handleRemoveVote(voter.id)}
                        className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                        aria-label="Xóa điểm danh"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {guests.map((g) => (
                <div
                  key={g.id}
                  className="flex items-center gap-2 bg-[#1a2035] rounded-lg px-2.5 py-1.5 group"
                >
                  <div
                    className={`flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold text-white shrink-0 ${
                      g.gender === 'male' ? 'bg-blue-600' : 'bg-pink-600'
                    }`}
                  >
                    {g.gender === 'male' ? '♂' : '♀'}
                  </div>
                  <span className="text-xs text-gray-300 flex-1">
                    {g.count} {g.gender === 'male' ? 'nam' : 'nữ'}{' '}
                    (của {adderLabel(g.addedBy, voters, currentUser)})
                  </span>
                  {(!g.addedBy || g.addedBy === currentUser.id) && (
                    <button
                      onClick={() => handleRemoveGuest(g.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                      aria-label="Xóa điểm danh hộ"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </li>

      {modalOpen && (
        <AttendanceModal
          sessionLabel={session.label}
          hasSelfVoted={hasVoted}
          onSelfVote={handleSelfVote}
          onGuestVote={handleGuestVote}
          onClose={() => setModalOpen(false)}
        />
      )}

      {feeModalOpen && (
        <FeeCalculatorModal
          sessionLabel={session.label}
          voters={voters}
          guests={guests}
          onClose={() => setFeeModalOpen(false)}
        />
      )}
    </>
  )
}

export default function AttendanceVoting({ sessions, currentUser }: Props) {
  const nextSession = sessions.find((s) => !s.isPast)
  const totalRegistered = nextSession?.voters.length ?? 0

  return (
    <section className="flex flex-col bg-[#161c2d] rounded-xl overflow-hidden lg:h-full">
      <div className="flex items-start justify-between px-4 py-3 border-b border-white/5 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Điểm danh hàng tuần
            <span className="ml-2 px-2 py-0.5 text-[10px] font-medium bg-blue-600/20 text-blue-400 rounded-full">
              Thứ 3
            </span>
          </h2>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Lịch điểm danh mỗi thứ 3 hàng tuần · Buổi tới:{' '}
            <span className="text-gray-300">{nextSession?.label ?? '—'}</span>
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-white">{totalRegistered}</p>
          <p className="text-[10px] text-gray-500">người đăng ký</p>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto">
        {sessions.map((session) => (
          <SessionRow
            key={session.id}
            session={session}
            isNext={session.id === nextSession?.id}
            currentUser={currentUser}
          />
        ))}
      </ul>
    </section>
  )
}
