import { Shuffle } from 'lucide-react'
import SignupForm from '@/components/auth/signup-form'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Đăng ký — Badminton Club' }

export default function SignupPage() {
  return (
    <div className="w-full max-w-sm">
      {/* Brand */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 mb-3">
          <Shuffle size={22} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-white">Badminton Club</h1>
        <p className="text-sm text-gray-400 mt-1">Tạo tài khoản mới</p>
      </div>

      {/* Card */}
      <div className="bg-[#161c2d] border border-white/5 rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-5">Đăng ký tham gia 🏸</h2>
        <SignupForm />
      </div>
    </div>
  )
}
