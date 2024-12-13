import { axiosApiInstance } from '@/api'
import type { ITask } from '@/types/tasks'

export const getTasks = async (projectId: string): Promise<ITask[]> => {
  const response = await axiosApiInstance.get<ITask[]>(`tasks?projectId=${projectId}`)
  return response.data
}

export const createTask = async (task: {
  taskName: string
  assignee: string
  dueDate: string
  projectId: string
}): Promise<void> => {
  const payload = {
    taskName: task.taskName,
    assignee: task.assignee,
    status: 'Pending',
    dueDate: task.dueDate,
    projectId: task.projectId,
  }

  await axiosApiInstance.post('tasks', payload)
}

export const updateTask = async (id: string, updatedTask: Partial<ITask>): Promise<void> => {
  await axiosApiInstance.patch(`tasks/${id}`, updatedTask)
}

export const deleteTask = async (id: string): Promise<void> => {
  await axiosApiInstance.delete(`tasks/${id}`)
}
