const PREFIX = 'petai__'

function safeJsonParse(raw, fallback) {
  if (!raw) return fallback
  try {
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function storageKey(key) {
  return `${PREFIX}${key}`
}

export function readJson(key, fallback) {
  return safeJsonParse(localStorage.getItem(storageKey(key)), fallback)
}

export function writeJson(key, value) {
  localStorage.setItem(storageKey(key), JSON.stringify(value))
}

export function remove(key) {
  localStorage.removeItem(storageKey(key))
}

export function uid(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

