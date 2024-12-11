<template>
  <div class="about">
    <div class="header">
      <h2>Projects</h2>
      <CProjectModal />
    </div>

    <CProjectsTable />
  </div>
</template>

<script lang="ts" setup>
import CProjectsTable from '../components/projects/CProjectsTable.vue'
import CProjectModal from '../components/projects/CProjectModal.vue'
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}
.about {
  width: 100%;
  height: 100%;
}
</style>
