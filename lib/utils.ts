const VOTER_COLORS = [
  '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
  '#ef4444', '#6366f1', '#f97316', '#14b8a6',
]

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function getUserColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash << 5) - hash + userId.charCodeAt(i)
    hash |= 0
  }
  return VOTER_COLORS[Math.abs(hash) % VOTER_COLORS.length]
}
