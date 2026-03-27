import { Link } from 'react-router-dom'
import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'

/** Content scoped to Auckland, Christchurch & Queenstown only (see nzdcr.co.nz/location/). */
export default function LocationsPage() {
  return (
    <>
      <PageHeroBanner {...roadHero('LOCATIONS', 'Locations')} />
      <div className="terms-prose location-page container">
        <h2>Auckland</h2>
        <p>3 Verissimo Drive, Mangere, Auckland, New Zealand, 2022</p>
        <p>
          <Link to="/auckland-airport/">Auckland Airport</Link>
        </p>

        <h2>Christchurch</h2>
        <p>264 Russley Road, Avonhead, Christchurch, New Zealand, 8042</p>
        <p>
          <Link to="/christchurch-airport/">Christchurch Airport</Link>
        </p>

        <h2>Queenstown</h2>
        <p>121 Glenda Drive, Frankton, New Zealand, 9300</p>
        <p>
          <Link to="/queenstown-airport/">Queenstown Airport</Link>
        </p>
      </div>
    </>
  )
}
