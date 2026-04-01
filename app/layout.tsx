import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KA-DDY',
  description: 'クラスや授業の課題・締め切りをみんなで共有するアプリ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
