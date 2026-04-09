import { GET_SALE_CARS_API, fetchAdminCarDetail } from './adminCarApi'

const LOCATION_TO_BRANCH = {
  auckland: 'akl',
  christchurch: 'chc',
  queenstown: 'zqn',
  Auckland: 'akl',
  Christchurch: 'chc',
  Queenstown: 'zqn',
}

function itemKm(v) {
  const o = v.odometer
  if (typeof o === 'number' && Number.isFinite(o)) return Math.round(o)
  const s = String(o ?? '')
    .replace(/km/gi, '')
    .replace(/,/g, '')
    .trim()
  const n = Number(s)
  return Number.isFinite(n) ? Math.round(n) : 0
}

function itemPrice(v) {
  const p = v.price
  if (typeof p === 'number' && Number.isFinite(p)) return p
  const n = Number(String(p).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

function itemYear(v) {
  const y = v.year
  if (typeof y === 'number' && Number.isFinite(y)) return y
  const n = Number(y)
  return Number.isFinite(n) ? n : 0
}

/** Dynamo `location` 字符串 → 与筛选 / NZDCR_BRANCHES 一致的 key */
export function dynamoLocationToBranchKey(loc) {
  const s = String(loc ?? '').trim()
  if (LOCATION_TO_BRANCH[s]) return LOCATION_TO_BRANCH[s]
  const lower = s.toLowerCase()
  if (lower.includes('auckland')) return 'akl'
  if (lower.includes('christchurch')) return 'chc'
  if (lower.includes('queenstown')) return 'zqn'
  return 'akl'
}

/**
 * 将 getadmincars 单条转为在售列表用（含 slug、数值字段便于筛选）。
 * @returns {object | null}
 */
export function enrichDynamoCarForSale(raw) {
  if (!raw || typeof raw !== 'object') return null
  const slug = String(raw.slug || '').trim()
  if (!slug) return null
  const st = String(raw.status || 'published').toLowerCase()
  if (st === 'sold') return null

  return {
    ...raw,
    slug,
    locationKey: dynamoLocationToBranchKey(raw.location),
    price: itemPrice(raw),
    year: itemYear(raw),
    km: itemKm(raw),
  }
}

export function formatSaleListedLine(v) {
  const st = String(v.status || '').toLowerCase()
  if (st === 'sold') return 'Sold'
  const created = v.createdAt
  if (!created) return 'Published'
  const d = new Date(created)
  if (Number.isNaN(d.getTime())) return 'Published'
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Listed today'
  return `Listed ${d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

export function saleListingHeadline(v) {
  const y = itemYear(v)
  const make = String(v.make ?? '').trim()
  const model = String(v.model ?? '').trim()
  const parts = []
  if (y > 0) parts.push(String(y))
  if (make) parts.push(make)
  if (model) parts.push(model)
  return parts.length ? parts.join(' ') : String(v.title ?? '').trim() || '—'
}

export function formatSaleAdminLocation(v) {
  const loc = String(v.location ?? '').trim()
  const reg = String(v.region ?? '').trim()
  if (loc && reg && loc.toLowerCase() !== reg.toLowerCase()) return `${loc}, ${reg}`
  return loc || reg || '—'
}

export function formatSaleEngineCc(v) {
  const cc = v.engineCc
  if (typeof cc === 'number' && Number.isFinite(cc) && cc > 0) {
    return `${Math.round(cc).toLocaleString('en-NZ')} cc`
  }
  const s = String(v.engine ?? '').trim()
  return s || '—'
}

export function saleHeroImageUrl(v) {
  const t = String(v.thumbnail || '').trim()
  if (t) return t
  const list = saleListingImageUrls(v)
  return list[0] || ''
}

/** 封面 + 图库 URL 去重（与 Admin 详情一致顺序），无封面图库时用 thumbnail */
export function saleListingImageUrls(v) {
  if (!v || typeof v !== 'object') return []
  const seen = new Set()
  const out = []
  for (const u of [...(v.coverImages || []), ...(v.galleryImages || [])]) {
    const s = String(u || '').trim()
    if (!s || seen.has(s)) continue
    seen.add(s)
    out.push(s)
  }
  if (out.length === 0) {
    const t = String(v.thumbnail || '').trim()
    if (t) out.push(t)
  }
  return out
}

/** 与 Admin 列表一致：按品牌筛 make|model */
export function saleModelOptionsFromInventory(items, makesFilter) {
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

export async function fetchPublishedSaleInventory() {
  const items = []
  let lastKey = null

  // Keep fetching pages so existing client-side filters/sorts still work with the new paginated API.
  do {
    const query = new URLSearchParams({ limit: '50' })
    if (lastKey) query.set('lastKey', JSON.stringify(lastKey))
    const url = `${GET_SALE_CARS_API}?${query.toString()}`

    const res = await fetch(url)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      throw new Error(data.message || data.error || `Failed to fetch sale inventory (${res.status})`)
    }
    const pageItems = Array.isArray(data.items) ? data.items : []
    items.push(...pageItems)
    lastKey = data.lastKey && typeof data.lastKey === 'object' ? data.lastKey : null
  } while (lastKey)

  const out = []
  for (const raw of items) {
    const v = enrichDynamoCarForSale(raw)
    if (v) out.push(v)
  }
  return out
}

/** 详情页：在一批车辆里按 slug 查找 */
export function findSaleCarBySlug(items, slug) {
  const s = String(slug || '').trim().toLowerCase()
  if (!s) return null
  return items.find((v) => String(v.slug || '').trim().toLowerCase() === s) ?? null
}

/**
 * 在售详情：列表命中 slug 后再请求 getcardetail，合并 cover + gallery（列表接口往往不带全量图库）。
 * @returns {Promise<object | null>}
 */
export async function fetchPublishedSaleVehicleBySlug(slug) {
  const items = await fetchPublishedSaleInventory()
  const base = findSaleCarBySlug(items, slug)
  if (!base) return null
  const carId = String(base.carId || '').trim()
  if (!carId) return base
  try {
    const detail = await fetchAdminCarDetail(carId)
    const merged = { ...base, ...detail, slug: base.slug }
    return enrichDynamoCarForSale(merged) ?? merged
  } catch {
    return base
  }
}
