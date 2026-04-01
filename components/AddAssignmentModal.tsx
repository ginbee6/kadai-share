'use client'

import { useState } from 'react'
import type { Assignment } from '@/lib/types'

interface Props {
  groupId: string
  onClose: () => void
  onAdded: (assignment: Assignment) => void
  editAssignment?: Assignment // 指定時は編集モード
}

function toLocalDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function toLocalTime(iso: string) {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export default function AddAssignmentModal({ groupId, onClose, onAdded, editAssignment }: Props) {
  const isEdit = !!editAssignment
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    subject: editAssignment?.subject ?? '',
    title: editAssignment?.title ?? '',
    deadline: editAssignment ? toLocalDate(editAssignment.deadline) : today,
    deadlineTime: editAssignment ? toLocalTime(editAssignment.deadline) : '23:59',
    priority: editAssignment?.priority ?? 'medium',
    description: editAssignment?.description ?? '',
    createdBy: editAssignment?.createdBy ?? '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.subject.trim() || !form.title.trim() || !form.deadline) {
      setError('科目・タイトル・締め切り日は必須です')
      return
    }

    setLoading(true)
    setError('')

    try {
      const deadline = new Date(`${form.deadline}T${form.deadlineTime}:00`)
      const body = {
        subject: form.subject,
        title: form.title,
        deadline: deadline.toISOString(),
        priority: form.priority,
        description: form.description || null,
        createdBy: form.createdBy || null,
      }

      const url = isEdit
        ? `/api/groups/${groupId}/assignments/${editAssignment!.id}`
        : `/api/groups/${groupId}/assignments`

      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onAdded(data)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '保存に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEdit ? '課題を編集' : '課題を追加'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              科目 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="例: 数学、英語、情報処理"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              課題タイトル <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="例: 第3章 練習問題 p.45"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                締め切り日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deadline"
                value={form.deadline}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                締め切り時刻
              </label>
              <input
                type="time"
                name="deadlineTime"
                value={form.deadlineTime}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">優先度</label>
            <div className="flex gap-2">
              {[
                { value: 'high', label: '高', active: 'border-red-400 bg-red-50 text-red-700' },
                { value: 'medium', label: '中', active: 'border-yellow-400 bg-yellow-50 text-yellow-700' },
                { value: 'low', label: '低', active: 'border-green-400 bg-green-50 text-green-700' },
              ].map((p) => (
                <label key={p.value} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value={p.value}
                    checked={form.priority === p.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`text-center py-2 rounded-xl border-2 text-sm font-medium transition-colors ${
                      form.priority === p.value
                        ? p.active
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {p.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メモ・説明 <span className="text-gray-400 font-normal">(任意)</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="提出方法や注意点など"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              追加者の名前 <span className="text-gray-400 font-normal">(任意)</span>
            </label>
            <input
              type="text"
              name="createdBy"
              value={form.createdBy}
              onChange={handleChange}
              placeholder="例: 田中"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div className="flex gap-3 pt-2 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-700 rounded-xl py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '保存中...' : isEdit ? '変更を保存' : '課題を追加'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
