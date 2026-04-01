const STORAGE_KEY = 'kadai_share_groups'

export interface RecentGroup {
  id: string
  name: string
  inviteCode: string
  lastVisited: string
}

export function getRecentGroups(): RecentGroup[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRecentGroup(group: Omit<RecentGroup, 'lastVisited'>) {
  if (typeof window === 'undefined') return
  try {
    const groups = getRecentGroups().filter((g) => g.id !== group.id)
    const updated: RecentGroup[] = [
      { ...group, lastVisited: new Date().toISOString() },
      ...groups,
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // ignore
  }
}

export function removeRecentGroup(id: string) {
  if (typeof window === 'undefined') return
  try {
    const groups = getRecentGroups().filter((g) => g.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
  } catch {
    // ignore
  }
}
