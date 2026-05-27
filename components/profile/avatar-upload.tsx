'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Camera, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { updateAvatar } from '@/app/actions/profile'
import type { AvatarFormState } from '@/lib/definitions'

interface Props {
  currentUrl: string | null
  initials: string
  color: string
}

export default function AvatarUpload({ currentUrl, initials, color }: Props) {
  const [state, action, pending] = useActionState<AvatarFormState, FormData>(
    updateAvatar,
    undefined,
  )
  const [preview, setPreview] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!state) return
    if (state.success) {
      toast.success('Cập nhật ảnh đại diện thành công!')
      setPreview(null)
      setFileName(null)
      if (formRef.current) formRef.current.reset()
    } else if (state.error) {
      toast.error(state.error)
    }
  }, [state])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    setPreview(url)
  }

  function handleCancel() {
    setPreview(null)
    setFileName(null)
    if (formRef.current) formRef.current.reset()
  }

  const displaySrc = preview ?? currentUrl

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Avatar display */}
      <div className="relative group">
        <div className="w-28 h-28 rounded-full overflow-hidden ring-4 ring-white/10">
          {displaySrc ? (
            <Image
              src={displaySrc}
              alt="Avatar"
              width={112}
              height={112}
              className="w-full h-full object-cover"
              unoptimized={displaySrc.startsWith('blob:')}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-3xl font-bold text-white"
              style={{ backgroundColor: color }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Camera overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          aria-label="Thay đổi ảnh đại diện"
        >
          <Camera size={22} className="text-white" />
        </button>
      </div>

      {/* Hidden form + input */}
      <form ref={formRef} action={action}>
        <input
          ref={inputRef}
          type="file"
          name="avatar"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Preview bar */}
        {preview && (
          <div className="flex items-center gap-2 bg-[#1f2844] rounded-lg px-3 py-2 text-xs max-w-[180px]">
            <span className="text-gray-300 truncate flex-1">{fileName}</span>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-300 shrink-0"
              aria-label="Hủy"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {preview && (
          <button
            type="submit"
            disabled={pending}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            {pending ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
            {pending ? 'Đang lưu...' : 'Lưu ảnh'}
          </button>
        )}
      </form>

      <p className="text-[11px] text-gray-500 text-center">
        JPG, PNG, WebP, GIF · tối đa 8 MB
      </p>
    </div>
  )
}
