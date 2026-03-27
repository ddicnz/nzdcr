import { Suspense, lazy } from 'react'
import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import bodyHtml from '../content/auckland-airport-body.html?raw'

const NzdcrAirportsMap = lazy(() => import('../components/NzdcrAirportsMap'))

export default function AucklandAirportPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('AUCKLAND AIRPORT', 'Auckland Airport')} />
      <div className="airport-with-map container">
        <div className="airport-with-map__grid">
          <div
            className="airport-with-map__main terms-prose airport-page location-detail-page"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          <aside className="airport-with-map__aside" aria-label="Depot locations map">
            <Suspense fallback={<div className="nzdcr-airports-map__leaflet nzdcr-airports-map__leaflet--loading" />}>
              <NzdcrAirportsMap />
            </Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
