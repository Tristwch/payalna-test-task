<script setup lang="ts">
import CTasksTable from '../components/tasks/CTasksTable.vue'
import CTasksModal from '../components/tasks/CTasksModal.vue'
import { useTasksStore } from '../stores/tasks'

const tasksStore = useTasksStore()

const openCreateModal = () => {
  tasksStore.openModal('create')
}
</script>

<template>
  <div class="header">
    <h2>Завдання</h2>
    <a-button type="primary" @click="openCreateModal">Створити завдання</a-button>
    <CTasksModal />
  </div>

  <CTasksTable />
</template>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.main {
  width: 100%;
  height: 100%;
}
</style>
