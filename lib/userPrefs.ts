const COMPLETED_KEY = 'kadai_user_completed'
const HIDDEN_KEY = 'kadai_user_hidden'

export function getCompletedIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    return new Set(JSON.parse(localStorage.getItem(COMPLETED_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

export function setCompleted(id: string, completed: boolean): void {
  if (typeof window === 'undefined') return
  const ids = getCompletedIds()
  if (completed) ids.add(id)
  else ids.delete(id)
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([...ids]))
}

export function getHiddenIds(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    return new Set(JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

export function hideAssignment(id: string): void {
  if (typeof window === 'undefined') return
  const ids = getHiddenIds()
  ids.add(id)
  localStorage.setItem(HIDDEN_KEY, JSON.stringify([...ids]))
}

export function applyUserPrefs<T extends { id: string; completed: boolean }>(
  assignments: T[]
): T[] {
  const completedIds = getCompletedIds()
  const hiddenIds = getHiddenIds()
  return assignments
    .filter((a) => !hiddenIds.has(a.id))
    .map((a) => ({ ...a, completed: completedIds.has(a.id) }))
}
