import { FLEET } from './fleet'

/** WooCommerce-style: `?orderby=popularity|rating|date|price|price-desc` */
export const FLEET_ORDERBY_OPTIONS = [
  { value: 'popularity', label: 'Sort by popularity' },
  { value: 'rating', label: 'Sort by average rating' },
  { value: 'date', label: 'Sort by latest' },
  { value: 'price', label: 'Sort by price: low to high' },
  { value: 'price-desc', label: 'Sort by price: high to low' },
]

const ORDERBY_VALUES = new Set(FLEET_ORDERBY_OPTIONS.map((o) => o.value))

/** Omitted from URL when default (low to high) */
export const DEFAULT_ORDERBY = 'price'

export function normalizeOrderby(raw) {
  if (typeof raw !== 'string' || !ORDERBY_VALUES.has(raw)) return DEFAULT_ORDERBY
  return raw
}

const LEGACY_SORT_TO_ORDERBY = {
  popularity: 'popularity',
  rating: 'rating',
  latest: 'date',
  'price-asc': 'price',
  'price-desc': 'price-desc',
}

export function legacySortToOrderby(sort) {
  if (!sort || typeof sort !== 'string') return null
  return LEGACY_SORT_TO_ORDERBY[sort] ?? null
}

/** Move `sort` → `orderby` for old bookmarks. */
export function migrateSearchParamsToOrderby(searchParams) {
  const next = new URLSearchParams(searchParams)
  const sort = next.get('sort')
  if (sort) {
    const ob = legacySortToOrderby(sort)
    next.delete('sort')
    if (ob) {
      const n = normalizeOrderby(ob)
      if (n === DEFAULT_ORDERBY) next.delete('orderby')
      else next.set('orderby', n)
    }
  }
  return next
}

/**
 * @param {typeof FLEET} items
 * @param {string | null | undefined} orderbyRaw
 * @param {typeof FLEET} [catalogOrder]
 */
export function sortFleetItems(items, orderbyRaw, catalogOrder = FLEET) {
  const key = normalizeOrderby(orderbyRaw)
  const indexOf = (car) => {
    const i = catalogOrder.findIndex((c) => c.name === car.name)
    return i === -1 ? 9999 : i
  }
  const copy = [...items]
  switch (key) {
    case 'popularity':
      return copy.sort((a, b) => indexOf(a) - indexOf(b))
    case 'date':
      return copy.sort((a, b) => indexOf(b) - indexOf(a))
    case 'rating':
      return copy.sort(
        (a, b) =>
          (b.avgRating ?? 0) - (a.avgRating ?? 0) || indexOf(a) - indexOf(b),
      )
    case 'price':
      return copy.sort((a, b) => a.now - b.now || a.name.localeCompare(b.name))
    case 'price-desc':
      return copy.sort((a, b) => b.now - a.now || a.name.localeCompare(b.name))
    default:
      return copy
  }
}
