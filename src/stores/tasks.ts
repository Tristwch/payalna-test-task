import { defineStore } from 'pinia'
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks'
import type { ITask } from '@/types/tasks'
import { message } from 'ant-design-vue'

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
        message.success('Завдання створено!')
      } catch (error) {
        // месседж має повертати юзеру інформативну причину, фле в рамках тестового я вважаю тут норм
        message.error('Не вдалось створити завдання')
        console.error('Failed to add task:', error)
      }
    },

    async updateTask(id: string, updatedTask: Partial<ITask>) {
      try {
        await updateTask(id, updatedTask)
        await this.getAllTasks(updatedTask.projectId)
        message.success('Завдання відредаговано!')
      } catch (error) {
        message.error('Не вдалось відредагувати завдання')
        console.error('Failed to update task:', error)
      }
    },

    async deleteTask(id: string, projectId: string) {
      try {
        await deleteTask(id)
        await this.getAllTasks(projectId)
        message.success('Завдання видалено!')
      } catch (error) {
        message.error('Не вдалось видалити завдання')
        console.error('Failed to delete task:', error)
      }
    },

    setTasks(newTasks: ITask[]) {
      this.tasks = newTasks
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
      this.taskToEdit = null
      this.isModalOpen = false
    },
  },
})
