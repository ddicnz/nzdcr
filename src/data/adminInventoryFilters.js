import {
  KM_MAX_OPTIONS,
  KM_MIN_OPTIONS,
  PRICE_MAX_OPTIONS,
  PRICE_OPTIONS,
  SALE_BODY_TYPES,
  SALE_MAKE_OPTIONS,
  YEAR_MAX_OPTIONS,
  YEAR_MIN_OPTIONS,
} from './carsForSale'

export const FUEL_VALUES = ['Petrol', 'Diesel', 'Hybrid', 'Electric']

export const DEFAULT_LOCATIONS = ['Auckland', 'Christchurch', 'Queenstown']

export const STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'sold', label: 'Sold' },
]

export function toggleInList(list, value) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
}

export function itemKm(v) {
  const o = v.odometer
  if (typeof o === 'number' && Number.isFinite(o)) return o
  const s = String(o ?? '')
    .replace(/km/gi, '')
    .replace(/,/g, '')
    .trim()
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

export function itemPrice(v) {
  const p = v.price
  if (typeof p === 'number' && Number.isFinite(p)) return p
  const n = Number(String(p).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function itemYear(v) {
  const y = v.year
  if (typeof y === 'number' && Number.isFinite(y)) return y
  const n = Number(y)
  return Number.isFinite(n) ? n : 0
}

export function adminInventoryMatches(f, v) {
  const kw = f.keyword.trim().toLowerCase()
  if (kw) {
    const blob = `${v.title ?? ''} ${v.make ?? ''} ${v.model ?? ''} ${v.carId ?? ''}`
      .toLowerCase()
    if (!blob.includes(kw)) return false
  }
  if (f.makes.length && !f.makes.includes(v.make)) return false
  if (f.models.length) {
    const key = `${v.make}|${v.model}`
    if (!f.models.includes(key)) return false
  }
  if (f.bodyTypes.length && !f.bodyTypes.includes(v.bodyType)) return false
  if (f.fuels.length && !f.fuels.includes(v.fuel)) return false
  if (f.locations.length && !f.locations.includes(v.location)) return false
  if (f.statuses.length && !f.statuses.includes(v.status)) return false

  const price = itemPrice(v)
  const year = itemYear(v)
  const km = itemKm(v)

  if (f.priceMin) {
    const min = Number(f.priceMin)
    if (Number.isFinite(min) && price < min) return false
  }
  if (f.priceMax) {
    const max = Number(f.priceMax)
    if (Number.isFinite(max) && price > max) return false
  }
  if (f.yearMin) {
    const y = Number(f.yearMin)
    if (Number.isFinite(y) && year < y) return false
  }
  if (f.yearMax) {
    const y = Number(f.yearMax)
    if (Number.isFinite(y) && year > y) return false
  }
  if (f.kmMin) {
    const min = Number(f.kmMin)
    if (Number.isFinite(min) && km < min) return false
  }
  if (f.kmMax) {
    const max = Number(f.kmMax)
    if (Number.isFinite(max) && km > max) return false
  }
  return true
}

export const initialAdminInventoryFilters = {
  keyword: '',
  makes: [],
  models: [],
  bodyTypes: [],
  fuels: [],
  locations: [],
  statuses: [],
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  kmMin: '',
  kmMax: '',
}

export const MAKE_CHECKBOXES = SALE_MAKE_OPTIONS.filter((o) => o.value)
export const BODY_OPTIONS = SALE_BODY_TYPES.map((bt) => ({ value: bt, label: bt }))
export const FUEL_OPTIONS = FUEL_VALUES.map((x) => ({ value: x, label: x }))

export {
  KM_MAX_OPTIONS,
  KM_MIN_OPTIONS,
  PRICE_MAX_OPTIONS,
  PRICE_OPTIONS,
  YEAR_MAX_OPTIONS,
  YEAR_MIN_OPTIONS,
}

/** 里程：Admin 用 odometer；在售 enrich 可能只有 km */
export function sortKeyKm(v) {
  const fromOdo = itemKm(v)
  if (fromOdo !== 0) return fromOdo
  const km = v.km
  if (typeof km === 'number' && Number.isFinite(km)) return km
  return 0
}

export const ADMIN_SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to high' },
  { value: 'price-desc', label: 'Price: High to low' },
  { value: 'km-asc', label: 'Odometer: Low to high' },
  { value: 'km-desc', label: 'Odometer: High to low' },
  { value: 'year-desc', label: 'Year: Newest first' },
  { value: 'year-asc', label: 'Year: Oldest first' },
]

/**
 * @param {object[]} arr
 * @param {string} sortBy
 * @returns {object[]}
 */
export function sortInventoryList(arr, sortBy) {
  const out = [...arr]
  switch (sortBy) {
    case 'price-asc':
      out.sort((a, b) => itemPrice(a) - itemPrice(b))
      break
    case 'price-desc':
      out.sort((a, b) => itemPrice(b) - itemPrice(a))
      break
    case 'km-asc':
      out.sort((a, b) => sortKeyKm(a) - sortKeyKm(b))
      break
    case 'km-desc':
      out.sort((a, b) => sortKeyKm(b) - sortKeyKm(a))
      break
    case 'year-desc':
      out.sort((a, b) => itemYear(b) - itemYear(a))
      break
    case 'year-asc':
      out.sort((a, b) => itemYear(a) - itemYear(b))
      break
    default:
      break
  }
  return out
}
