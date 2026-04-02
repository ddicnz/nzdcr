/** AWS Lambda HTTP APIs — used by /addcar admin form */
export const GET_UPLOAD_URL_API =
  'https://gnnohfspok.execute-api.ap-southeast-2.amazonaws.com/default/get_upload_url'
export const ADDCAR_API =
  'https://n8eemiewzi.execute-api.ap-southeast-2.amazonaws.com/default/addcar'
export const GET_ADMIN_CARS_API =
  'https://utgpizuum2.execute-api.ap-southeast-2.amazonaws.com/default/getadmincars'

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/** Presigned URL 请求体：与 get_upload_url Lambda 约定，用于区分封面 / 图库键名（如 cover-1、gallery-1） */
export const UPLOAD_IMAGE_KIND = {
  cover: 'cover',
  gallery: 'gallery',
}

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
