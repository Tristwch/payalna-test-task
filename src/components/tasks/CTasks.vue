<template>
  <a-table :columns="columns" :data-source="data" @resizeColumn="handleResizeColumn">
    <template #headerCell="{ column }">
      <template v-if="column.key === 'name'">
        <span>
          <smile-outlined />
          Name
        </span>
      </template>
    </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'name'">
        <a>
          {{ record.name }}
        </a>
      </template>
      <template v-else-if="column.key === 'tags'">
        <span>
          <a-tag
            v-for="tag in record.tags"
            :key="tag"
            :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
          >
            {{ tag.toUpperCase() }}
          </a-tag>
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <span>
          <a>Invite 一 {{ record.name }}</a>
          <a-divider type="vertical" />
          <a>Delete</a>
          <a-divider type="vertical" />
          <a class="ant-dropdown-link">
            More actions
            <down-outlined />
          </a>
        </span>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue'
import type { TableColumnsType } from 'ant-design-vue'

const columns = ref<TableColumnsType>([
  {
    title: 'ID завдання',
    dataIndex: 'taskId',
    key: 'taskId',
    resizable: true,
    width: 150,
  },
  {
    title: 'Назва завдання',
    dataIndex: 'taskName',
    key: 'taskName',
    resizable: true,
    width: 200,
  },
  {
    title: 'Виконавець',
    dataIndex: 'assignee',
    key: 'assignee',
    resizable: true,
    width: 150,
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    resizable: true,
    width: 120,
  },
  {
    title: 'Термін виконання',
    dataIndex: 'dueDate',
    key: 'dueDate',
    resizable: true,
    width: 150,
  },
])

const data = [
  {
    key: '1',
    taskId: 'T001',
    taskName: 'Design Homepage',
    assignee: 'John Brown',
    status: 'In Progress',
    dueDate: '2024-12-20',
  },
  {
    key: '2',
    taskId: 'T002',
    taskName: 'Develop API',
    assignee: 'Jim Green',
    status: 'Completed',
    dueDate: '2024-11-30',
  },
  {
    key: '3',
    taskId: 'T003',
    taskName: 'Testing Features',
    assignee: 'Joe Black',
    status: 'Pending',
    dueDate: '2024-12-25',
  },
]

function handleResizeColumn(w, col) {
  col.width = w
}
</script>
