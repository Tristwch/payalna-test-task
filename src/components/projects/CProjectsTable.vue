<template>
  <a-table
    :columns="columns"
    :data-source="projectsStore.projects"
    :pagination="false"
    @resizeColumn="handleResizeColumn"
  >
    <template
      #customFilterDropdown="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
    >
      <div style="padding: 8px">
        <a-input
          ref="searchInput"
          :placeholder="`Пошук ${column.dataIndex}`"
          :value="selectedKeys[0]"
          style="width: 188px; margin-bottom: 8px; display: block"
          @change="(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])"
          @pressEnter="handleSearch(selectedKeys, confirm, column.dataIndex)"
        />
        <a-button
          type="primary"
          size="small"
          style="width: 90px; margin-right: 8px"
          @click="handleSearch(selectedKeys, confirm, column.dataIndex)"
        >
          <template #icon><SearchOutlined /></template>
          Пошук
        </a-button>
        <a-button size="small" style="width: 90px" @click="handleReset(clearFilters)">
          Скинути
        </a-button>
      </div>
    </template>

    <template #customFilterIcon="{ filtered, column }">
      <template v-if="column.key === 'projectName'">
        <SearchOutlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
      <template v-else>
        <FilterOutlined :style="{ color: filtered ? '#108ee9' : undefined }" />
      </template>
    </template>

    <template #bodyCell="{ text, column, record }">
      <template v-if="column.key === 'projectName'">
        <div class="projectName">
          <RouterLink :to="`/projects/${record.id}`">
            <span v-if="state.searchText && state.searchedColumn === column.dataIndex">
              <template
                v-for="(fragment, i) in text
                  .toString()
                  .split(new RegExp(`(?<=${state.searchText})|(?=${state.searchText})`, 'i'))"
              >
                <mark
                  v-if="fragment.toLowerCase() === state.searchText.toLowerCase()"
                  :key="i"
                  class="highlight"
                >
                  {{ fragment }}
                </mark>
                <template v-else>{{ fragment }}</template>
              </template>
            </span>
            <span v-else>{{ text }}</span>
          </RouterLink>
        </div>
      </template>

      <template v-if="column.key === 'status'">
        <a-tag :color="record.status === 'Активний' ? 'green' : 'red'">
          {{ record.status }}
        </a-tag>
      </template>

      <template v-if="column.key === 'action'">
        <a-dropdown :placement="'left'">
          <a class="ant-dropdown-link" @click.prevent>
            <EllipsisOutlined />
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="openModal(record)">Редагувати</a-menu-item>
              <a-menu-item @click="projectsStore.deleteProject(record.id)">Видалити</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>

  <CProjectModal />
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { useProjectsStore } from '../../stores/projects'
import { EllipsisOutlined, SearchOutlined, FilterOutlined } from '@ant-design/icons-vue'
import CProjectModal from './CProjectModal.vue'
import type { IProjects } from '../..//types/projects'
import type { TableColumnsType } from 'ant-design-vue'

const columns = ref<TableColumnsType<IProjects>>([
  {
    title: 'Назва проекту',
    dataIndex: 'projectName',
    key: 'projectName',
    resizable: true,
    width: 200,
    sorter: {
      compare: (a, b) => a.projectName.localeCompare(b.projectName),
      multiple: 1,
    },
    customFilterDropdown: true,
    onFilter: (value, record) => record.projectName.toLowerCase().includes(value.toLowerCase()),
  },
  {
    title: 'ID проекту',
    dataIndex: 'id',
    key: 'projectId',
    resizable: true,
    width: 150,
    sorter: {
      compare: (a, b) => a.id.localeCompare(b.id),
      multiple: 2,
    },
  },
  {
    title: 'Кількість завдань',
    dataIndex: 'taskCount',
    key: 'taskCount',
    resizable: true,
    width: 200,
    minWidth: 100,
    sorter: {
      compare: (a, b) => b.taskCount - a.taskCount,
      multiple: 3,
    },
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    resizable: true,
    width: 100,
    filters: [
      {
        text: 'Активний',
        value: 'Активний',
      },
      {
        text: 'Завершений',
        value: 'Завершений',
      },
    ],
    onFilter: (value: string, record: IProjects) => record.status.indexOf(value) === 0,
    sorter: {
      compare: (a, b) => a.status.localeCompare(b.status),
      multiple: 4,
    },
  },
  {
    title: 'Дата створення',
    dataIndex: 'creationDate',
    key: 'creationDate',
    resizable: true,
    width: 150,
    sorter: {
      compare: (a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime(),
      multiple: 3,
    },
  },
  {
    title: '',
    key: 'action',
    dataIndex: 'action',
    width: 50,
  },
])

const projectsStore = useProjectsStore()
const searchInput = ref()

const state = reactive({
  searchText: '',
  searchedColumn: '',
})

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

const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm()
  state.searchText = selectedKeys[0]
  state.searchedColumn = dataIndex
}

const handleReset = (clearFilters) => {
  clearFilters({ confirm: true })
  state.searchText = ''
}
</script>

<style lang="scss" scoped>
.projectName {
  cursor: pointer;
}
.highlight {
  background-color: rgb(255, 192, 105);
  padding: 0px;
}
</style>
