'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { Pencil, X } from 'lucide-react'
import { getInitials, getUserColor } from '@/lib/utils'
import { toggleCoreMember, editMember, type MemberEditData } from '@/app/actions/members'
import type { StoredUser } from '@/lib/users'

interface Props {
  members: StoredUser[]
  currentUserId: string
  isAdmin: boolean
}

function Avatar({ user }: { user: StoredUser }) {
  if (user.avatarUrl) {
    return (
      <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-2 ring-white/10">
        <Image src={user.avatarUrl} alt={user.name} width={36} height={36} className="w-full h-full object-cover" unoptimized />
      </div>
    )
  }
  return (
    <div
      className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 text-xs font-bold text-white ring-2 ring-white/10"
      style={{ backgroundColor: getUserColor(user.id) }}
    >
      {getInitials(user.name)}
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  return role === 'admin' ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">Quản trị viên</span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-gray-400 border border-white/10">Thành viên</span>
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
  return new Date(dateStr).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function CoreMemberToggle({ memberId, initial }: { memberId: string; initial: boolean }) {
  const [checked, setChecked] = useState(initial)
  const [pending, startTransition] = useTransition()

  function handleChange() {
    const next = !checked
    setChecked(next)
    startTransition(() => toggleCoreMember(memberId, next))
  }

  return (
    <button
      onClick={handleChange}
      disabled={pending}
      className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 ${checked ? 'bg-blue-600' : 'bg-white/10'} ${pending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{label}</label>
      {children}
    </div>
  )
}

const inputCls = 'w-full px-3 py-2 bg-[#1a2035] border border-white/10 rounded-lg text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500'
const selectCls = 'w-full px-3 py-2 bg-[#1a2035] border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500'

function EditModal({ member, onClose }: { member: StoredUser; onClose: () => void }) {
  const [form, setForm] = useState<MemberEditData>({
    name: member.name,
    phone: member.phone ?? '',
    gender: member.gender ?? '',
    dateOfBirth: member.dateOfBirth ?? '',
    bio: member.bio ?? '',
    role: member.role as 'admin' | 'member',
    isCoreMember: member.isCoreMember,
  })
  const [pending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function set(key: keyof MemberEditData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  function handleSave() {
    startTransition(async () => {
      await editMember(member.id, form)
      setSaved(true)
      onClose()
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#161c2d] rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar user={member} />
            <div>
              <p className="text-sm font-semibold text-white">{member.name}</p>
              <p className="text-[11px] text-gray-500">{member.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">
          <Field label="Họ tên">
            <input className={inputCls} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Tên thành viên" />
          </Field>

          <Field label="Số điện thoại">
            <input className={inputCls} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="—" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Giới tính">
              <select className={selectCls} value={form.gender} onChange={(e) => set('gender', e.target.value)}>
                <option value="">—</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            </Field>
            <Field label="Ngày sinh">
              <input type="date" className={inputCls} value={form.dateOfBirth} onChange={(e) => set('dateOfBirth', e.target.value)} />
            </Field>
          </div>

          <Field label="Bio">
            <textarea className={`${inputCls} resize-none`} rows={2} value={form.bio} onChange={(e) => set('bio', e.target.value)} placeholder="—" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Vai trò">
              <select className={selectCls} value={form.role} onChange={(e) => set('role', e.target.value as 'admin' | 'member')}>
                <option value="member">Thành viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </Field>
            <Field label="Thành viên cố định">
              <div className="flex items-center h-[38px]">
                <button
                  onClick={() => set('isCoreMember', !form.isCoreMember)}
                  className={`relative inline-flex items-center h-5 w-9 rounded-full transition-colors duration-200 ${form.isCoreMember ? 'bg-blue-600' : 'bg-white/10'} cursor-pointer`}
                >
                  <span className={`inline-block w-3.5 h-3.5 rounded-full bg-white shadow transition-transform duration-200 ${form.isCoreMember ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
                <span className="ml-2 text-xs text-gray-400">{form.isCoreMember ? 'Cố định' : 'Giao lưu'}</span>
              </div>
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-3 border-t border-white/5 shrink-0 flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-white/5 text-gray-300 hover:bg-white/10 transition-colors">
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={pending}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${saved ? 'bg-green-600/20 text-green-400' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:opacity-50`}
          >
            {pending ? 'Đang lưu…' : saved ? 'Đã lưu ✓' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MemberList({ members, currentUserId, isAdmin }: Props) {
  const [editingMember, setEditingMember] = useState<StoredUser | null>(null)

  return (
    <section className="flex flex-col bg-[#161c2d] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 shrink-0">
        <div>
          <h2 className="text-sm font-semibold text-white">Danh sách thành viên</h2>
          <p className="text-[11px] text-gray-500 mt-0.5">{members.length} thành viên đã đăng ký</p>
        </div>
      </div>

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
              {isAdmin && (
                <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Cố định</th>
              )}
              <th className="px-5 py-3 text-left text-[11px] font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
              {isAdmin && <th className="px-5 py-3 w-10" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {members.map((member, index) => (
              <tr key={member.id} className={`transition-colors hover:bg-white/3 ${member.id === currentUserId ? 'bg-blue-600/5' : ''}`}>
                <td className="px-5 py-3 text-gray-600 text-xs">{index + 1}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar user={member} />
                    <p className="text-white font-medium truncate">
                      {member.name}
                      {member.id === currentUserId && <span className="ml-1.5 text-[10px] text-blue-400">(bạn)</span>}
                    </p>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-400 truncate max-w-[180px]">{member.email}</td>
                <td className="px-5 py-3 text-gray-400">{member.phone ?? <span className="text-gray-600">—</span>}</td>
                <td className="px-5 py-3"><GenderLabel gender={member.gender} /></td>
                <td className="px-5 py-3"><RoleBadge role={member.role} /></td>
                {isAdmin && (
                  <td className="px-5 py-3">
                    <CoreMemberToggle memberId={member.id} initial={member.isCoreMember} />
                  </td>
                )}
                <td className="px-5 py-3 text-gray-400 text-xs">{formatDate(member.createdAt)}</td>
                {isAdmin && (
                  <td className="px-5 py-3">
                    <button
                      onClick={() => setEditingMember(member)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors"
                      aria-label="Chỉnh sửa"
                    >
                      <Pencil size={13} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className="flex items-center justify-center py-16 text-gray-500 text-sm">Chưa có thành viên nào.</div>
        )}
      </div>

      {editingMember && (
        <EditModal member={editingMember} onClose={() => setEditingMember(null)} />
      )}
    </section>
  )
}
