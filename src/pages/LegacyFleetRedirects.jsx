import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { migrateSearchParamsToOrderby } from '../data/fleetSort'

/** Old `/category/:slug/` bookmarks → `/product-category/:slug/` */
export function RedirectCategoryToProductCategory() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const next = migrateSearchParamsToOrderby(searchParams)
  const qs = next.toString()
  return <Navigate to={qs ? `/product-category/${slug}/?${qs}` : `/product-category/${slug}/`} replace />
}
