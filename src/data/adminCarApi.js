/** AWS Lambda HTTP APIs — used by /addcar admin form */
export const GET_UPLOAD_URL_API =
  'https://gnnohfspok.execute-api.ap-southeast-2.amazonaws.com/default/get_upload_url'
export const ADDCAR_API =
  'https://n8eemiewzi.execute-api.ap-southeast-2.amazonaws.com/default/addcar'
export const GET_ADMIN_CARS_API =
  'https://utgpizuum2.execute-api.ap-southeast-2.amazonaws.com/default/getadmincars'
export const GET_CAR_DETAIL_API =
  'https://kol9ykxns2.execute-api.ap-southeast-2.amazonaws.com/default/getcardetail'

/** updateInfo Lambda — 仅传改动的字段即可，其余服务端与 Dynamo 现有项合并 */
export const UPDATE_CAR_API =
  'https://qpzh1n6dya.execute-api.ap-southeast-2.amazonaws.com/default/updateInfo'

/** 车辆删除 Lambda — POST JSON `{ "carId": "..." }` */
export const DELETE_CAR_API =
  'https://7spqzazh0d.execute-api.ap-southeast-2.amazonaws.com/default/deletecar'

const ADMIN_CAR_DETAIL_CACHE_PREFIX = 'adminCarDetail:'

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * get_upload_url Lambda：只读统一 imageIndex 命名 S3 键
 * - 1 → cover.{ext}
 * - 2、3 → 2.{ext}、3.{ext}
 * - 4+ → 图库 4.{ext}、5.{ext}…
 */
export const ADMIN_COVER_IMAGE_COUNT = 3
export const ADMIN_GALLERY_IMAGE_INDEX_START = ADMIN_COVER_IMAGE_COUNT + 1

/** Dynamo 库存列表：按所选品牌生成 Model 多选（value = make|model） */
export function adminModelOptionsFromItems(items, makesFilter) {
  if (!items?.length) return []
  const list = makesFilter.length ? items.filter((v) => makesFilter.includes(v.make)) : items
  const seen = new Set()
  const out = []
  for (const v of list) {
    if (!v.make || !v.model) continue
    const value = `${v.make}|${v.model}`
    if (seen.has(value)) continue
    seen.add(value)
    const label = makesFilter.length === 1 ? v.model : `${v.model} (${v.make})`
    out.push({ value, label })
  }
  out.sort((a, b) => a.label.localeCompare(b.label, 'en-NZ'))
  return out
}

/** 读上次 getcardetail 成功写入的 session 缓存（无则 null） */
export function readAdminCarDetailCache(carId) {
  if (!carId) return null
  try {
    const raw = sessionStorage.getItem(ADMIN_CAR_DETAIL_CACHE_PREFIX + carId)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearAdminCarDetailCache(carId) {
  if (!carId) return
  try {
    sessionStorage.removeItem(ADMIN_CAR_DETAIL_CACHE_PREFIX + carId)
  } catch {
    /* ignore */
  }
}

/**
 * POST deletecar — body `{ carId }`。未配置 DELETE_CAR_API 时抛错。
 * @param {string} carId
 */
export async function deleteAdminCar(carId) {
  const id = String(carId || '').trim()
  if (!id) throw new Error('carId 为空')

  const apiUrl = String(DELETE_CAR_API || '').trim()
  if (!apiUrl) {
    throw new Error('尚未配置删除接口：请在 src/data/adminCarApi.js 中设置 DELETE_CAR_API')
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ carId: id }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || data.error || `删除失败：${res.status}`)
  }
}

/**
 * GET getcardetail（?carId=）；成功后将 item 写入 sessionStorage 供下次直开详情。
 * @returns {Promise<object>}
 */
export async function fetchAdminCarDetail(carId) {
  const id = String(carId || '').trim()
  if (!id) throw new Error('carId 为空')

  const url = `${GET_CAR_DETAIL_API}?carId=${encodeURIComponent(id)}`
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.message || data.error || `getcardetail 失败：${res.status}`)
  }
  const item = data.item ?? data
  if (!item || typeof item !== 'object') {
    throw new Error('getcardetail 响应缺少 item')
  }
  try {
    sessionStorage.setItem(ADMIN_CAR_DETAIL_CACHE_PREFIX + id, JSON.stringify(item))
  } catch {
    /* ignore quota */
  }
  return item
}

export function generateCarId(make, model, year) {
  const pad = (n) => String(n).padStart(2, '0')
  const d = new Date()
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`
  const m = String(make || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-')
  const mo = String(model || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-')
  return `${m}-${mo}-${year}-${stamp}`
}
