<template>
  <AppLayout>
    <div class="header">
      <div>
        <div class="page-title">宠物档案管理</div>
        <div class="page-subtitle">为每只宠物建立档案，便于后续检测与健康追踪。</div>
      </div>
      <button class="btn-primary" @click="openCreate">＋ 添加宠物</button>
    </div>

    <div v-if="pets.length === 0" class="empty">
      <div class="empty-title">还没有宠物档案</div>
      <div class="empty-desc">先添加一只宠物，再去“声音检测”上传音频。</div>
      <button class="btn-secondary" @click="openCreate">立即添加</button>
    </div>

    <div v-else class="grid">
      <div v-for="p in pets" :key="p.id" class="card">
        <div class="card-top">
          <img class="avatar" :src="p.avatar || defaultAvatar" alt="avatar" />
          <div class="meta">
            <div class="name">{{ p.name }}</div>
            <div class="desc">
              {{ p.breed }} · {{ p.age }} 岁 · {{ p.gender }}
            </div>
          </div>
        </div>
        <div class="actions">
          <button class="btn-secondary" @click="openEdit(p)">编辑</button>
          <button class="btn-danger" @click="onDelete(p)">删除</button>
        </div>
      </div>
    </div>

    <BaseModal
      :open="modal.open"
      :title="modal.mode === 'create' ? '新增宠物' : '编辑宠物信息'"
      @close="closeModal"
    >
      <div class="form">
        <div class="field">
          <div class="label">名称</div>
          <input v-model.trim="form.name" class="input" placeholder="例如：豆豆" />
          <div v-if="touched.name && errors.name" class="error">{{ errors.name }}</div>
        </div>

        <div class="field">
          <div class="label">品种</div>
          <input v-model.trim="form.breed" class="input" placeholder="例如：布偶 / 柴犬" />
          <div v-if="touched.breed && errors.breed" class="error">{{ errors.breed }}</div>
        </div>

        <div class="two-col">
          <div class="field number-field">
            <div class="label">年龄（岁）</div>
            <div class="number-input-wrap">
              <input 
                v-model.number="form.age" 
                class="input age-input" 
                type="number" 
                min="0" 
                max="30" 
              />
              <div class="number-btns">
                <span class="btn-up" @click="form.age = Math.min(form.age + 1, 30)">+</span>
                <span class="btn-down" @click="form.age = Math.max(form.age - 1, 0)">-</span>
              </div>
            </div>
            <div v-if="touched.age && errors.age" class="error">{{ errors.age }}</div>
          </div>

          <div class="field">
            <div class="label">性别</div>
            <select v-model="form.gender" class="input">
              <option value="公">公</option>
              <option value="母">母</option>
              <option value="未知">未知</option>
            </select>
          </div>
        </div>

        <div class="field">
          <div class="label">头像（URL，可选）</div>
          <input v-model.trim="form.avatar" class="input" placeholder="https://..." />
        </div>
      </div>

      <template #footer>
        <button class="btn-secondary" @click="closeModal">取消</button>
        <button class="btn-primary" :disabled="saving || !canSave" @click="onSave">
          {{ saving ? '保存中...' : '保存' }}
        </button>
      </template>
    </BaseModal>
  </AppLayout>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import AppLayout from '../../components/AppLayout.vue'
import BaseModal from '../../components/BaseModal.vue'
import { deletePet, listPets, upsertPet } from '../../utils/mockApi'

const defaultAvatar = 'https://spark-builder.s3.cn-north-1.amazonaws.com.cn/image/2026/4/15/a22f28c5-d4cd-447b-a3ce-f4a50f5a79f7.png'

const pets = ref(listPets())

const modal = reactive({
  open: false,
  mode: 'create',
  editingId: ''
})

const form = reactive({
  name: '',
  breed: '',
  age: 1,
  gender: '未知',
  avatar: ''
})

const touched = reactive({
  name: false,
  breed: false,
  age: false
})

const errors = computed(() => {
  const e = {}
  if (!form.name) e.name = '请输入名称'
  if (!form.breed) e.breed = '请输入品种'
  if (form.age === '' || form.age === null || Number.isNaN(Number(form.age))) e.age = '请输入年龄'
  else if (Number(form.age) < 0 || Number(form.age) > 30) e.age = '年龄范围 0-30'
  return e
})

const canSave = computed(() => Object.keys(errors.value).length === 0)
const saving = ref(false)

function resetTouched() {
  touched.name = false
  touched.breed = false
  touched.age = false
}

function openCreate() {
  modal.open = true
  modal.mode = 'create'
  modal.editingId = ''
  form.name = ''
  form.breed = ''
  form.age = 1
  form.gender = '未知'
  form.avatar = ''
  resetTouched()
}

function openEdit(p) {
  modal.open = true
  modal.mode = 'edit'
  modal.editingId = p.id
  form.name = p.name
  form.breed = p.breed
  form.age = Number(p.age || 0)
  form.gender = p.gender || '未知'
  form.avatar = p.avatar || ''
  resetTouched()
}

function closeModal() {
  modal.open = false
}

async function onSave() {
  touched.name = true
  touched.breed = true
  touched.age = true
  if (!canSave.value) return

  saving.value = true
  try {
    const next = await upsertPet({
      id: modal.mode === 'edit' ? modal.editingId : '',
      name: form.name,
      breed: form.breed,
      age: Number(form.age),
      gender: form.gender,
      avatar: form.avatar
    })
    pets.value = next
    closeModal()
  } finally {
    saving.value = false
  }
}

async function onDelete(p) {
  const ok = window.confirm(`确定删除“${p.name}”的档案吗？`)
  if (!ok) return
  pets.value = await deletePet(p.id)
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
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.card {
  border: 1px solid #eaecef;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card-top {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  object-fit: cover;
  border: 1px solid #dddddd;
}

.name {
  font-size: 16px;
  font-weight: 800;
  color: #111827;
}

.desc {
  margin-top: 4px;
  font-size: 13px;
  color: #666666;
}

.actions {
  display: flex;
  gap: 10px;
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

.btn-danger:hover {
  background: rgba(239, 68, 68, 0.12);
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

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.label {
  font-size: 13px;
  color: #666666;
  margin-bottom: 6px;
}

.input {
  width: 100%;
  border: 1px solid #dddddd;
  background: #ffffff !important;
  color: #111827 !important;
  padding: 12px 14px;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  position: relative;
  z-index: 9999 !important;
  pointer-events: auto !important;
  caret-color: #333333 !important;
  opacity: 1 !important;
}

.input:focus {
  border-color: rgba(22, 119, 255, 0.65);
  box-shadow: 0 0 0 4px rgba(22, 119, 255, 0.12);
}

/* 年龄输入框美化 —— 竖向拉长长条按钮 */
.number-field {
  position: relative;
}
.number-input-wrap {
  position: relative;
  width: 100%;
}
.age-input {
  padding-right: 56px !important;
}
.age-input::-webkit-inner-spin-button,
.age-input::-webkit-outer-spin-button {
  display: none;
}
.number-btns {
  position: absolute;
  right: 6px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  height: calc(100% - 12px);
  justify-content: space-between;
}
.btn-up,
.btn-down {
  width: 40px;
  height: 48%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  color: #555;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
}
.btn-up:hover,
.btn-down:hover {
  background: #e8f3ff;
  color: #1677ff;
}

.error {
  margin-top: 6px;
  font-size: 12px;
  color: #ef4444;
}

@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
  .two-col {
    grid-template-columns: 1fr;
  }
}
</style>