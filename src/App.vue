<script setup lang="ts">
import MessageStore from './components/MessageStore.vue'
</script>

<template>
  <div>
    <img src="/workers.png" class="logo" alt="Workers logo" />
  </div>
  <MessageStore title="Welcome to Vue Worker tryout" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
</style>
