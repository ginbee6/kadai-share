export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function getDeadlineStatus(
  deadline: string | Date
): 'overdue' | 'urgent' | 'warning' | 'normal' {
  const now = new Date()
  const diff = new Date(deadline).getTime() - now.getTime()
  const days = diff / (1000 * 60 * 60 * 24)

  if (diff < 0) return 'overdue'
  if (days < 3) return 'urgent'
  if (days < 7) return 'warning'
  return 'normal'
}

export function formatDeadline(deadline: string | Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(deadline))
}

export function formatRemainingTime(deadline: string | Date): string {
  const now = new Date()
  const diff = new Date(deadline).getTime() - now.getTime()

  if (diff < 0) {
    const absDiff = Math.abs(diff)
    const hours = Math.floor(absDiff / (1000 * 60 * 60))
    if (hours < 24) return `${hours}時間 超過`
    const days = Math.floor(hours / 24)
    return `${days}日 超過`
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours < 1) return '1時間未満'
  if (hours < 24) return `残り ${hours}時間`
  const days = Math.floor(hours / 24)
  if (days === 0) return '本日締切'
  return `残り ${days}日`
}
