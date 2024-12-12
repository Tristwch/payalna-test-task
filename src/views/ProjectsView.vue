<template>
  <div class="projects">
    <div class="header">
      <h2>Проекти</h2>
      <a-button @click="openCreateModal" type="primary">Створити проект</a-button>
      <CProjectModal />
    </div>

    <CProjectsTable />
  </div>
</template>

<script lang="ts" setup>
import { useProjectsStore } from '../components/store/projects'
import CProjectsTable from '../components/projects/CProjectsTable.vue'
import CProjectModal from '../components/projects/CProjectModal.vue'

const projectsStore = useProjectsStore()

const openCreateModal = () => {
  projectsStore.openModal('create')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.projects {
  width: 100%;
  height: 100%;
}
</style>
