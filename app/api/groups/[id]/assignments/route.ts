import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params

    const assignments = await prisma.assignment.findMany({
      where: { groupId },
      orderBy: { deadline: 'asc' },
    })

    return NextResponse.json(assignments)
  } catch (error) {
    console.error('課題取得エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: groupId } = await params
    const body = await request.json()
    const { title, subject, description, deadline, priority, createdBy } = body

    if (!title?.trim() || !subject?.trim() || !deadline) {
      return NextResponse.json(
        { error: '科目・タイトル・締め切り日は必須です' },
        { status: 400 }
      )
    }

    const group = await prisma.group.findUnique({ where: { id: groupId } })
    if (!group) {
      return NextResponse.json(
        { error: 'グループが見つかりませんでした' },
        { status: 404 }
      )
    }

    const assignment = await prisma.assignment.create({
      data: {
        title: title.trim(),
        subject: subject.trim(),
        description: description?.trim() || null,
        deadline: new Date(deadline),
        priority: priority || 'medium',
        createdBy: createdBy?.trim() || null,
        groupId,
      },
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('課題作成エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}
