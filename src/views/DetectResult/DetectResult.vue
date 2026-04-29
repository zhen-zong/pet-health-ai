<template>
  <AppLayout>
    <div class="header">
      <div>
        <div class="page-title">检测结果 / 健康报告</div>
        <div class="page-subtitle">情绪识别与健康状态评估结果如下（演示版：前端模拟数据）。</div>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" @click="goBack">返回上一页</button>
        <button class="btn-primary" @click="goHistory">查看历史记录</button>
      </div>
    </div>

    <div v-if="!record" class="empty">
      <div class="empty-title">暂无报告</div>
      <div class="empty-desc">请先前往“声音检测”上传音频并开始检测。</div>
      <button class="btn-primary" @click="goDetect">去检测</button>
    </div>

    <template v-else>
      <div class="grid">
        <div class="card">
          <div class="card-title">宠物信息</div>
          <div class="pet">
            <img class="avatar" :src="pet?.avatar || defaultAvatar" alt="avatar" />
            <div class="pet-meta">
              <div class="pet-name">{{ pet?.name || '未知宠物' }}</div>
              <div class="pet-desc">
                {{ pet?.breed || '-' }} · {{ pet?.age ?? '-' }} 岁 · {{ pet?.gender || '-' }}
              </div>
            </div>
          </div>

          <div class="kv">
            <div class="k">检测时间</div>
            <div class="v">{{ timeText }}</div>
          </div>
          <div class="kv">
            <div class="k">检测方式</div>
            <div class="v">{{ record.method }}</div>
          </div>
          <div class="kv" v-if="record.fileMeta?.name">
            <div class="k">音频文件</div>
            <div class="v">{{ record.fileMeta.name }}</div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">情绪识别结果</div>
          <div class="emotion">
            <div class="badge">{{ record.emotion.label }}</div>
            <div class="confidence">
              置信度：<span class="num">{{ Math.round(record.emotion.confidence * 100) }}%</span>
            </div>
          </div>
          <div class="bar">
            <div class="bar-inner" :style="{ width: `${Math.round(record.emotion.confidence * 100)}%` }" />
          </div>
          <div class="note">
            说明：该结果用于健康辅助评估，如出现持续异常症状请及时就医。
          </div>
        </div>

        <div class="card">
          <div class="card-title">健康评估</div>
          <div class="health">
            <div class="health-item">
              <div class="h-label">心理状态</div>
              <div class="h-value">{{ record.health.mental }}</div>
            </div>
            <div class="health-item">
              <div class="h-label">身体状态</div>
              <div class="h-value">{{ record.health.physical }}</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-title">个性化养护建议</div>
          <ul class="advice">
            <li v-for="(a, idx) in record.advice" :key="idx">
              <span class="dot">●</span>
              <span class="txt">{{ a }}</span>
            </li>
          </ul>
          <div class="card-actions">
            <button class="btn-secondary" @click="goDetect">再次检测</button>
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../../components/AppLayout.vue'
import { getHistoryItem, getLastReport, listPets } from '../../utils/mockApi'

const router = useRouter()
const route = useRoute()

const defaultAvatar =
  'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/4/15/a22f28c5-d4cd-447b-a3ce-f4a50f5a79f7.png'

const record = computed(() => {
  const id = typeof route.query.id === 'string' ? route.query.id : ''
  return id ? getHistoryItem(id) : getLastReport()
})

const pet = computed(() => {
  if (!record.value?.petId) return null
  return listPets().find((p) => p.id === record.value.petId) || null
})

const timeText = computed(() => {
  const iso = record.value?.createdAt
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleString()
})

function goBack() {
  router.back()
}

function goHistory() {
  router.push('/history')
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

.header-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.card {
  border: 1px solid #eaecef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;
}

.card-title {
  font-size: 18px;
  font-weight: 800;
  color: #333333;
  margin-bottom: 12px;
}

.pet {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  object-fit: cover;
  border: 1px solid #dddddd;
}

.pet-name {
  font-size: 16px;
  font-weight: 800;
  color: #333333;
}

.pet-desc {
  margin-top: 4px;
  font-size: 13px;
  color: #666666;
}

.kv {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 0;
  border-top: 1px dashed #e6eefc;
}

.k {
  font-size: 13px;
  color: #666666;
}

.v {
  font-size: 13px;
  color: #333333;
  text-align: right;
  max-width: 70%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.emotion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #e8f3ff;
  color: #1677ff;
  font-size: 13px;
  font-weight: 800;
}

.confidence {
  font-size: 13px;
  color: #666666;
}

.num {
  color: #333333;
  font-weight: 800;
}

.bar {
  margin-top: 12px;
  height: 10px;
  background: #f7f8fa;
  border: 1px solid #eaecef;
  border-radius: 999px;
  overflow: hidden;
}

.bar-inner {
  height: 100%;
  background: linear-gradient(90deg, #1677ff, #7c3aed);
  border-radius: 999px;
}

.note {
  margin-top: 12px;
  font-size: 12px;
  color: #666666;
  line-height: 1.8;
}

.health {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.health-item {
  border: 1px solid #eaecef;
  border-radius: 12px;
  background: #f7f8fa;
  padding: 16px;
}

.h-label {
  font-size: 12px;
  color: #666666;
}

.h-value {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 800;
  color: #333333;
}

.advice {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.advice li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
}

.dot {
  color: #1677ff;
  line-height: 1.2;
  margin-top: 2px;
}

.card-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
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
  white-space: nowrap;
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
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f7f8fa;
  color: #333333;
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
  color: #333333;
}

.empty-desc {
  margin-top: 8px;
  font-size: 13px;
  color: #666666;
}

@media (max-width: 860px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .health {
    grid-template-columns: 1fr;
  }
}
</style>
