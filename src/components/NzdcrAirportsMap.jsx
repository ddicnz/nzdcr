import L from 'leaflet'
import { useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

const branchIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const BRANCHES = [
  {
    key: 'akl',
    title: 'Auckland',
    address: '3 Verissimo Drive, Mangere, Auckland, New Zealand',
    position: [-36.9727, 174.7842],
    googleUrl: 'https://www.google.com/maps?q=3+Verissimo+Drive,+Mangere,+Auckland,+New+Zealand',
  },
  {
    key: 'chc',
    title: 'Christchurch',
    address: '264 Russley Road, Avonhead, Christchurch 8042, New Zealand',
    position: [-43.5083, 172.559],
    googleUrl: 'https://www.google.com/maps?q=264+Russley+Road,+Avonhead,+Christchurch+8042,+New+Zealand',
  },
  {
    key: 'zqn',
    title: 'Queenstown (Frankton)',
    address: '121 Glenda Drive, Frankton 9300, New Zealand',
    position: [-45.0158, 168.7305],
    googleUrl: 'https://www.google.com/maps?q=121+Glenda+Drive,+Frankton,+9300,+New+Zealand',
  },
]

const ALL_ON_MAP_HREF =
  'https://www.google.com/maps/dir/3+Verissimo+Drive,+Mangere,+Auckland,+New+Zealand/264+Russley+Road,+Avonhead,+Christchurch,+8042,+New+Zealand/121+Glenda+Drive,+Frankton,+9300,+New+Zealand'

export default function NzdcrAirportsMap() {
  const bounds = useMemo(() => L.latLngBounds(BRANCHES.map((b) => b.position)), [])

  return (
    <div className="nzdcr-airports-map">
      <p className="nzdcr-airports-map__note">
        Map data ©{' '}
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
          OpenStreetMap
        </a>
        . Pins: Auckland, Christchurch, Frankton — open in{' '}
        <a href={ALL_ON_MAP_HREF} target="_blank" rel="noopener noreferrer">
          Google Maps
        </a>
        .
      </p>
      <MapContainer
        className="nzdcr-airports-map__leaflet"
        bounds={bounds}
        boundsOptions={{ padding: [40, 40], maxZoom: 6 }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {BRANCHES.map((b) => (
          <Marker key={b.key} position={b.position} icon={branchIcon}>
            <Popup>
              <strong>{b.title}</strong>
              <br />
              {b.address}
              <br />
              <a href={b.googleUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
