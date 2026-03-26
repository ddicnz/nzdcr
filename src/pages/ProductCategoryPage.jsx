import { useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import PageHeroBanner from '../components/PageHeroBanner'
import FleetGrid from '../components/FleetGrid'
import FleetCategoryNav from '../components/FleetCategoryNav'
import { roadHero } from '../data/pageHeros'
import { FLEET, fleetItemMatchesCategory } from '../data/fleet'
import { getProductCategoryBySlug } from '../data/productCategories'

export default function ProductCategoryPage() {
  const { slug } = useParams()
  const cfg = getProductCategoryBySlug(slug)

  const filtered = useMemo(() => {
    if (!cfg) return []
    return FLEET.filter((car) => fleetItemMatchesCategory(car, cfg.fleetCategory))
  }, [cfg])

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
            <p className="cars-page__result-count">
              Showing {filtered.length} result{filtered.length === 1 ? '' : 's'} ({cfg.navLabel})
            </p>
          </header>
        </div>
        <FleetGrid items={filtered} />
      </div>
    </>
  )
}
