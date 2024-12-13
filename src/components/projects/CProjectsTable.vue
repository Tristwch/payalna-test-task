<template>
  <a-table
    :columns="columns"
    :data-source="projectsStore.projects"
    @resizeColumn="handleResizeColumn"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'projectName'">
        <div class="projectName">
          <RouterLink :to="`/projects/${record.id}`"> {{ record.projectName }} </RouterLink>
        </div>
      </template>
      <template v-if="column.key === 'action'"
        ><a-dropdown :placement="'left'">
          <a class="ant-dropdown-link" @click.prevent>
            <EllipsisOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="openModal(record)"> Редагувати </a-menu-item>
              <a-menu-item @click="projectsStore.deleteProject(record.id)"> Видалити </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>
  <CProjectModal />
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import type { TableColumnsType } from 'ant-design-vue'
import { useProjectsStore } from '../../stores/projects'
import { EllipsisOutlined } from '@ant-design/icons-vue'
import CProjectModal from './CProjectModal.vue'
import type { IProjects } from '../..//types/projects'

const columns = ref<TableColumnsType<IProjects>>([
  {
    title: 'Назва проекту',
    dataIndex: 'projectName',
    key: 'projectName',
    resizable: true,
    width: 200,
  },
  {
    title: 'ID проекту',
    dataIndex: 'id',
    key: 'projectId',
    resizable: true,
    width: 150,
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
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
    width: 50,
  },
])

const projectsStore = useProjectsStore()

onMounted(() => {
  projectsStore.getAllProjects()

  const savedWidths = JSON.parse(
    localStorage.getItem('projectsTableColumnWidths') || '{}',
  ) as Record<string, number>
  columns.value.forEach((col) => {
    if (savedWidths[col.key] !== undefined) {
      col.width = savedWidths[col.key]
    }
    if (!col.width) {
      col.width = 150
    }
  })
})

function openModal(record: IProjects): void {
  projectsStore.openModal('edit', record)
}

function handleResizeColumn(width: number, col: (typeof columns.value)[0]): void {
  col.width = width

  const savedWidths = JSON.parse(
    localStorage.getItem('projectsTableColumnWidths') || '{}',
  ) as Record<string, number>
  savedWidths[col.key] = width

  localStorage.setItem('projectsTableColumnWidths', JSON.stringify(savedWidths))
}
</script>

<style lang="scss" scoped>
.projectName {
  cursor: pointer;
}
</style>
