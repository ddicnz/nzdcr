import { ALL_BRANCHES_GOOGLE_MAPS_HREF, NZDCR_BRANCHES } from '../data/branchLocations'
import NzdcrLeafletBranchMap from './NzdcrLeafletBranchMap'

export default function NzdcrAirportsMap() {
  const note = (
    <p className="nzdcr-airports-map__note">
      Map data ©{' '}
      <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
        OpenStreetMap
      </a>
      . Pins: Auckland, Christchurch, Frankton — open in{' '}
      <a href={ALL_BRANCHES_GOOGLE_MAPS_HREF} target="_blank" rel="noopener noreferrer">
        Google Maps
      </a>
      .
    </p>
  )

  return <NzdcrLeafletBranchMap markers={NZDCR_BRANCHES} note={note} />
}
