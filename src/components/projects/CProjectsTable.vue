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
import { onMounted, ref } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'
import { getProjects } from '../../services/projects'

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
const data = ref([])

async function fetchProjects() {
  try {
    const projects = await getProjects()
    data.value = projects.map((project) => ({
      key: project.id,
      projectId: project.id,
      projectName: project.projectName,
      taskCount: project.taskCount,
      status: project.status,
      creationDate: project.creationDate,
    }))
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }
}

onMounted(() => {
  fetchProjects()
})

function handleResizeColumn(w, col) {
  col.width = w
}
</script>

<style lang="scss" scoped>
.projectName {
  cursor: pointer;
}
</style>
