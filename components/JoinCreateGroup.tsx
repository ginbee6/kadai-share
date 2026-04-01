'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getRecentGroups, removeRecentGroup, type RecentGroup } from '@/lib/recentGroups'

export default function JoinCreateGroup() {
  const router = useRouter()
  const [groupName, setGroupName] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [recentGroups, setRecentGroups] = useState<RecentGroup[]>([])
  const [showAll, setShowAll] = useState(false)
  const DISPLAY_LIMIT = 10

  useEffect(() => {
    setRecentGroups(getRecentGroups())
  }, [])

  function handleRemove(id: string) {
    removeRecentGroup(id)
    setRecentGroups(getRecentGroups())
  }

  function formatLastVisited(iso: string): string {
    const diff = Date.now() - new Date(iso).getTime()
    const minutes = Math.floor(diff / 60000)
    if (minutes < 1) return 'たった今'
    if (minutes < 60) return `${minutes}分前`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}時間前`
    const days = Math.floor(hours / 24)
    return `${days}日前`
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!groupName.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/group/${data.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'グループの作成に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteCode.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/group/${data.id}`)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'グループへの参加に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-950 border border-red-700 text-red-400 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* 参加済みグループ一覧 */}
      {recentGroups.length > 0 && (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-100">参加中のグループ</h2>
            <span className="text-xs text-gray-500">{recentGroups.length}件</span>
          </div>
          <ul className="space-y-2">
            {(showAll ? recentGroups : recentGroups.slice(0, DISPLAY_LIMIT)).map((group) => (
              <li key={group.id} className="flex items-center gap-2">
                <Link
                  href={`/group/${group.id}`}
                  className="flex-1 flex items-center justify-between bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl px-4 py-3 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-indigo-400 text-sm group-hover:underline">
                      {group.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 font-mono tracking-wider">
                      {group.inviteCode}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{formatLastVisited(group.lastVisited)}</p>
                    <p className="text-xs text-indigo-500 mt-0.5">→ 開く</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleRemove(group.id)}
                  className="text-gray-600 hover:text-red-500 transition-colors p-1"
                  title="リストから削除"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
          {recentGroups.length > DISPLAY_LIMIT && (
            <button
              onClick={() => setShowAll((v) => !v)}
              className="mt-3 w-full text-sm text-indigo-400 hover:text-indigo-300 py-2 border border-gray-700 rounded-xl hover:bg-gray-800 transition-colors"
            >
              {showAll
                ? '▲ 折りたたむ'
                : `▼ すべて表示（残り ${recentGroups.length - DISPLAY_LIMIT}件）`}
            </button>
          )}
        </div>
      )}

      {/* グループ作成 */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">グループを作成する</h2>
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">グループ名</label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="例: 2年3組、情報工学科2024"
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !groupName.trim()}
            className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '作成中...' : 'グループを作成'}
          </button>
        </form>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-black text-gray-600">または</span>
        </div>
      </div>

      {/* グループ参加 */}
      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">グループに参加する</h2>
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">招待コード</label>
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="例: ABC123"
              className="w-full bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-600 rounded-xl px-4 py-2.5 text-sm font-mono tracking-[0.3em] uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              maxLength={6}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || inviteCode.trim().length !== 6}
            className="w-full bg-gray-800 border border-indigo-600 text-indigo-400 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '参加中...' : 'グループに参加'}
          </button>
        </form>
      </div>
    </div>
  )
}
