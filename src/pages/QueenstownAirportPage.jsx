import { Suspense, lazy } from 'react'
import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import { branchByKey } from '../data/branchLocations'
import bodyHtml from '../content/queenstown-airport-body.html?raw'

const NzdcrLeafletBranchMap = lazy(() => import('../components/NzdcrLeafletBranchMap'))

const zqn = branchByKey('zqn')

function QueenstownMapNote() {
  return (
    <p className="nzdcr-airports-map__note">
      Map data ©{' '}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
        OpenStreetMap
      </a>
      .{' '}
      <a href={zqn.googleUrl} target="_blank" rel="noopener noreferrer">
        Open in Google Maps
      </a>
      .
    </p>
  )
}

export default function QueenstownAirportPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('QUEENSTOWN AIRPORT', 'Queenstown Airport')} />
      <div className="airport-with-map container">
        <div className="airport-with-map__grid">
          <div
            className="airport-with-map__main terms-prose airport-page location-detail-page"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
          <aside className="airport-with-map__aside" aria-label="Queenstown depot map">
            <Suspense fallback={<div className="nzdcr-airports-map__leaflet nzdcr-airports-map__leaflet--loading" />}>
              <NzdcrLeafletBranchMap markers={[zqn]} note={<QueenstownMapNote />} />
            </Suspense>
          </aside>
        </div>
      </div>
    </>
  )
}
