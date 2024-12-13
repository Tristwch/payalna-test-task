import { axiosApiInstance } from '@/api'
import type { IProjects } from '@/types/projects'

export const getProjects = async (): Promise<IProjects[]> => {
  const response = await axiosApiInstance.get<IProjects[]>('projects')
  return response.data
}

export const createProject = async (project: {
  projectName: string
  description?: string
}): Promise<void> => {
  const payload = {
    projectName: project.projectName,
    description: project.description || '',
    creationDate: new Date().toISOString().split('T')[0],
    taskCount: 0,
    status: 'Активний',
  }

  await axiosApiInstance.post('projects', payload)
}

export const updateProject = async (
  id: string,
  updatedProject: Partial<IProjects>,
): Promise<void> => {
  await axiosApiInstance.patch(`projects/${id}`, updatedProject)
}

export const deleteProject = async (id: string): Promise<void> => {
  await axiosApiInstance.delete(`projects/${id}`)
}
