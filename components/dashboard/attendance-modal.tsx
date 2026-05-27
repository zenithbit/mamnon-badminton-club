'use client'

import { useState } from 'react'
import { X, UserCheck, Users, Plus, Minus, Check } from 'lucide-react'
import type { Gender, GuestEntry } from '@/lib/types'

interface Props {
  sessionLabel: string
  hasSelfVoted: boolean
  onSelfVote: () => void
  onGuestVote: (guests: GuestEntry[]) => void
  onClose: () => void
}

type View = 'choose' | 'guest-form'

export default function AttendanceModal({
  sessionLabel,
  hasSelfVoted,
  onSelfVote,
  onGuestVote,
  onClose,
}: Props) {
  const [view, setView] = useState<View>('choose')
  const [guests, setGuests] = useState<GuestEntry[]>([
    { id: '1', gender: 'male', count: 1 },
  ])

  function addRow() {
    setGuests((prev) => [
      ...prev,
      { id: Date.now().toString(), gender: 'male', count: 1 },
    ])
  }

  function removeRow(id: string) {
    setGuests((prev) => prev.filter((g) => g.id !== id))
  }

  function updateRow(id: string, patch: Partial<Omit<GuestEntry, 'id'>>) {
    setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)))
  }

  function handleGuestSubmit() {
    const valid = guests.filter((g) => g.count > 0)
    if (valid.length > 0) onGuestVote(valid)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-[#161c2d] rounded-2xl w-full max-w-sm shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div>
            <h3 className="text-sm font-semibold text-white">Điểm danh</h3>
            <p className="text-[11px] text-gray-500 mt-0.5">{sessionLabel}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {view === 'choose' ? (
          <div className="p-4 flex flex-col gap-3">
            {/* Self check-in */}
            <button
              onClick={() => {
                if (!hasSelfVoted) onSelfVote()
                onClose()
              }}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left w-full ${
                hasSelfVoted
                  ? 'border-green-500/30 bg-green-500/10 cursor-default'
                  : 'border-white/10 bg-white/5 hover:border-blue-500/40 hover:bg-blue-500/10'
              }`}
            >
              <div
                className={`p-2.5 rounded-xl shrink-0 ${
                  hasSelfVoted ? 'bg-green-500/20' : 'bg-blue-500/20'
                }`}
              >
                {hasSelfVoted ? (
                  <Check size={20} className="text-green-400" />
                ) : (
                  <UserCheck size={20} className="text-blue-400" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    hasSelfVoted ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {hasSelfVoted ? 'Đã điểm danh' : 'Điểm danh'}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {hasSelfVoted
                    ? 'Bạn đã xác nhận tham dự'
                    : 'Xác nhận tham dự cho chính bạn'}
                </p>
              </div>
            </button>

            {/* Guest check-in */}
            <button
              onClick={() => setView('guest-form')}
              className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:border-purple-500/40 hover:bg-purple-500/10 transition-all text-left w-full"
            >
              <div className="p-2.5 rounded-xl bg-purple-500/20 shrink-0">
                <Users size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Điểm danh hộ</p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Thêm người tham dự thay mặt
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="p-4">
            <p className="text-xs text-gray-500 mb-3">Chọn giới tính và số lượng người</p>

            {/* Guest rows */}
            <div className="flex flex-col gap-2 mb-3">
              {guests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center gap-2 bg-[#1a2035] rounded-xl px-3 py-2.5"
                >
                  {/* Gender toggle */}
                  <div className="flex rounded-lg overflow-hidden border border-white/10 shrink-0">
                    {(['male', 'female'] as Gender[]).map((g) => (
                      <button
                        key={g}
                        onClick={() => updateRow(guest.id, { gender: g })}
                        className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                          guest.gender === g
                            ? g === 'male'
                              ? 'bg-blue-600 text-white'
                              : 'bg-pink-600 text-white'
                            : 'text-gray-400 hover:text-gray-200'
                        }`}
                      >
                        {g === 'male' ? 'Nam' : 'Nữ'}
                      </button>
                    ))}
                  </div>

                  {/* Count stepper */}
                  <div className="flex items-center gap-1.5 ml-auto">
                    <button
                      onClick={() =>
                        updateRow(guest.id, { count: Math.max(1, guest.count - 1) })
                      }
                      className="w-6 h-6 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">
                      {guest.count}
                    </span>
                    <button
                      onClick={() => updateRow(guest.id, { count: guest.count + 1 })}
                      className="w-6 h-6 flex items-center justify-center rounded-md bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Remove row */}
                  {guests.length > 1 && (
                    <button
                      onClick={() => removeRow(guest.id)}
                      className="p-1 ml-1 rounded-md text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add row */}
            <button
              onClick={addRow}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-xl border border-dashed border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20 text-xs transition-colors mb-4"
            >
              <Plus size={13} />
              Thêm dòng
            </button>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setView('choose')}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:bg-white/5 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={handleGuestSubmit}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-sm font-semibold text-white transition-colors"
              >
                Xác nhận
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
