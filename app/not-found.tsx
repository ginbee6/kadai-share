import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          ページが見つかりません
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          グループが存在しないか、削除された可能性があります。
        </p>
        <Link
          href="/"
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
        >
          ホームに戻る
        </Link>
      </div>
    </main>
  )
}
