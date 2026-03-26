import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import { migrateSearchParamsToOrderby } from '../data/fleetSort'

/** `/product-category/:slug/` → `/category/:slug/` */
export function RedirectFromProductCategory() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const next = migrateSearchParamsToOrderby(searchParams)
  const qs = next.toString()
  return <Navigate to={qs ? `/category/${slug}/?${qs}` : `/category/${slug}/`} replace />
}
