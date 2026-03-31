import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; aid: string }> }
) {
  try {
    const { id: groupId, aid } = await params
    const body = await request.json()

    const assignment = await prisma.assignment.findFirst({
      where: { id: aid, groupId },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: '課題が見つかりませんでした' },
        { status: 404 }
      )
    }

    const updated = await prisma.assignment.update({
      where: { id: aid },
      data: body,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('課題更新エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; aid: string }> }
) {
  try {
    const { id: groupId, aid } = await params

    const assignment = await prisma.assignment.findFirst({
      where: { id: aid, groupId },
    })

    if (!assignment) {
      return NextResponse.json(
        { error: '課題が見つかりませんでした' },
        { status: 404 }
      )
    }

    await prisma.assignment.delete({ where: { id: aid } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('課題削除エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
