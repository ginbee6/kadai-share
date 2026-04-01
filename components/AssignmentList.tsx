'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AssignmentCard from './AssignmentCard'
import AddAssignmentModal from './AddAssignmentModal'
import type { Assignment } from '@/lib/types'
import { applyUserPrefs, setCompleted, hideAssignment } from '@/lib/userPrefs'

interface Props {
  groupId: string
  initialAssignments: Assignment[]
}

type Filter = 'incomplete' | 'all' | 'completed'

export default function AssignmentList({ groupId, initialAssignments }: Props) {
  const router = useRouter()
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments)
  const [filter, setFilter] = useState<Filter>('incomplete')
  const [showModal, setShowModal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  // hydration後にlocalStorageの個人設定を適用
  useEffect(() => {
    setAssignments(applyUserPrefs(initialAssignments))
  }, [])

  const incompleteCount = assignments.filter((a) => !a.completed).length
  const urgentCount = assignments.filter((a) => {
    if (a.completed) return false
    const diff = new Date(a.deadline).getTime() - Date.now()
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000
  }).length

  const filtered = assignments.filter((a) => {
    if (filter === 'incomplete') return !a.completed
    if (filter === 'completed') return a.completed
    return true
  })

  function handleToggleComplete(id: string) {
    const assignment = assignments.find((a) => a.id === id)
    if (!assignment) return
    const next = !assignment.completed
    setCompleted(id, next)
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: next } : a))
    )
  }

  function handleDelete(id: string) {
    if (!confirm('この課題を非表示にしますか？\n（自分のみ。他のメンバーには影響しません）')) return
    hideAssignment(id)
    setAssignments((prev) => prev.filter((a) => a.id !== id))
  }

  function handleAssignmentAdded(newAssignment: Assignment) {
    setAssignments((prev) =>
      [...prev, newAssignment].sort(
        (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      )
    )
    setShowModal(false)
    setFilter('incomplete')
  }

  async function handleRefresh() {
    setRefreshing(true)
    try {
      const res = await fetch(`/api/groups/${groupId}/assignments`)
      if (res.ok) {
        const data = await res.json()
        setAssignments(applyUserPrefs(data))
        router.refresh()
      }
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="py-4">
      {urgentCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
          <span className="text-red-500">⚠️</span>
          <span className="text-red-700 text-sm font-medium">
            {urgentCount}件の課題が3日以内に締め切りです
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(
          [
            ['incomplete', `未完了 (${incompleteCount})`],
            ['all', `すべて (${assignments.length})`],
            ['completed', `完了済み (${assignments.length - incompleteCount})`],
          ] as const
        ).map(([f, label]) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'
            }`}
          >
            {label}
          </button>
        ))}
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="ml-auto text-xs text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
        >
          {refreshing ? '更新中...' : '↻ 更新'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-sm">
            {filter === 'incomplete'
              ? '未完了の課題はありません'
              : filter === 'completed'
              ? '完了した課題はありません'
              : '課題が登録されていません'}
          </p>
          {filter === 'incomplete' && (
            <p className="text-xs mt-1 text-gray-300">
              右下の + ボタンから課題を追加しましょう
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center text-2xl font-light"
        title="課題を追加"
      >
        +
      </button>

      {showModal && (
        <AddAssignmentModal
          groupId={groupId}
          onClose={() => setShowModal(false)}
          onAdded={handleAssignmentAdded}
        />
      )}
    </div>
  )
}
