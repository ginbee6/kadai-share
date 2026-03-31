'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getRecentGroups } from '@/lib/recentGroups'
import { getDeadlineStatus, formatDeadline } from '@/lib/utils'
import type { Assignment } from '@/lib/types'

type AssignmentWithGroup = Assignment & { groupName: string; groupId: string }

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

const STATUS_DOT: Record<string, string> = {
  overdue: 'bg-gray-400',
  urgent: 'bg-red-500',
  warning: 'bg-yellow-400',
  normal: 'bg-green-500',
}

function toDateKey(date: string | Date): string {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function CalendarView() {
  const today = new Date()
  const todayKey = toDateKey(today)

  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDate, setSelectedDate] = useState<string>(todayKey)
  const [assignments, setAssignments] = useState<AssignmentWithGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      const groups = getRecentGroups()
      const results: AssignmentWithGroup[] = []

      await Promise.all(
        groups.map(async (group) => {
          try {
            const res = await fetch(`/api/groups/${group.id}/assignments`)
            if (res.ok) {
              const data: Assignment[] = await res.json()
              data.forEach((a) =>
                results.push({ ...a, groupName: group.name, groupId: group.id })
              )
            }
          } catch {
            // ignore
          }
        })
      )

      setAssignments(results)
      setLoading(false)
    }
    fetchAll()
  }, [])

  // 日付ごとに課題をグルーピング
  const byDate = assignments.reduce<Record<string, AssignmentWithGroup[]>>((acc, a) => {
    const key = toDateKey(a.deadline)
    ;(acc[key] ??= []).push(a)
    return acc
  }, {})

  // カレンダーグリッド
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() {
    if (month === 0) { setYear((y) => y - 1); setMonth(11) }
    else setMonth((m) => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear((y) => y + 1); setMonth(0) }
    else setMonth((m) => m + 1)
  }

  const selectedAssignments = byDate[selectedDate] ?? []

  // 今月の課題件数サマリー
  const thisMonthCount = Object.entries(byDate).filter(([key]) => {
    const d = new Date(key)
    return d.getFullYear() === year && d.getMonth() === month
  }).reduce((sum, [, arr]) => sum + arr.filter((a) => !a.completed).length, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <Link href="/" className="text-indigo-200 hover:text-white text-sm">
            ← ホーム
          </Link>
          <div className="flex items-end justify-between mt-1">
            <div>
              <h1 className="text-xl font-bold">マイカレンダー</h1>
              <p className="text-indigo-200 text-xs mt-0.5">参加中グループの締め切りをまとめて確認</p>
            </div>
            {thisMonthCount > 0 && (
              <div className="text-right">
                <p className="text-2xl font-bold">{thisMonthCount}</p>
                <p className="text-indigo-200 text-xs">件の未完了</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4">
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">⏳</p>
            <p className="text-sm">読み込み中...</p>
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📅</p>
            <p className="text-sm">参加中のグループがありません</p>
            <Link href="/" className="text-indigo-500 text-sm mt-3 inline-block hover:underline">
              グループに参加する →
            </Link>
          </div>
        ) : (
          <>
            {/* 月ナビゲーション */}
            <div className="flex items-center justify-between mb-3 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
              <button
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-50 text-indigo-600 text-xl"
              >
                ‹
              </button>
              <h2 className="font-bold text-gray-800">
                {year}年 {month + 1}月
              </h2>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-indigo-50 text-indigo-600 text-xl"
              >
                ›
              </button>
            </div>

            {/* カレンダーグリッド */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-4">
              {/* 曜日ヘッダー */}
              <div className="grid grid-cols-7 border-b border-gray-100">
                {WEEKDAYS.map((d, i) => (
                  <div
                    key={d}
                    className={`text-center text-xs font-medium py-2 ${
                      i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-500'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* 日付グリッド */}
              <div className="grid grid-cols-7">
                {cells.map((day, idx) => {
                  if (day === null) {
                    return <div key={`e-${idx}`} className="h-14 border-b border-r border-gray-50 last:border-r-0" />
                  }

                  const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                  const dayItems = byDate[dateKey] ?? []
                  const incompleteItems = dayItems.filter((a) => !a.completed)
                  const isToday = dateKey === todayKey
                  const isSelected = dateKey === selectedDate
                  const dow = (firstDayOfWeek + day - 1) % 7

                  return (
                    <button
                      key={dateKey}
                      onClick={() => setSelectedDate(dateKey)}
                      className={`h-14 border-b border-r border-gray-50 flex flex-col items-center pt-1.5 transition-colors ${
                        isSelected ? 'bg-indigo-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`text-sm w-6 h-6 flex items-center justify-center rounded-full leading-none ${
                          isToday
                            ? 'bg-indigo-600 text-white font-bold'
                            : dow === 0
                            ? 'text-red-400'
                            : dow === 6
                            ? 'text-blue-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {day}
                      </span>
                      {incompleteItems.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5 items-center">
                          {incompleteItems.slice(0, 3).map((a) => (
                            <span
                              key={a.id}
                              className={`w-1.5 h-1.5 rounded-full ${
                                STATUS_DOT[getDeadlineStatus(a.deadline)]
                              }`}
                            />
                          ))}
                          {incompleteItems.length > 3 && (
                            <span className="text-gray-400 leading-none" style={{ fontSize: '8px' }}>
                              +{incompleteItems.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 凡例 */}
            <div className="flex items-center gap-3 mb-4 px-1">
              {[
                { color: 'bg-red-500', label: '3日以内' },
                { color: 'bg-yellow-400', label: '7日以内' },
                { color: 'bg-green-500', label: '余裕あり' },
                { color: 'bg-gray-400', label: '期限超過' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-xs text-gray-400">{label}</span>
                </div>
              ))}
            </div>

            {/* 選択日の課題リスト */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {new Intl.DateTimeFormat('ja-JP', {
                  month: 'long',
                  day: 'numeric',
                  weekday: 'short',
                }).format(new Date(selectedDate + 'T00:00:00'))}
                の課題
              </h3>

              {selectedAssignments.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 px-4 py-8 text-center text-gray-400 text-sm">
                  この日に締め切りの課題はありません
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedAssignments.map((a) => {
                    const status = a.completed ? 'overdue' : getDeadlineStatus(a.deadline)
                    return (
                      <Link
                        key={a.id}
                        href={`/group/${a.groupId}`}
                        className="block bg-white rounded-xl border border-gray-100 px-4 py-3 hover:border-indigo-200 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${STATUS_DOT[status]} ${
                              a.completed ? 'opacity-40' : ''
                            }`}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                              <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                {a.subject}
                              </span>
                              <span className="text-xs text-gray-400">{a.groupName}</span>
                            </div>
                            <p
                              className={`text-sm font-medium ${
                                a.completed ? 'line-through text-gray-400' : 'text-gray-800'
                              }`}
                            >
                              {a.title}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              🕐 {formatDeadline(a.deadline)}
                            </p>
                          </div>
                          {a.completed && (
                            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full flex-shrink-0">
                              完了
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
