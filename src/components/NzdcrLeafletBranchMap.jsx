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

/**
 * @param {{ markers: Array<{ key: string, title: string, address: string, position: [number, number], googleUrl: string }>, note: import('react').ReactNode }} props
 */
export default function NzdcrLeafletBranchMap({ markers, note }) {
  const multi = markers.length > 1
  const bounds = useMemo(() => {
    if (!multi) return null
    return L.latLngBounds(markers.map((m) => m.position))
  }, [markers, multi])

  const center = !multi && markers[0] ? markers[0].position : undefined

  return (
    <div className="nzdcr-airports-map">
      {note}
      <MapContainer
        className="nzdcr-airports-map__leaflet"
        {...(multi
          ? { bounds, boundsOptions: { padding: [40, 40], maxZoom: 6 } }
          : { center, zoom: 15 })}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m) => (
          <Marker key={m.key} position={m.position} icon={branchIcon}>
            <Popup>
              <strong>{m.title}</strong>
              <br />
              {m.address}
              <br />
              <a href={m.googleUrl} target="_blank" rel="noopener noreferrer">
                Open in Google Maps
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}
