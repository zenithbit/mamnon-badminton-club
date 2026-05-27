import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ChevronLeft, ShieldCheck, User, CalendarDays, Phone, VenusAndMars } from 'lucide-react'
import { verifySession } from '@/lib/dal'
import { findUserById } from '@/lib/users'
import AvatarUpload from '@/components/profile/avatar-upload'
import ProfileForm from '@/components/profile/profile-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Hồ sơ — Badminton Club' }

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const AVATAR_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444']

function pickColor(id: string) {
  const sum = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return AVATAR_COLORS[sum % AVATAR_COLORS.length]
}

function formatDate(iso?: string) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('vi-VN', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

const GENDER_LABEL: Record<string, string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
}

export default async function ProfilePage() {
  const session = await verifySession()
  const user = await findUserById(session.userId)

  if (!user) redirect('/api/logout')

  const color = pickColor(user.id)
  const userInitials = initials(user.name)

  return (
    <main className="flex-1 overflow-auto px-4 sm:px-6 pt-16 pb-6 sm:py-6">
      {/* Breadcrumb */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ChevronLeft size={15} />
        Quay lại Dashboard
      </Link>

      <h1 className="text-xl font-bold text-white mb-6">Hồ sơ cá nhân</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* ── Left card: avatar + quick info ── */}
        <div className="space-y-4">
          {/* Avatar card */}
          <div className="bg-[#161c2d] border border-white/5 rounded-2xl p-6 flex flex-col items-center gap-4">
            <AvatarUpload
              currentUrl={user.avatarUrl ?? null}
              initials={userInitials}
              color={color}
            />

            <div className="text-center">
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-sm text-gray-400 mt-0.5">{user.email}</p>
            </div>

            {/* Role badge */}
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                user.role === 'admin'
                  ? 'bg-yellow-500/15 text-yellow-400'
                  : 'bg-blue-500/15 text-blue-400'
              }`}
            >
              <ShieldCheck size={12} />
              {user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
            </span>
          </div>

          {/* Quick-info card */}
          <div className="bg-[#161c2d] border border-white/5 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Thông tin nhanh
            </h2>

            <InfoRow icon={<CalendarDays size={14} />} label="Ngày tham gia">
              {formatDate(user.createdAt.toISOString())}
            </InfoRow>

            <InfoRow icon={<Phone size={14} />} label="Điện thoại">
              {user.phone || <span className="text-gray-600 italic">Chưa cập nhật</span>}
            </InfoRow>

            <InfoRow icon={<VenusAndMars size={14} />} label="Giới tính">
              {user.gender
                ? GENDER_LABEL[user.gender]
                : <span className="text-gray-600 italic">Chưa cập nhật</span>}
            </InfoRow>

            <InfoRow icon={<User size={14} />} label="Ngày sinh">
              {user.dateOfBirth
                ? formatDate(user.dateOfBirth)
                : <span className="text-gray-600 italic">Chưa cập nhật</span>}
            </InfoRow>

            {user.bio && (
              <div className="pt-3 border-t border-white/5">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Giới thiệu
                </p>
                <p className="text-sm text-gray-300 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right card: edit form ── */}
        <div className="bg-[#161c2d] border border-white/5 rounded-2xl p-6">
          <h2 className="text-base font-semibold text-white mb-5">Chỉnh sửa hồ sơ</h2>
          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              phone: user.phone,
              gender: user.gender,
              dateOfBirth: user.dateOfBirth,
              bio: user.bio,
            }}
          />
        </div>
      </div>
    </main>
  )
}

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-gray-500 mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-200 mt-0.5 truncate">{children}</p>
      </div>
    </div>
  )
}
