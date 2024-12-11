import { axiosApiInstance } from '@/api'
import type { IProjects } from '@/types/projects'

export const getProjects = async (): Promise<IProjects[]> => {
  const response = await axiosApiInstance.get<IProjects[]>('projects')
  return response.data
}

export const createProject = async (): Promise<void> => {
  await axiosApiInstance.get('projects')
}

export const updateProject = async (): Promise<void> => {
  await axiosApiInstance.get('projects')
}

export const deleteProject = async (): Promise<void> => {
  await axiosApiInstance.get('projects')
}
