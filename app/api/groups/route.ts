import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateInviteCode } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'グループ名を入力してください' },
        { status: 400 }
      )
    }

    // ユニークな招待コードを生成
    let inviteCode: string = ''
    let isUnique = false
    do {
      inviteCode = generateInviteCode()
      const existing = await prisma.group.findUnique({ where: { inviteCode } })
      isUnique = !existing
    } while (!isUnique)

    const group = await prisma.group.create({
      data: { name: name.trim(), inviteCode },
    })

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('グループ作成エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
