<template>
  <div class="page-container">
    <!-- 顶部导航 -->
    <div class="navbar">
      <div class="nav-left">
        <div class="logo">
          <svg 
            class="paw-icon" 
            viewBox="0 0 24 24" 
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2C13.1046 2 14 2.89543 14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2Z" />
            <path d="M6 8C7.10457 8 8 8.89543 8 10C8 11.1046 7.10457 12 6 12C4.89543 12 4 11.1046 4 10C4 8.89543 4.89543 8 6 8Z" />
            <path d="M18 8C19.1046 8 20 8.89543 20 10C20 11.1046 19.1046 12 18 12C16.8954 12 16 11.1046 16 10C16 8.89543 16.8954 8 18 8Z" />
            <path d="M8 16C8 13.7909 9.79086 12 12 12C14.2091 12 16 13.7909 16 16C16 18.2091 14.2091 20 12 20C9.79086 20 8 18.2091 8 16Z" />
          </svg>
          <span class="logo-text">宠声健康 AI</span>
        </div>
      </div>
      <div class="nav-menu">
        <div class="menu-item active">首页</div>
        <div class="menu-item" @click="goTo('/detect')">声音检测</div>
        <div class="menu-item" @click="goTo('/report')">健康报告</div>
        <div class="menu-item" @click="goTo('/pet')">宠物档案</div>
        <div class="menu-item" @click="goTo('/help')">帮助中心</div>
      </div>
      <div class="nav-right">
        <button class="btn-login" @click="goTo('/login')">登录</button>
        <button class="btn-register" @click="goTo('/register')">立即注册</button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="hero">
      <div class="hero-left">
        <div class="tag">AI 驱动 · 宠物健康守护</div>
        <h1 class="title">AI 听声辨宠健康</h1>
        <p class="subtitle">实时监测异常声音，读懂它的身体信号</p>
        <p class="desc">
          宠物不会说话？AI 帮你听懂它的身体信号，咳嗽、气喘、异常叫声一键识别。
          已有 100+ 宠主信赖。
        </p>

        <div class="btn-group">
          <!-- 蓝色按钮（立即检测） -->
          <button class="btn-primary" @click="goTo('/detect')">⚡ 立即检测</button>

          <!-- 新的容器：包含两个白色按钮 -->
          <div class="btn-group-secondary">
            <!-- 👇 这里加了跳转 -->
            <button class="btn-secondary" @click="goTo('/detect')">
              <span>🎤</span> 声音检测
            </button>
            <button class="btn-secondary" @click="goTo('/pet')">
              <span>🗂️</span> 宠物档案
            </button>
          </div>
        </div>

        <div class="tip">● 无需注册，免费体验 1 次检测</div>
        <div class="user-info">已服务 100+ 宠物家庭</div>
      </div>

      <div class="hero-right">
        <img src="https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/4/15/a22f28c5-d4cd-447b-a3ce-f4a50f5a79f7.png" alt="宠物" class="hero-img" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.page-container {
  width: 100%;
  min-height: 100vh;
  background: #f7f8fa;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.paw-icon {
  width: 24px;
  height: 24px;
  color: #fff; /* 白色爪印 */
}

/* 导航栏 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 5vw; /* 改成自适应内边距 */
  background: #1677ff;
  color: white;
  flex-wrap: wrap; /* 自动换行 */
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
  transition: all 0.2s ease;
}

/* 主体内容 */
.hero {
  display: flex;
  flex-wrap: wrap; /* 关键：自动换行 */
  align-items: center;
  justify-content: space-between;
  padding: 60px 5vw; /* 自适应边距 */
  gap: 30px;
}

.hero-left {
  text-align: left; /* 👈 文字强制左对齐 */
  flex: 1 1 350px; /* 关键：自动缩小 */
  color: #666666; /* 👈 正文颜色 */
}

.hero-img {
  /* 关键：上下轻微移动的动画 */
  animation: float 3s ease-in-out infinite;
}

/* 定义浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px); /* 向上移动8px，幅度很轻微 */
  }
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

/* 自动缩放字号 */
.title {
  font-size: clamp(40px, 8vw, 60px);
  font-weight: bold;
  /* 渐变色文字 */
  background: linear-gradient(90deg, #1677ff, #7c3aed, #ec4899);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin: 0 0 16px;
  line-height: 1.3; /* 标题行间距 */
}

.subtitle {
  font-size: clamp(16px, 3vw, 20px);
  font-weight: bold;
  color: #666666;
  margin: 0 0 20px;
  line-height: 1.5; /* 副标题行间距 */
}

.desc {
  font-size: 15px;
  color: #666666;
  line-height: 1.8;
  margin-bottom: 32px;
}

.btn-group {
  display: flex;       /* 改为水平布局 */
  align-items: flex-start; /* 顶部对齐 */
  gap: 24px;           /* 蓝色按钮和白色按钮之间的间距 */
  margin-bottom: 20px;
}

.btn-group-secondary {
  display: flex;
  flex-direction: column; /* 内部按钮垂直排列 */
  gap: 12px;              /* 两个白色按钮之间的间距 */
}

.btn-primary {
  background: #1677ff;
  color: white;
  border: none;
  padding: 36px 42px;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease; /* 鼠标悬浮更丝滑 */
  display: flex;
  align-items: center;
  gap: 8px; /* 图标和文字的间距 */
}
/* 可选：鼠标悬浮效果 */
.btn-primary:hover {
  transform: translateY(-2px);
  background: #0f6ef3;
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.3);
}

.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f9fafb;
  border: 1px solid #dddddd;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: #333333;
}

.btn-secondary:hover {
  background: #f7f8fa;
  color: #111827;
}

.tip {
  font-size: 13px;
  color: #9ca3af;
  margin-bottom: 10px;
}

.user-info {
  font-size: 13px;
  color: #9ca3af;
}

.hero-right {
  flex: 1 1 350px; /* 关键：自动缩小 */
  display: flex;
  justify-content: center;
}

.hero-right img {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 手机适配 */
@media (max-width: 768px) {
  .nav-menu {
    display: none; /* 小屏隐藏菜单 */
  }
  .hero {
    flex-direction: column-reverse;
    text-align: center;
  }
}
</style>