import { readJson, remove, uid, writeJson } from './storage'

/**
 * 这里是“前端模拟数据层”，所有方法都预留了后端接口位置（以注释标注）。
 * 将来接入后端时，只需要把这些函数内部替换为真实请求即可。
 */

const TOKEN_KEY = 'petai_token' // 与路由守卫一致（不加前缀）

function nowIso() {
  return new Date().toISOString()
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function getCurrentUser() {
  return readJson('user', null)
}

export async function loginWithEmail({ email, password }) {
  // TODO(后端接口): POST /api/auth/login  { email, password }
  // const res = await fetch('/api/auth/login', { method:'POST', body: JSON.stringify({ email, password }) })
  // return await res.json()
  await new Promise((r) => setTimeout(r, 300))
  const user = { id: 'u_1', email }
  writeJson('user', user)
  setAuthToken(`mock_${uid('token')}`)
  return user
}

export async function registerWithEmail({ email, password }) {
  // TODO(后端接口): POST /api/auth/register  { email, password }
  await new Promise((r) => setTimeout(r, 350))
  const user = { id: 'u_1', email }
  writeJson('user', user)
  setAuthToken(`mock_${uid('token')}`)
  return user
}

export async function logout() {
  // TODO(后端接口): POST /api/auth/logout
  remove('user')
  clearAuthToken()
}

export function listPets() {
  const user = getCurrentUser()
  if (!user) return []
  const all = readJson('pets', {})
  return all[user.id] || []
}

export async function upsertPet(pet) {
  // TODO(后端接口): POST /api/pets (新增) / PUT /api/pets/:id (编辑)
  const user = getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const all = readJson('pets', {})
  const list = all[user.id] || []

  if (pet.id) {
    const idx = list.findIndex((p) => p.id === pet.id)
    if (idx >= 0) list[idx] = { ...list[idx], ...pet }
  } else {
    list.unshift({ ...pet, id: uid('pet') })
  }

  all[user.id] = list
  writeJson('pets', all)
  await new Promise((r) => setTimeout(r, 150))
  return list
}

export async function deletePet(petId) {
  // TODO(后端接口): DELETE /api/pets/:id
  const user = getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const all = readJson('pets', {})
  all[user.id] = (all[user.id] || []).filter((p) => p.id !== petId)
  writeJson('pets', all)
  await new Promise((r) => setTimeout(r, 120))
  return all[user.id]
}

export function listHistory() {
  const user = getCurrentUser()
  if (!user) return []
  const all = readJson('history', {})
  return all[user.id] || []
}

export function getHistoryItem(id) {
  return listHistory().find((x) => x.id === id) || null
}

export async function deleteHistoryItem(id) {
  // TODO(后端接口): DELETE /api/detect/history/:id
  const user = getCurrentUser()
  if (!user) throw new Error('Not authenticated')
  const all = readJson('history', {})
  all[user.id] = (all[user.id] || []).filter((x) => x.id !== id)
  writeJson('history', all)
  await new Promise((r) => setTimeout(r, 120))
  return all[user.id]
}

export async function runDetect({ petId, fileMeta }) {
  // TODO(后端接口): POST /api/detect/run (multipart/form-data)
  // 参数示例：petId + audioFile
  await new Promise((r) => setTimeout(r, 650))

  const emotions = [
    { label: '兴奋', key: 'excited' },
    { label: '焦虑', key: 'anxious' },
    { label: '痛苦', key: 'pain' },
    { label: '应激', key: 'stress' }
  ]
  const picked = emotions[Math.floor(Math.random() * emotions.length)]
  const confidence = Number((0.72 + Math.random() * 0.25).toFixed(2))
  const mental = confidence > 0.85 ? '状态良好' : confidence > 0.78 ? '轻度波动' : '需要关注'
  const physical = confidence > 0.86 ? '体征稳定' : confidence > 0.8 ? '建议观察' : '建议复检'

  const advicePool = [
    '保持规律作息，减少突然的环境变化。',
    '适当增加互动与安抚，避免长时间独处。',
    '注意饮水与进食情况，观察是否有异常。',
    '若出现持续喘息/咳嗽等症状，请及时就医。',
    '减少高分贝噪音刺激，给予更安静的休息空间。'
  ]
  const advice = advicePool.sort(() => Math.random() - 0.5).slice(0, 4)

  const record = {
    id: uid('his'),
    petId,
    createdAt: nowIso(),
    method: '音频上传',
    fileMeta: fileMeta || null,
    emotion: { ...picked, confidence },
    health: { mental, physical },
    advice
  }

  // 写入历史（当前用户）
  const user = getCurrentUser()
  if (user) {
    const all = readJson('history', {})
    const list = all[user.id] || []
    all[user.id] = [record, ...list]
    writeJson('history', all)
  }

  // 便于“报告页”无 id 也能展示
  writeJson('last_report', record)
  return record
}

export function getLastReport() {
  return readJson('last_report', null)
}

export async function submitFeedback({ email, content }) {
  // TODO(后端接口): POST /api/feedback { email, content }
  await new Promise((r) => setTimeout(r, 300))
  return { ok: true }
}

