'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  group: {
    id: string
    name: string
    inviteCode: string
  }
}

export default function GroupHeader({ group }: Props) {
  const [copied, setCopied] = useState(false)

  function copyInviteCode() {
    navigator.clipboard.writeText(group.inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4 mb-2">
          <Link href="/" className="text-indigo-200 hover:text-white transition-colors text-sm">
            ← ホーム
          </Link>
          <Link href="/calendar" className="text-indigo-200 hover:text-white transition-colors text-sm">
            📅 カレンダー
          </Link>
          <Link href="/guide" className="text-indigo-200 hover:text-white transition-colors text-sm">
            📖 使い方
          </Link>
        </div>
        <h1 className="text-xl font-bold mb-2">{group.name}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-indigo-200 text-sm">招待コード:</span>
          <span className="font-mono font-bold tracking-[0.3em] bg-indigo-700 px-3 py-1 rounded-lg text-sm">
            {group.inviteCode}
          </span>
          <button
            onClick={copyInviteCode}
            className="text-xs bg-indigo-500 hover:bg-indigo-400 px-3 py-1 rounded-lg transition-colors"
          >
            {copied ? '✓ コピー済み' : 'コピー'}
          </button>
          <span className="text-indigo-200 text-xs">
            ← このコードをクラスメートに共有しよう
          </span>
        </div>
      </div>
    </div>
  )
}
