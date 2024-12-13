<template>
  <a-table :columns="columns" :data-source="tasksStore.tasks" @resizeColumn="handleResizeColumn">
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
const route = useRoute()
const projectId = ref(route.params.id as string)

const tasksStore = useTasksStore()

const columns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'Назва завдання', dataIndex: 'taskName', key: 'taskName' },
  { title: 'Виконавець', dataIndex: 'assignee', key: 'assignee' },
  { title: 'Статус', dataIndex: 'status', key: 'status' },
  { title: 'Термін виконання', dataIndex: 'dueDate', key: 'dueDate' },
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
    width: 50,
  },
])

onMounted(() => {
  tasksStore.getAllTasks(projectId.value)
})

function openModal(record) {
  tasksStore.openModal('edit', record)
}

function handleResizeColumn(w, col) {
  col.width = w
}
</script>
