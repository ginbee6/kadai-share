import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const { inviteCode } = await request.json()

    if (!inviteCode || typeof inviteCode !== 'string') {
      return NextResponse.json(
        { error: '招待コードを入力してください' },
        { status: 400 }
      )
    }

    const group = await prisma.group.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'グループが見つかりませんでした。招待コードを確認してください。' },
        { status: 404 }
      )
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error('グループ参加エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
