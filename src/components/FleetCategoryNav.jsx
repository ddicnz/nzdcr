import { Link, useSearchParams } from 'react-router-dom'
import { DEFAULT_ORDERBY, normalizeOrderby } from '../data/fleetSort'
import { PRODUCT_CATEGORIES } from '../data/productCategories'

/** Preserve `?orderby=` when switching category. */
function useOrderbyQuerySuffix() {
  const [searchParams] = useSearchParams()
  const o = normalizeOrderby(searchParams.get('orderby'))
  return o === DEFAULT_ORDERBY ? '' : `?orderby=${encodeURIComponent(o)}`
}

/** @param {{ activeSlug?: string | null }} props — null/undefined = "All" on /cars/ */
export default function FleetCategoryNav({ activeSlug = null }) {
  const q = useOrderbyQuerySuffix()
  return (
    <nav className="fleet-categories" aria-label="Product categories">
      <Link
        to={q ? `/cars/${q}` : '/cars/'}
        className={`fleet-categories__btn${activeSlug == null ? ' is-active' : ''}`}
      >
        All
      </Link>
      {PRODUCT_CATEGORIES.map(({ slug, navLabel }) => (
        <Link
          key={slug}
          to={q ? `/category/${slug}/${q}` : `/category/${slug}/`}
          className={`fleet-categories__btn${activeSlug === slug ? ' is-active' : ''}`}
        >
          {navLabel}
        </Link>
      ))}
    </nav>
  )
}
