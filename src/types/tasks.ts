export interface ITask {
  id: string
  taskName: string
  assignee: string
  status: 'Pending' | 'In Progress' | 'Completed'
  dueDate: Date
  projectId: string
}
