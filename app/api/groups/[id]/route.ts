import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        assignments: { orderBy: { deadline: 'asc' } },
      },
    })

    if (!group) {
      return NextResponse.json(
        { error: 'グループが見つかりませんでした' },
        { status: 404 }
      )
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error('グループ取得エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
