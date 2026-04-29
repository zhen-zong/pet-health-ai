<template>
  <div class="page-container">
    <AppNavbar :active-path="activePath" />

    <div class="content">
      <div class="content-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavbar from './AppNavbar.vue'

const route = useRoute()

const activePath = computed(() => {
  const p = route.path || '/'
  if (p.startsWith('/pet')) return '/pet'
  if (p.startsWith('/detect')) return '/detect'
  if (p.startsWith('/report')) return '/report'
  if (p.startsWith('/help')) return '/help'
  return p
})
</script>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}

.content {
  padding: 36px 5vw 60px;
}

.content-inner {
  max-width: 1000px;
  margin: 0 auto;
  text-align: left;
}
</style>

