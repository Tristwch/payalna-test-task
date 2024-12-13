<template>
  <a-table
    :columns="columns"
    :data-source="tasksStore.tasks"
    @resizeColumn="handleResizeColumn"
    :pagination="false"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="['toDo', 'inProgress', 'done'].includes(column.key)">
        <div class="droppable-column" @dragover.prevent @drop="handleDrop($event, column.title)">
          <a-tag
            v-if="record.status === column.title"
            :color="getColorByKey(column.key)"
            draggable="true"
            @dragstart="handleDragStart(record)"
            :class="column.key"
          >
            {{ record.status }}
          </a-tag>
        </div>
      </template>

      <template v-if="column.key === 'action'">
        <a-dropdown :placement="'left'">
          <a class="ant-dropdown-link" @click.prevent>
            <EllipsisOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="openModal(record)">Редагувати</a-menu-item>
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
import type { TableColumnsType } from 'ant-design-vue'
import type { ITask } from '../../types/tasks'

const route = useRoute()
const projectId = ref(route.params.id as string)
const tasksStore = useTasksStore()
const draggedTask = ref<ITask | null>(null)

const columns = ref<TableColumnsType<ITask>>([
  {
    title: 'Назва завдання',
    dataIndex: 'taskName',
    key: 'taskName',
    resizable: true,
    width: 100,
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
    resizable: true,
    width: 100,
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
    width: 100,
    filters: [
      { text: 'Олександр', value: 'Олександр' },
      { text: 'Андрій', value: 'Андрій' },
    ],
    onFilter: (value, record) => record.assignee.indexOf(value) === 0,
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
    width: 100,
    minWidth: 100,
    filters: [
      { text: 'To Do', value: 'To Do' },
      { text: 'In Progress', value: 'In Progress' },
      { text: 'Done', value: 'Done' },
    ],
    onFilter: (value, record) => record.status.indexOf(value) === 0,
    sorter: {
      compare: (a, b) => a.status.localeCompare(b.status),
      multiple: 4,
    },
    children: [
      {
        title: 'To Do',
        dataIndex: 'doDo',
        key: 'toDo',
        resizable: true,
        minWidth: 100,
        width: 100,
      },
      {
        title: 'In progress',
        dataIndex: 'inProgress',
        key: 'inProgress',
        resizable: true,
        width: 100,
        minWidth: 100,
      },
      { title: 'Done', dataIndex: 'done', key: 'done', resizable: true, minWidth: 100, width: 100 },
    ],
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

function handleDragStart(task: ITask) {
  draggedTask.value = task
}

function handleDrop(event: DragEvent, newStatus: string) {
  if (!draggedTask.value) return

  const updatedTask = { ...draggedTask.value, status: newStatus }
  tasksStore.updateTask(draggedTask.value.id, updatedTask, projectId.value)
  draggedTask.value = null
}

function getColorByKey(status: string): string {
  switch (status) {
    case 'toDo':
      return 'lightgray'
    case 'inProgress':
      return 'green'
    case 'done':
      return 'blue'
    default:
      return 'default'
  }
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

function openModal(record: ITasks): void {
  tasksStore.openModal('edit', record)
}
</script>

<style lang="scss" scoped>
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}

.droppable-column {
  min-height: 30px;

  padding: 5px;
}

.ant-tag {
  cursor: pointer;
}
</style>
