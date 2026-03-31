export interface Assignment {
  id: string
  title: string
  subject: string
  description: string | null
  deadline: string
  priority: string
  completed: boolean
  createdBy: string | null
  groupId: string
  createdAt: string
}

export interface Group {
  id: string
  name: string
  inviteCode: string
  createdAt: string
  assignments: Assignment[]
}
