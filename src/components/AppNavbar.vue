<template>
  <div class="navbar">
    <div class="nav-left">
      <div class="logo" @click="goTo('/')">
        <svg
          class="paw-icon"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z"
          />
          <path
            d="M6 8C7.10457 8 8 8.89543 8 10C8 11.1046 7.10457 12 6 12C4.89543 12 4 11.1046 4 10C4 8.89543 4.89543 8 6 8Z"
          />
          <path
            d="M18 8C19.1046 8 20 8.89543 20 10C20 11.1046 19.1046 12 18 12C16.8954 12 16 11.1046 16 10C16 8.89543 16.8954 8 18 8Z"
          />
          <path
            d="M8 16C8 13.7909 9.79086 12 12 12C14.2091 12 16 13.7909 16 16C16 18.2091 14.2091 20 12 20C9.79086 20 8 18.2091 8 16Z"
          />
        </svg>
        <span class="logo-text">宠声健康 AI</span>
      </div>
    </div>

    <div class="nav-menu">
      <div
        class="menu-item"
        :class="{ active: activePath === '/' }"
        @click="goTo('/')"
      >
        首页
      </div>
      <div
        class="menu-item"
        :class="{ active: activePath === '/detect' }"
        @click="goTo('/detect')"
      >
        声音检测
      </div>
      <div
        class="menu-item"
        :class="{ active: activePath === '/report' }"
        @click="goTo('/report')"
      >
        健康报告
      </div>
      <div
        class="menu-item"
        :class="{ active: activePath === '/pet' }"
        @click="goTo('/pet')"
      >
        宠物档案
      </div>
      <div
        class="menu-item"
        :class="{ active: activePath === '/help' }"
        @click="goTo('/help')"
      >
        帮助中心
      </div>
    </div>

    <div class="nav-right">
      <template v-if="userEmail">
        <div class="user-pill" title="当前登录账号">
          {{ userEmail }}
        </div>
        <button class="btn-login" @click="onLogout">退出</button>
      </template>
      <template v-else>
        <button class="btn-login" @click="goTo('/login')">登录</button>
        <button class="btn-register" @click="goTo('/register')">立即注册</button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCurrentUser, logout } from '../utils/mockApi'

const props = defineProps({
  activePath: { type: String, default: '' }
})

const router = useRouter()
const route = useRoute()

const userEmail = computed(() => {
  // 让“登录/退出后”在路由跳转时自动刷新显示
  route.fullPath
  return getCurrentUser()?.email || ''
})

function goTo(path) {
  router.push(path)
}

async function onLogout() {
  await logout()
  if (route.path !== '/') router.push('/')
}
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.paw-icon {
  width: 24px;
  height: 24px;
  color: #fff;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 5vw;
  background: #1677ff;
  color: white;
  flex-wrap: wrap;
}

.nav-left .logo-text {
  font-size: 18px;
  font-weight: bold;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.menu-item {
  font-size: 14px;
  cursor: pointer;
}

.menu-item.active {
  font-weight: bold;
  border-bottom: 2px solid #fff;
  padding-bottom: 4px;
}

.nav-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.user-pill {
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.35);
  max-width: 210px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-login {
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.btn-register {
  background: #1677ff;
  border: none;
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.btn-register:hover {
  background: #0f6ef3;
}

.btn-login {
  transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.btn-login:hover {
  border-color: rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
}
</style>

