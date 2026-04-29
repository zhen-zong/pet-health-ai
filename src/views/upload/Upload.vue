<template>
  <AppLayout>
    <div class="header">
      <div>
        <div class="page-title">音频上传检测</div>
        <div class="page-subtitle">选择宠物并上传 MP3/WAV 音频，系统将识别情绪并评估健康状态。</div>
      </div>
    </div>

    <div class="card">
      <div class="row">
        <div class="label">选择宠物</div>
        <select v-model="selectedPetId" class="input" :disabled="pets.length === 0">
          <option value="">请选择一只宠物</option>
          <option v-for="p in pets" :key="p.id" :value="p.id">
            {{ p.name }}（{{ p.breed }}）
          </option>
        </select>
      </div>

      <div v-if="pets.length === 0" class="hint">
        你还没有添加宠物档案。请先前往“宠物档案”添加宠物。
        <button class="link" @click="goToPet">去添加</button>
      </div>

      <div class="divider" />

      <div class="row">
        <div class="label">上传音频</div>
        <input
          ref="fileInputRef"
          class="input file"
          type="file"
          accept=".mp3,.wav,audio/mpeg,audio/wav"
          @change="onPickFile"
        />
        <div class="subtext">仅支持 MP3/WAV，单文件 ≤ 50MB</div>
        <div v-if="fileError" class="error">{{ fileError }}</div>
      </div>

      <div v-if="fileState.url" class="preview">
        <div class="preview-top">
          <div class="file-name">
            {{ fileState.name }}
            <span class="file-meta">（{{ fileState.sizeText }}）</span>
          </div>
          <button class="btn-danger" @click="removeFile">移除</button>
        </div>

        <audio ref="audioRef" class="audio" :src="fileState.url" controls />
      </div>

      <div class="actions">
        <button class="btn-secondary" @click="goHome">返回首页</button>
        <button
          class="btn-primary"
          :disabled="detecting || !canDetect"
          @click="startDetect"
        >
          {{ detecting ? '检测中...' : '开始检测' }}
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '../../components/AppLayout.vue'
import { listPets, runDetect } from '../../utils/mockApi'

const router = useRouter()

// ========== 修复 1：宠物列表必须每次都重新获取 ==========
const pets = computed(() => listPets() || [])

// ========== 修复 2：正确初始化选中值 ==========
const selectedPetId = ref('')

const fileInputRef = ref(null)
const audioRef = ref(null)

const fileError = ref('')
const detecting = ref(false)

const fileState = ref({
  file: null,
  url: '',
  name: '',
  size: 0,
  sizeText: ''
})

const canDetect = computed(() => {
  return !!selectedPetId.value && !!fileState.value.file
})

function goHome() {
  router.push('/')
}

function goToPet() {
  router.push('/pet')
}

function formatSize(bytes) {
  const mb = bytes / 1024 / 1024
  if (mb >= 1) return `${mb.toFixed(2)}MB`
  const kb = bytes / 1024
  return `${kb.toFixed(0)}KB`
}

function validateFile(file) {
  if (!file) return '请选择音频文件'

  const name = String(file.name || '').toLowerCase()
  const type = String(file.type || '').toLowerCase()
  const okType =
    name.endsWith('.mp3') ||
    name.endsWith('.wav') ||
    type.includes('audio/mpeg') ||
    type.includes('audio/wav')

  if (!okType) return '仅支持 MP3/WAV 格式'

  const max = 50 * 1024 * 1024
  if (file.size > max) return '文件过大（需 ≤ 50MB）'

  return ''
}

function onPickFile(e) {
  fileError.value = ''
  const file = e?.target?.files?.[0]
  const err = validateFile(file)
  if (err) {
    fileError.value = err
    removeFile()
    return
  }

  removeFile(false)
  const url = URL.createObjectURL(file)
  fileState.value = {
    file,
    url,
    name: file.name,
    size: file.size,
    sizeText: formatSize(file.size)
  }
}

function removeFile(resetInput = true) {
  if (fileState.value.url) URL.revokeObjectURL(fileState.value.url)
  fileState.value = { file: null, url: '', name: '', size: 0, sizeText: '' }
  if (resetInput && fileInputRef.value) fileInputRef.value.value = ''
  if (audioRef.value) audioRef.value.pause?.()
}

onBeforeUnmount(() => {
  if (fileState.value.url) URL.revokeObjectURL(fileState.value.url)
})

async function startDetect() {
  fileError.value = ''
  if (!canDetect.value) {
    fileError.value = '请先选择宠物并上传音频'
    return
  }

  detecting.value = true
  try {
    const record = await runDetect({
      petId: selectedPetId.value,
      fileMeta: {
        name: fileState.value.name,
        size: fileState.value.size
      }
    })
    router.push({ path: '/report', query: { id: record.id } })
  } finally {
    detecting.value = false
  }
}
</script>

<style scoped>
.header {
  margin-bottom: 14px;
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

.card {
  border: 1px solid #eaecef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;
}

.row {
  margin-bottom: 14px;
}

.label {
  font-size: 13px;
  color: #666666;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  border: 1px solid #dddddd;
  background: #ffffff;
  color: #333333;
  padding: 12px 14px;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
}

.input:focus {
  border-color: rgba(22, 119, 255, 0.65);
  box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.12);
}

.subtext {
  margin-top: 8px;
  font-size: 12px;
  color: #666666;
}

.error {
  margin-top: 8px;
  font-size: 12px;
  color: #ef4444;
}

.hint {
  margin-top: 10px;
  font-size: 13px;
  color: #666666;
  background: #f0f7ff;
  border: 1px dashed #c7ddfb;
  padding: 10px 12px;
  border-radius: 8px;
}

.link {
  border: none;
  background: transparent;
  color: #1677ff;
  cursor: pointer;
  margin-left: 8px;
}

.divider {
  height: 1px;
  background: #eaecef;
  margin: 14px 0;
}

.preview {
  border: 1px solid #eaecef;
  border-radius: 12px;
  padding: 12px;
  background: #f7f8fa;
  margin-top: 10px;
}

.preview-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;
}

.file-name {
  font-size: 14px;
  font-weight: 700;
  color: #333333;
}

.file-meta {
  font-size: 12px;
  font-weight: 400;
  color: #666666;
}

.audio {
  width: 100%;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
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

.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  white-space: nowrap;
}
</style>