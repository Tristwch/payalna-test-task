<template>
  <a-table
    :columns="columns"
    :data-source="tasksStore.tasks"
    @resizeColumn="handleResizeColumn"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'Completed' ? 'green' : 'volcano'">
          {{ record.status }}
        </a-tag>
      </template>
      <template v-if="column.key === 'action'"
        ><a-dropdown :placement="'left'">
          <a class="ant-dropdown-link" @click.prevent>
            <EllipsisOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="openModal(record)"> Редагувати </a-menu-item>
              <a-menu-item @click="tasksStore.deleteTask(record.id, projectId)">
                Видалити
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>
  <CTasksModal />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useTasksStore } from '../../stores/tasks'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import CTasksModal from './CTasksModal.vue'
import { TableColumnsType } from 'ant-design-vue'

import { ITasks } from '../../types/tasks'

const route = useRoute()
const projectId = ref(route.params.id as string)

const tasksStore = useTasksStore()

const columns = ref<TableColumnsType<ITasks>>([
  {
    title: 'Назва завдання',
    dataIndex: 'taskName',
    key: 'taskName',
    resizable: true,
    minWidth: 100,
    sorter: {
      compare: (a, b) => a.taskName.localeCompare(b.taskName),
      multiple: 1,
    },
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    resizable: true,
    minWidth: 100,
    sorter: {
      compare: (a, b) => a.id.localeCompare(b.id),
      multiple: 2,
    },
  },
  {
    title: 'Виконавець',
    dataIndex: 'assignee',
    key: 'assignee',
    resizable: true,
    minWidth: 100,
    sorter: {
      compare: (a, b) => a.assignee.localeCompare(b.assignee),
      multiple: 3,
    },
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    resizable: true,
    minWidth: 100,
    sorter: {
      compare: (a, b) => a.status.localeCompare(b.status),
      multiple: 4,
    },
  },
  {
    title: 'Термін виконання',
    dataIndex: 'dueDate',
    key: 'dueDate',
    resizable: true,
    minWidth: 100,
    sorter: {
      compare: (a, b) => {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      },
      multiple: 5,
    },
  },
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
    width: 50,
  },
])

onMounted(() => {
  tasksStore.getAllTasks(projectId.value)

  const savedWidths = JSON.parse(localStorage.getItem('tasksTableColumnWidths') || '{}') as Record<
    string,
    number
  >
  columns.value.forEach((col) => {
    if (savedWidths[col.key] !== undefined) {
      col.width = savedWidths[col.key]
    }
    if (!col.width) {
      col.width = 150
    }
  })
})

function openModal(record: ITasks): void {
  tasksStore.openModal('edit', record)
}

function handleResizeColumn(width: number, col: (typeof columns.value)[0]): void {
  col.width = width

  const savedWidths = JSON.parse(localStorage.getItem('tasksTableColumnWidths') || '{}') as Record<
    string,
    number
  >
  savedWidths[col.key] = width

  localStorage.setItem('tasksTableColumnWidths', JSON.stringify(savedWidths))
}
</script>
