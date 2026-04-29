// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

/**
 * 路由约定（与首页菜单保持一致）：
 * - /               首页（已完成：Index.vue）
 * - /login          登录/注册（同一页通过 query 切换面板）
 * - /register       重定向到 /login?mode=register（首页按钮使用）
 * - /detect         音频上传检测
 * - /report         检测结果/健康报告
 * - /history        历史记录
 * - /pet            宠物档案
 * - /help           帮助中心
 */
const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../views/index/Index.vue')  // 首页
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login/Login.vue'), // 登录/注册页
        meta: { public: true }
    },
    {
        path: '/register',
        name: 'Register',
        redirect: { name: 'Login', query: { mode: 'register' } },
        meta: { public: true }
    },
    {
        path: '/detect',
        name: 'Detect',
        component: () => import('../views/Upload/Upload.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/report',
        name: 'Report',
        component: () => import('../views/DetectResult/DetectResult.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/history',
        name: 'History',
        component: () => import('../views/History/History.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/pet',
        name: 'PetProfile',
        component: () => import('../views/PetProfile/PetProfile.vue'),
        meta: { requireAuth: true }
    },
    {
        path: '/pet-profile',
        redirect: { name: 'PetProfile' }
    },
    {
        path: '/help',
        name: 'Help',
        component: () => import('../views/Help/Help.vue'),
        meta: { public: true }
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: { name: 'Home' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to) => {
    const isPublic = Boolean(to.meta?.public)
    const requireAuth = Boolean(to.meta?.requireAuth)

    if (isPublic && !requireAuth) return true

    // 登录态（前端模拟）：localStorage 存在 token 即视为已登录
    const token = localStorage.getItem('petai_token')
    if (requireAuth && !token) {
        return { name: 'Login', query: { redirect: to.fullPath } }
    }
    return true
})

export default router