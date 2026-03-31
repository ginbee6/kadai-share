'use client'

import { useEffect } from 'react'
import { saveRecentGroup } from '@/lib/recentGroups'

interface Props {
  group: {
    id: string
    name: string
    inviteCode: string
  }
}

export default function SaveRecentGroup({ group }: Props) {
  useEffect(() => {
    saveRecentGroup(group)
  }, [group.id])

  return null
}
