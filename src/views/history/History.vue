<template>
  <AppLayout>
    <div class="header">
      <div>
        <div class="page-title">历史记录</div>
        <div class="page-subtitle">按时间倒序展示当前账号的检测记录（前端模拟数据）。</div>
      </div>
      <div class="filters">
        <button
          class="chip"
          :class="{ active: rangeDays === 7 }"
          @click="rangeDays = 7"
        >
          近 7 天
        </button>
        <button
          class="chip"
          :class="{ active: rangeDays === 30 }"
          @click="rangeDays = 30"
        >
          近 30 天
        </button>
      </div>
    </div>

    <div v-if="filtered.length === 0" class="empty">
      <div class="empty-title">暂无记录</div>
      <div class="empty-desc">去“声音检测”上传音频，生成第一条健康报告。</div>
      <button class="btn-primary" @click="goDetect">去检测</button>
    </div>

    <div v-else class="list">
      <div v-for="item in filtered" :key="item.id" class="row">
        <div class="left">
          <div class="topline">
            <span class="pet">{{ petName(item.petId) }}</span>
            <span class="sep">·</span>
            <span class="time">{{ timeText(item.createdAt) }}</span>
          </div>
          <div class="subline">
            <span class="badge">{{ item.emotion.label }}</span>
            <span class="conf">置信度 {{ Math.round(item.emotion.confidence * 100) }}%</span>
            <span class="sep">·</span>
            <span class="light">心理：{{ item.health.mental }}</span>
            <span class="sep">·</span>
            <span class="light">身体：{{ item.health.physical }}</span>
          </div>
        </div>

        <div class="right">
          <button class="btn-secondary" @click="viewDetail(item)">查看详情</button>
          <button class="btn-danger" @click="remove(item)">删除</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../../components/AppLayout.vue'
import { deleteHistoryItem, listHistory, listPets } from '../../utils/mockApi'

const router = useRouter()

const rangeDays = ref(7)
const history = ref(listHistory())
const pets = ref(listPets())

function petName(petId) {
  return pets.value.find((p) => p.id === petId)?.name || '未知宠物'
}

function timeText(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
}

const filtered = computed(() => {
  const now = Date.now()
  const ms = rangeDays.value * 24 * 60 * 60 * 1000
  return history.value
    .filter((x) => {
      const t = new Date(x.createdAt).getTime()
      if (Number.isNaN(t)) return true
      return now - t <= ms
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
})

function viewDetail(item) {
  router.push({ path: '/report', query: { id: item.id } })
}

async function remove(item) {
  const ok = window.confirm('确定删除该条记录吗？')
  if (!ok) return
  history.value = await deleteHistoryItem(item.id)
}

function goDetect() {
  router.push('/detect')
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.page-title {
  font-size: 22px;
  font-weight: 800;
  color: #333333;
}

.page-subtitle {
  margin-top: 8px;
  font-size: 18px;
  color: #666666;
  line-height: 1.8;
}

.filters {
  display: flex;
  gap: 10px;
}

.chip {
  background: #fff;
  border: 1px solid #dddddd;
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  color: #333333;
  font-size: 13px;
}

.chip.active {
  border-color: rgba(22, 119, 255, 0.45);
  box-shadow: 0 8px 20px rgba(22, 119, 255, 0.12);
  color: #333333;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.row {
  border: 1px solid #eaecef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.topline {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pet {
  font-weight: 800;
  color: #111827;
  font-size: 14px;
}

.time {
  font-size: 13px;
  color: #666666;
}

.subline {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 14px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e8f3ff;
  color: #1677ff;
  font-weight: 800;
}

.conf {
  color: #111827;
  font-weight: 700;
}

.light {
  color: #666666;
}

.sep {
  color: #d1d5db;
}

.right {
  display: flex;
  gap: 10px;
  white-space: nowrap;
}

.btn-primary {
  background: #1677ff;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  background: #0f6ef3;
  box-shadow: 0 10px 24px rgba(22, 119, 255, 0.28);
}

.btn-secondary {
  background: #fff;
  border: 1px solid #dddddd;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  color: #333333;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f7f8fa;
  color: #333333;
}

.btn-danger {
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.empty {
  border: 1px dashed #c7ddfb;
  background: #f0f7ff;
  border-radius: 12px;
  padding: 22px;
  text-align: center;
}

.empty-title {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
}

.empty-desc {
  margin-top: 8px;
  font-size: 13px;
  color: #666666;
}

@media (max-width: 720px) {
  .row {
    flex-direction: column;
    align-items: flex-start;
  }
  .right {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

