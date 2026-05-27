'use server'

import { revalidatePath } from 'next/cache'
import { verifySession } from '@/lib/dal'
import { updateUserProfile } from '@/lib/users'
import cloudinary from '@/lib/cloudinary'
import {
  ProfileSchema,
  type ProfileFormState,
  type AvatarFormState,
} from '@/lib/definitions'

export async function updateProfile(
  _state: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const session = await verifySession()

  const result = ProfileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    gender: formData.get('gender'),
    dateOfBirth: formData.get('dateOfBirth'),
    bio: formData.get('bio'),
  })

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors }
  }

  const { name, phone, gender, dateOfBirth, bio } = result.data
  await updateUserProfile(session.userId, {
    name,
    phone: phone || undefined,
    gender: (gender as 'male' | 'female' | 'other') || undefined,
    dateOfBirth: dateOfBirth || undefined,
    bio: bio || undefined,
  })

  revalidatePath('/dashboard/profile')
  return { success: true }
}

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_BYTES = 8 * 1024 * 1024

export async function updateAvatar(
  _state: AvatarFormState,
  formData: FormData,
): Promise<AvatarFormState> {
  const session = await verifySession()
  const file = formData.get('avatar') as File | null

  if (!file || file.size === 0) return { error: 'Chưa chọn ảnh.' }
  if (!ALLOWED_MIME.includes(file.type)) return { error: 'Chỉ chấp nhận JPG, PNG, WebP, GIF.' }
  if (file.size > MAX_BYTES) return { error: 'Ảnh phải nhỏ hơn 2 MB.' }

  const buffer = Buffer.from(await file.arrayBuffer())

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'badminton-club/avatars',
        public_id: session.userId,
        overwrite: true,
        resource_type: 'image',
        transformation: [{ width: 256, height: 256, crop: 'fill', gravity: 'face' }],
      },
      (error, result) => {
        if (error || !result) reject(error ?? new Error('Upload failed'))
        else resolve(result as { secure_url: string })
      },
    ).end(buffer)
  })

  await updateUserProfile(session.userId, { avatarUrl: result.secure_url })

  revalidatePath('/dashboard/profile')
  revalidatePath('/dashboard')
  return { success: true }
}
