import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import GroupHeader from '@/components/GroupHeader'
import AssignmentList from '@/components/AssignmentList'
import SaveRecentGroup from '@/components/SaveRecentGroup'

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      assignments: {
        orderBy: { deadline: 'asc' },
      },
    },
  })

  if (!group) notFound()

  // Date → string に変換（サーバー→クライアントのシリアライズ）
  const serialized = {
    ...group,
    createdAt: group.createdAt.toISOString(),
    assignments: group.assignments.map((a) => ({
      ...a,
      deadline: a.deadline.toISOString(),
      createdAt: a.createdAt.toISOString(),
    })),
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <SaveRecentGroup group={serialized} />
      <GroupHeader group={serialized} />
      <div className="max-w-2xl mx-auto px-4 pb-24">
        <AssignmentList
          groupId={serialized.id}
          initialAssignments={serialized.assignments}
        />
      </div>
    </main>
  )
}
