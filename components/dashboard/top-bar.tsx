'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Search, Bell, LogOut } from 'lucide-react'
import { logout } from '@/app/actions/auth'

interface Props {
  userName: string
  userRole: 'admin' | 'member'
  avatarUrl?: string | null
}

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export default function TopBar({ userName, userRole, avatarUrl }: Props) {
  return (
    <header className="flex items-center justify-between pl-14 pr-4 py-4 lg:px-6 border-b border-white/5 shrink-0">
      <h1 className="text-xl font-bold text-white">Dashboard</h1>

      <div className="flex items-center gap-2 lg:gap-3">
        {/* Search — hidden on mobile */}
        <div className="relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search"
            className="w-40 md:w-52 bg-[#1f2844] border border-white/8 rounded-lg pl-8 pr-3 py-2 text-sm text-gray-300 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Search"
          />
        </div>

        {/* Notification bell */}
        <button
          className="relative p-2 rounded-lg bg-[#1f2844] text-gray-400 hover:text-white transition-colors"
          aria-label="Thông báo"
        >
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" aria-hidden="true" />
        </button>

        {/* Avatar + name → links to profile */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 rounded-lg hover:bg-white/5 px-2 py-1 transition-colors"
            aria-label="Xem hồ sơ"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0 ring-2 ring-white/10">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              ) : (
                initials(userName)
              )}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-white leading-tight">{userName}</p>
              <p className="text-[10px] text-gray-500 capitalize">
                {userRole === 'admin' ? 'Quản trị viên' : 'Thành viên'}
              </p>
            </div>
          </Link>

          {/* Logout */}
          <form action={logout}>
            <button
              type="submit"
              className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Đăng xuất"
              title="Đăng xuất"
            >
              <LogOut size={15} />
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
