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
      <template v-if="column.key === 'projectName'">
        <div class="projectName">
          <RouterLink :to="`/projects/${record.projectId}`"> {{ record.projectName }} </RouterLink>
        </div>
      </template>
    </template>
  </a-table>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'

const columns = ref<TableColumnsType>([
  {
    title: 'ID проекту',
    dataIndex: 'projectId',
    key: 'projectId',
    resizable: true,
    width: 150,
  },
  {
    title: 'Назва проекту',
    dataIndex: 'projectName',
    key: 'projectName',
    resizable: true,
    width: 200,
  },
  {
    title: 'Кількість завдань',
    dataIndex: 'taskCount',
    key: 'taskCount',
    resizable: true,
    width: 200,
    minWidth: 100,
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    resizable: true,
    width: 100,
  },
  {
    title: 'Дата створення',
    dataIndex: 'creationDate',
    key: 'creationDate',
    resizable: true,
    width: 150,
  },
])
const data = [
  {
    key: '1',
    projectId: 'P001',
    projectName: 'Project Alpha',
    taskCount: 5,
    status: 'Active',
    creationDate: '2024-01-15',
  },
  {
    key: '2',
    projectId: 'P002',
    projectName: 'Project Beta',
    taskCount: 3,
    status: 'Inactive',
    creationDate: '2024-03-10',
  },
  {
    key: '3',
    projectId: 'P003',
    projectName: 'Project Gamma',
    taskCount: 8,
    status: 'Active',
    creationDate: '2024-06-22',
  },
]

function handleResizeColumn(w, col) {
  col.width = w
}
</script>

<style lang="scss" scoped>
.projectName {
  cursor: pointer;
}
</style>
