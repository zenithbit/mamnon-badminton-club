'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Settings,
  Shuffle,
  UserCircle,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard',          icon: <LayoutDashboard size={18} /> },
  { label: 'Members',   href: '/dashboard/members',  icon: <Users size={18} /> },
  { label: 'Profile',   href: '/dashboard/profile',  icon: <UserCircle size={18} /> },
]

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-2 py-2 space-y-0.5">
      {navItems.map((item) => {
        const active =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const close = () => setIsOpen(false)

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-3.5 left-3.5 z-50 p-2 rounded-lg bg-[#10141f] border border-white/10 text-gray-400 hover:text-white transition-colors lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Mở menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={close}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-60 bg-[#10141f] border-r border-white/5 transition-transform duration-200 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
              <Shuffle size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold leading-tight text-white">
              Badminton
              <br />
              Club
            </span>
          </div>
          <button
            onClick={close}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Đóng menu"
          >
            <X size={16} />
          </button>
        </div>

        <NavLinks pathname={pathname} onNavigate={close} />

        <div className="px-2 pb-4">
          <Link
            href="/settings"
            onClick={close}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-40 shrink-0 bg-[#10141f] border-r border-white/5">
        <div className="flex items-center gap-2 px-4 py-5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
            <Shuffle size={16} className="text-white" />
          </div>
          <span className="text-sm font-semibold leading-tight text-white">
            Badminton
            <br />
            Club
          </span>
        </div>

        <NavLinks pathname={pathname} />

        <div className="px-2 pb-4">
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </aside>
    </>
  )
}
