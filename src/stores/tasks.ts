import { defineStore } from 'pinia'
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks'
import type { ITask } from '@/types/tasks'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as ITask[],
    isModalOpen: false,
    modalMode: 'create',
    taskToEdit: null as ITask | null,
  }),
  actions: {
    async getAllTasks(projectId: string) {
      try {
        const tasks = await getTasks(projectId)
        this.tasks = tasks
      } catch (error) {
        console.error('Failed to fetch tasks:', error)
      }
    },

    async createTask(newTask: {
      taskName: string
      assignee: string
      dueDate: string
      projectId: string
    }) {
      try {
        await createTask(newTask)
        await this.getAllTasks(newTask.projectId)
      } catch (error) {
        console.error('Failed to add task:', error)
      }
    },

    async updateTask(id: string, updatedTask: Partial<ITask>) {
      try {
        await updateTask(id, updatedTask)
        await this.getAllTasks(updatedTask.projectId)
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    },

    async deleteTask(id: string, projectId: string) {
      try {
        await deleteTask(id)
        await this.getAllTasks(projectId)
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
    },
    openModal(mode: 'create' | 'edit', task?: ITask) {
      this.modalMode = mode

      if (mode === 'edit' && task) {
        this.taskToEdit = task
      } else {
        this.taskToEdit = null
      }

      this.isModalOpen = true
    },
    closeModal() {
      this.isModalOpen = false
      this.taskToEdit = null
    },
  },
})
