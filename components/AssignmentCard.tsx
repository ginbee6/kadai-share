'use client'

import { useState } from 'react'
import { getDeadlineStatus, formatDeadline, formatRemainingTime } from '@/lib/utils'
import type { Assignment } from '@/lib/types'

const STATUS_STYLES = {
  overdue: {
    border: 'border-gray-300',
    badge: 'bg-gray-100 text-gray-600',
    indicator: 'bg-gray-400',
    badgeText: '期限超過',
    timeColor: 'text-gray-400',
  },
  urgent: {
    border: 'border-red-200',
    badge: 'bg-red-100 text-red-700',
    indicator: 'bg-red-500',
    badgeText: '⚠ 要注意',
    timeColor: 'text-red-600',
  },
  warning: {
    border: 'border-yellow-200',
    badge: 'bg-yellow-100 text-yellow-700',
    indicator: 'bg-yellow-400',
    badgeText: '注意',
    timeColor: 'text-yellow-600',
  },
  normal: {
    border: 'border-green-100',
    badge: 'bg-green-100 text-green-700',
    indicator: 'bg-green-400',
    badgeText: '',
    timeColor: 'text-green-600',
  },
}

const PRIORITY_STYLES: Record<string, { label: string; style: string }> = {
  high: { label: '優先度: 高', style: 'bg-red-100 text-red-700' },
  medium: { label: '優先度: 中', style: 'bg-yellow-100 text-yellow-700' },
  low: { label: '優先度: 低', style: 'bg-green-100 text-green-700' },
}

interface Props {
  assignment: Assignment
  onToggleComplete: (id: string) => void
  onDelete: (id: string) => void
  onEdit: (assignment: Assignment) => void
}

export default function AssignmentCard({ assignment, onToggleComplete, onDelete, onEdit }: Props) {
  const [isExpanded, setIsExpanded] = useState(false)

  const status = assignment.completed
    ? 'overdue'
    : getDeadlineStatus(assignment.deadline)
  const styles = STATUS_STYLES[status]
  const priority = PRIORITY_STYLES[assignment.priority] ?? PRIORITY_STYLES.medium

  return (
    <div
      className={`bg-white rounded-xl border-2 ${styles.border} ${
        assignment.completed ? 'opacity-60' : ''
      } overflow-hidden`}
    >
      <div className={`h-1 ${styles.indicator}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* 完了チェックボタン */}
          <button
            onClick={() => onToggleComplete(assignment.id)}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors ${
              assignment.completed
                ? 'bg-indigo-500 border-indigo-500'
                : 'border-gray-300 hover:border-indigo-400'
            } flex items-center justify-center`}
            title={assignment.completed ? '未完了に戻す' : '完了にする'}
          >
            {assignment.completed && (
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            {/* バッジ */}
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                {assignment.subject}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priority.style}`}>
                {priority.label}
              </span>
              {!assignment.completed && status !== 'normal' && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
                  {styles.badgeText}
                </span>
              )}
              {assignment.completed && (
                <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  完了
                </span>
              )}
            </div>

            {/* タイトル */}
            <h3
              className={`font-semibold text-gray-800 ${
                assignment.completed ? 'line-through text-gray-400' : ''
              }`}
            >
              {assignment.title}
            </h3>

            {/* 締め切り日時 */}
            <p className="mt-1 text-sm text-gray-500">
              🕐 {formatDeadline(assignment.deadline)}
            </p>

            {/* 残り時間 */}
            {!assignment.completed && (
              <p className={`mt-0.5 text-sm font-medium ${styles.timeColor}`}>
                {formatRemainingTime(assignment.deadline)}
              </p>
            )}

            {/* 詳細展開 */}
            {(assignment.description || assignment.createdBy) && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-xs text-indigo-500 hover:text-indigo-700"
              >
                {isExpanded ? '▲ 閉じる' : '▼ 詳細を見る'}
              </button>
            )}

            {isExpanded && (
              <div className="mt-2 space-y-1.5">
                {assignment.description && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2.5">
                    {assignment.description}
                  </p>
                )}
                {assignment.createdBy && (
                  <p className="text-xs text-gray-400">追加者: {assignment.createdBy}</p>
                )}
              </div>
            )}
          </div>

          {/* 編集・削除ボタン */}
          <div className="flex flex-col gap-1 flex-shrink-0 mt-0.5">
            <button
              onClick={() => onEdit(assignment)}
              className="text-gray-300 hover:text-indigo-500 transition-colors"
              title="編集"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(assignment.id)}
              className="text-gray-300 hover:text-red-500 transition-colors"
              title="削除"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
