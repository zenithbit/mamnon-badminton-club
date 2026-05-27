'use client'

import { useActionState, useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateProfile } from '@/app/actions/profile'
import DatePicker from '@/components/ui/date-picker'
import type { ProfileFormState } from '@/lib/definitions'
import type { StoredUser } from '@/lib/users'

interface Props {
  user: Pick<StoredUser, 'name' | 'email' | 'phone' | 'gender' | 'dateOfBirth' | 'bio'>
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return <p className="text-xs text-red-400 mt-1">{messages[0]}</p>
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1.5">
      {children}
    </label>
  )
}

const GENDER_OPTIONS = [
  { value: 'male',   label: '♂  Nam' },
  { value: 'female', label: '♀  Nữ' },
  { value: 'other',  label: '⚧  Khác' },
]

export default function ProfileForm({ user }: Props) {
  const [state, action, pending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    undefined,
  )

  const [name, setName]             = useState(user.name ?? '')
  const [phone, setPhone]           = useState(user.phone ?? '')
  const [dateOfBirth, setDOB]       = useState(user.dateOfBirth ?? '')
  const [gender, setGender]         = useState(user.gender ?? '')
  const [bio, setBio]               = useState(user.bio ?? '')

  useEffect(() => {
    if (!state) return
    if (state.success) toast.success('Cập nhật hồ sơ thành công!')
    else if (state.message) toast.error(state.message)
  }, [state])

  const hasChanges =
    name        !== (user.name        ?? '') ||
    phone       !== (user.phone       ?? '') ||
    dateOfBirth !== (user.dateOfBirth ?? '') ||
    gender      !== (user.gender      ?? '') ||
    bio         !== (user.bio         ?? '')

  const inputClass =
    'w-full rounded-lg px-3.5 py-2.5 text-sm border transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-[#1f2844] border-white/10 text-white placeholder:text-gray-500'
  const readonlyClass =
    'w-full rounded-lg px-3.5 py-2.5 text-sm border bg-white/5 border-white/5 text-gray-500 cursor-not-allowed'

  return (
    <form action={action} className="space-y-5">
      {/* Two-column grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full name */}
        <div>
          <Label htmlFor="name">Họ và tên</Label>
          <input
            id="name" name="name"
            value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Nguyễn Văn A"
            className={inputClass}
          />
          <FieldError messages={state?.errors?.name} />
        </div>

        {/* Email (read-only) */}
        <div>
          <Label htmlFor="email">Email</Label>
          <input
            id="email" name="email" type="email"
            defaultValue={user.email}
            readOnly
            className={readonlyClass}
          />
          <p className="text-[11px] text-gray-500 mt-1">Email không thể thay đổi.</p>
        </div>

        {/* Phone */}
        <div>
          <Label htmlFor="phone">Số điện thoại</Label>
          <input
            id="phone" name="phone" type="tel"
            value={phone} onChange={(e) => setPhone(e.target.value)}
            placeholder="0901 234 567"
            className={inputClass}
          />
          <FieldError messages={state?.errors?.phone} />
        </div>

        {/* Date of birth */}
        <div>
          <Label htmlFor="dateOfBirth">Ngày sinh</Label>
          <DatePicker
            id="dateOfBirth"
            name="dateOfBirth"
            value={dateOfBirth}
            onChange={setDOB}
            placeholder="Chọn ngày sinh"
          />
          <FieldError messages={state?.errors?.dateOfBirth} />
        </div>
      </div>

      {/* Gender */}
      <div>
        <span className="block text-sm font-medium text-gray-300 mb-2">Giới tính</span>
        <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Giới tính">
          {GENDER_OPTIONS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="gender"
                value={value}
                checked={gender === value}
                onChange={() => setGender(value)}
                className="sr-only"
              />
              <span
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all
                  ${gender === value
                    ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                    : 'bg-[#1f2844] border-white/10 text-gray-400 hover:border-blue-500/50 hover:text-gray-200'
                  }`}
              >
                {label}
              </span>
            </label>
          ))}
        </div>
        <FieldError messages={state?.errors?.gender} />
      </div>

      {/* Bio */}
      <div>
        <Label htmlFor="bio">Giới thiệu bản thân</Label>
        <textarea
          id="bio" name="bio"
          rows={3}
          value={bio} onChange={(e) => setBio(e.target.value)}
          placeholder="Ví dụ: Thành viên CLB từ 2020, chuyên đánh đôi nam..."
          maxLength={200}
          className="w-full bg-[#1f2844] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
        />
        <FieldError messages={state?.errors?.bio} />
      </div>

      {/* Submit */}
      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={pending || !hasChanges}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {pending && <Loader2 size={14} className="animate-spin" />}
          {pending ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </form>
  )
}
