<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped lang="scss">
header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .wrapper {
    max-width: 1200px;
    margin: 0px auto;
    padding: 16px;

    nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;

      a {
        text-decoration: none;
        color: #333;
        font-weight: bold;
        transition: color 0.3s ease;

        &:hover {
          color: hsla(160, 100%, 37%);
        }
      }
    }
  }
}
</style>
