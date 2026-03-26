import { useMemo } from 'react'
import { Navigate, useParams, useSearchParams } from 'react-router-dom'
import PageHeroBanner from '../components/PageHeroBanner'
import FleetGrid from '../components/FleetGrid'
import FleetCategoryNav from '../components/FleetCategoryNav'
import FleetSortBar from '../components/FleetSortBar'
import { roadHero } from '../data/pageHeros'
import { FLEET, fleetItemMatchesCategory } from '../data/fleet'
import { getProductCategoryBySlug } from '../data/productCategories'
import { migrateSearchParamsToOrderby, sortFleetItems } from '../data/fleetSort'

export default function ProductCategoryPage() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const cfg = getProductCategoryBySlug(slug)

  const filtered = useMemo(() => {
    if (!cfg) return []
    return FLEET.filter((car) => fleetItemMatchesCategory(car, cfg.fleetCategory))
  }, [cfg])

  const orderbyParam = searchParams.get('orderby')
  const sorted = useMemo(() => sortFleetItems(filtered, orderbyParam), [filtered, orderbyParam])

  if (searchParams.get('sort')) {
    const next = migrateSearchParamsToOrderby(searchParams)
    const qs = next.toString()
    return (
      <Navigate to={qs ? `/category/${slug}/?${qs}` : `/category/${slug}/`} replace />
    )
  }

  if (!cfg) {
    return <Navigate to="/cars/" replace />
  }

  const hero = roadHero(cfg.heroHeading, cfg.breadcrumbLast)

  return (
    <>
      <PageHeroBanner {...hero} />
      <div className="cars-page">
        <div className="container">
          <header className="cars-page__intro">
            <p>{cfg.intro}</p>
            <h2 className="cars-page__list-title">
              Here&rsquo;s a list of all the rental cars we currently have available.
            </h2>
            <FleetCategoryNav activeSlug={cfg.slug} />
            <FleetSortBar
              resultLine={`Showing ${filtered.length} result${filtered.length === 1 ? '' : 's'} (${cfg.navLabel})`}
            />
          </header>
        </div>
        <FleetGrid items={sorted} />
      </div>
    </>
  )
}
