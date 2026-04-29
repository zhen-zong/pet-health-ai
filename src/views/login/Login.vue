<template>
  <div class="page-container">
    <AppNavbar :active-path="'/login'" />

    <div class="content" style="position: relative; z-index: 10;">
      <div class="panel">
        <div class="panel-left">
          <div class="tag">AI 驱动 · 宠物健康守护</div>
          <div class="title">欢迎使用宠声健康 AI</div>
          <div class="desc">
            登录后可管理宠物档案、上传音频检测，并查看历史健康报告。
          </div>

          <div class="switcher">
            <button
              class="btn-secondary"
              :class="{ active: mode === 'login' }"
              @click="setMode('login')"
            >
              登录
            </button>
            <button
              class="btn-secondary"
              :class="{ active: mode === 'register' }"
              @click="setMode('register')"
            >
              注册
            </button>
          </div>

          <div class="mini-tip">
            提示：本版本为前端演示，登录/注册均为模拟接口。
          </div>
        </div>

        <div class="panel-right">
          <div class="form-title">
            {{ mode === 'login' ? '账号登录' : '创建账号' }}
          </div>

          <form class="form" @submit.prevent="onSubmit">
            <div class="field">
              <div class="label">邮箱</div>
              <input
                v-model="form.email"
                class="input"
                type="email"
                placeholder="name@example.com"
                autocomplete="email"
                @input="touched.email = true"
                @blur="touched.email = true"
              />
              <div v-if="touched.email && errors.email" class="error">
                {{ errors.email }}
              </div>
            </div>

            <div class="field">
              <div class="label">密码</div>
              <input
                v-model="form.password"
                class="input"
                type="password"
                placeholder="至少 6 位"
                autocomplete="current-password"
                @input="touched.password = true"
                @blur="touched.password = true"
              />
              <div v-if="touched.password && errors.password" class="error">
                {{ errors.password }}
              </div>
            </div>

            <div v-if="mode === 'register'" class="field">
              <div class="label">确认密码</div>
              <input
                v-model="form.confirmPassword"
                class="input"
                type="password"
                placeholder="请再次输入密码"
                autocomplete="new-password"
                @input="touched.confirmPassword = true"
                @blur="touched.confirmPassword = true"
              />
              <div v-if="touched.confirmPassword && errors.confirmPassword" class="error">
                {{ errors.confirmPassword }}
              </div>
            </div>

            <div v-if="submitError" class="submit-error">
              {{ submitError }}
            </div>

            <button class="btn-primary" type="submit" :disabled="submitting">
              {{ submitting ? '处理中...' : mode === 'login' ? '登录并进入首页' : '注册并进入首页' }}
            </button>

            <div class="form-footer">
              <button class="link" type="button" @click="goHome">返回首页</button>
              <button
                class="link"
                type="button"
                @click="mode === 'login' ? setMode('register') : setMode('login')"
              >
                {{ mode === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppNavbar from '../../components/AppNavbar.vue'
import { loginWithEmail, logout, registerWithEmail } from '../../utils/mockApi'

const router = useRouter()
const route = useRoute()

const mode = ref(route.query.mode === 'register' ? 'register' : 'login')

watchEffect(() => {
  if (route.path === '/login' && route.query.mode === 'register') mode.value = 'register'
})

const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

const touched = reactive({
  email: false,
  password: false,
  confirmPassword: false
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const errors = computed(() => {
  const e = {}
  const emailValue = String(form.email || '').trim()
  if (!emailValue) e.email = '请输入邮箱'
  else if (!emailRegex.test(emailValue)) e.email = '邮箱格式不正确'

  if (!form.password) e.password = '请输入密码'
  else if (String(form.password).length < 6) e.password = '密码长度至少 6 位'

  if (mode.value === 'register') {
    if (!form.confirmPassword) e.confirmPassword = '请再次输入密码'
    else if (form.confirmPassword !== form.password) e.confirmPassword = '两次输入的密码不一致'
  }
  return e
})

const canSubmit = computed(() => Object.keys(errors.value).length === 0)

const submitting = ref(false)
const submitError = ref('')

function setMode(next) {
  mode.value = next
  submitError.value = ''
  touched.email = false
  touched.password = false
  touched.confirmPassword = false
  if (next === 'login') form.confirmPassword = ''
  router.replace({ name: 'Login', query: next === 'register' ? { mode: 'register' } : {} })
}

function goHome() {
  router.push('/')
}

async function onSubmit() {
  touched.email = true
  touched.password = true
  touched.confirmPassword = true
  submitError.value = ''

  if (!canSubmit.value) return

  submitting.value = true
  try {
    if (mode.value === 'login') {
      await loginWithEmail({ email: String(form.email || '').trim(), password: form.password })
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/'
      router.push(redirect)
      return
    }

    await registerWithEmail({ email: String(form.email || '').trim(), password: form.password })
    await logout()
    submitError.value = ''
    mode.value = 'login'
    touched.email = false
    touched.password = false
    touched.confirmPassword = false
    form.password = ''
    form.confirmPassword = ''
    router.replace({ name: 'Login' })
  } catch (err) {
    submitError.value = err?.message || '操作失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
  position: relative;
}

.content {
  padding: 36px 5vw 60px;
  position: relative;
  z-index: 10 !important;
}

.panel {
  max-width: 1000px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 18px;
  align-items: stretch;
}

.panel-left,
.panel-right {
  border: 1px solid #eaecef;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  background: #fff;
  position: relative;
  z-index: 10;
}

.panel-left {
  padding: 20px 24px;
}

.panel-right {
  padding: 20px 24px;
}

.tag {
  display: inline-block;
  background: #e8f3ff;
  color: #1677ff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  margin-bottom: 16px;
}

.title {
  font-size: 24px;
  font-weight: 800;
  background: linear-gradient(90deg, #1677ff, #7c3aed, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 10px;
}

.desc {
  font-size: 14px;
  color: #666666;
  line-height: 1.8;
}

.switcher {
  margin-top: 18px;
  display: flex;
  gap: 10px;
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #dddddd;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #333333;
  flex: 1;
  transition: all 0.2s ease;
}

.btn-secondary.active {
  border-color: rgba(22, 119, 255, 0.45);
  box-shadow: 0 8px 20px rgba(22, 119, 255, 0.15);
}

.mini-tip {
  margin-top: 18px;
  font-size: 13px;
  color: #666666;
}

.form-title {
  font-size: 18px;
  font-weight: 800;
  color: #111827;
  margin-bottom: 12px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field .label {
  font-size: 13px;
  color: #666666;
  margin-bottom: 6px;
}

/* ========== 修复输入框核心样式 ========== */
.input {
  width: 100%;
  border: 1px solid #dddddd;
  background: #ffffff !important;
  color: #111827 !important;
  padding: 12px 14px;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  pointer-events: auto !important;
  opacity: 1 !important;
  user-select: text !important;
  -webkit-user-select: text !important;
  position: relative;
  z-index: 9999 !important;
  caret-color: #111827 !important;
}

.input:focus {
  border-color: rgba(22, 119, 255, 0.65);
  box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.12);
}

.error {
  margin-top: 6px;
  font-size: 12px;
  color: #ef4444;
}

.submit-error {
  font-size: 13px;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.06);
  border: 1px rgba(239, 68, 68, 0.25);
  padding: 10px 12px;
  border-radius: 10px;
}

.btn-primary {
  background: #1677ff;
  color: white;
  border: none;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  background: #0f6ef3;
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.28);
}

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 2px;
}

.link {
  border: none;
  background: transparent;
  color: #1677ff;
  cursor: pointer;
  font-size: 13px;
  padding: 4px 0;
}

@media (max-width: 900px) {
  .panel {
    grid-template-columns: 1fr;
  }
}
</style>