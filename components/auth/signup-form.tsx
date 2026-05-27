'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { signup } from '@/app/actions/auth'
import type { SignupFormState } from '@/lib/definitions'

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
  return <p className="text-xs text-red-400 mt-1">{messages[0]}</p>
}

export default function SignupForm() {
  const [state, action, pending] = useActionState<SignupFormState, FormData>(
    signup,
    undefined,
  )
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={action} className="space-y-4" noValidate>
      {/* Global error */}
      {state?.message && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3">
          <p className="text-sm text-red-400">{state.message}</p>
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
          Họ và tên
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          placeholder="Nguyễn Văn A"
          className="w-full bg-[#1f2844] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <FieldError messages={state?.errors?.name} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          className="w-full bg-[#1f2844] border border-white/10 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        <FieldError messages={state?.errors?.email} />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
          Mật khẩu
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            placeholder="Tối thiểu 8 ký tự"
            className="w-full bg-[#1f2844] border border-white/10 rounded-lg px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        <FieldError messages={state?.errors?.password} />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors"
      >
        {pending && <Loader2 size={15} className="animate-spin" />}
        {pending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
      </button>

      {/* Login link */}
      <p className="text-center text-sm text-gray-500">
        Đã có tài khoản?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
          Đăng nhập
        </Link>
      </p>
    </form>
  )
}
