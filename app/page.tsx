import Link from 'next/link'
import JoinCreateGroup from '@/components/JoinCreateGroup'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-3xl font-bold text-indigo-700 mb-2">課題共有</h1>
          <p className="text-gray-500 text-sm">
            クラスの課題・締め切りをみんなで共有しよう
          </p>
          <Link
            href="/calendar"
            className="inline-flex items-center gap-1.5 mt-4 bg-white border border-indigo-200 text-indigo-600 text-sm font-medium px-4 py-2 rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
          >
            📅 マイカレンダーを見る
          </Link>
        </div>
        <JoinCreateGroup />
      </div>
    </main>
  )
}
