import { Link } from 'react-router-dom'
import { PRODUCT_CATEGORIES } from '../data/productCategories'

/** @param {{ activeSlug?: string | null }} props — null/undefined = "All" on /cars/ */
export default function FleetCategoryNav({ activeSlug = null }) {
  return (
    <nav className="fleet-categories" aria-label="Product categories">
      <Link
        to="/cars/"
        className={`fleet-categories__btn${activeSlug == null ? ' is-active' : ''}`}
      >
        All
      </Link>
      {PRODUCT_CATEGORIES.map(({ slug, navLabel }) => (
        <Link
          key={slug}
          to={`/product-category/${slug}/`}
          className={`fleet-categories__btn${activeSlug === slug ? ' is-active' : ''}`}
        >
          {navLabel}
        </Link>
      ))}
    </nav>
  )
}
