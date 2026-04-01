import Image from 'next/image'
import Link from 'next/link'
import JoinCreateGroup from '@/components/JoinCreateGroup'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-10">
          {/* ロゴ */}
          <div className="mb-4">
            <Image
              src="/logo.png"
              alt="KA-DDY"
              width={400}
              height={150}
              priority
              className="w-80 h-auto mx-auto"
            />
          </div>
          <p className="text-gray-400 text-sm">
            クラスの課題・締め切りをみんなで共有しよう
          </p>
          <div className="flex items-center justify-center gap-3 mt-4">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-1.5 bg-gray-900 border border-indigo-700 text-indigo-400 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              📅 カレンダー
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center gap-1.5 bg-gray-900 border border-gray-700 text-gray-400 text-sm font-medium px-4 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              📖 使い方
            </Link>
          </div>
        </div>
        <JoinCreateGroup />
      </div>
    </main>
  )
}
