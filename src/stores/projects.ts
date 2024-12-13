import { defineStore } from 'pinia'
import { getProjects, createProject, deleteProject, updateProject } from '../services/projects'
import type { IProjects } from '@/types/projects'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as IProjects[],
    isModalOpen: false,
    modalMode: 'create',
    projectToEdit: null as IProjects | null,
  }),
  actions: {
    async getAllProjects() {
      try {
        const projects = await getProjects()
        this.projects = projects.map((project) => ({
          id: project.id,
          projectName: project.projectName,
          taskCount: project.taskCount,
          status: project.status,
          creationDate: project.creationDate,
          projectDescription: project.projectDescription,
        }))
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      }
    },
    async createProject(newProject: { projectName: string; description?: string }) {
      try {
        await createProject(newProject)
        await this.getAllProjects()
      } catch (error) {
        console.error('Failed to add project:', error)
      }
    },
    async updateProject(id: string, updatedProject: Partial<IProjects>) {
      try {
        await updateProject(id, updatedProject)
        this.projectToEdit = null
        await this.getAllProjects()
      } catch (error) {
        console.error('Failed to update project:', error)
      }
    },
    async deleteProject(id: string) {
      try {
        await deleteProject(id)
        await this.getAllProjects()
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    },
    openModal(mode: 'create' | 'edit', project?: IProjects) {
      this.modalMode = mode

      if (mode === 'edit' && project) {
        this.projectToEdit = project
      } else {
        this.projectToEdit = null
      }

      this.isModalOpen = true
    },
    closeModal() {
      this.projectToEdit = null
      this.isModalOpen = false
    },
  },
})
