import L from 'leaflet'
import { useEffect, useState } from 'react'
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap } from 'react-leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { ALL_BRANCHES_GOOGLE_MAPS_HREF, NZDCR_BRANCHES } from '../data/branchLocations'

const GOOGLE_MAPS_EMBED_KEY = import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY ?? ''

const pinIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

/**
 * @param {string} origin
 * @param {string} destination
 * @returns {string}
 */
function googleDirectionsEmbedSrc(origin, destination) {
  if (!GOOGLE_MAPS_EMBED_KEY) return ''
  const u = new URL('https://www.google.com/maps/embed/v1/directions')
  u.searchParams.set('key', GOOGLE_MAPS_EMBED_KEY)
  u.searchParams.set('origin', origin)
  u.searchParams.set('destination', destination)
  u.searchParams.set('region', 'nz')
  u.searchParams.set('mode', 'driving')
  return u.toString()
}

/**
 * @param {{ segments: Array<{ from: [number, number], to: [number, number] }> }} props
 */
function OsrmRouteLayer({ segments }) {
  const map = useMap()
  const [lines, setLines] = useState([])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      const lineStrings = []
      for (const seg of segments) {
        const [lat1, lng1] = seg.from
        const [lat2, lng2] = seg.to
        const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`
        try {
          const res = await fetch(url)
          const data = await res.json()
          if (cancelled || data.code !== 'Ok' || !data.routes?.[0]) continue
          const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng])
          lineStrings.push(coords)
        } catch {
          /* ignore segment */
        }
      }
      if (cancelled || lineStrings.length === 0) return
      setLines(lineStrings)
      const flat = lineStrings.flat()
      map.fitBounds(L.latLngBounds(flat), { padding: [36, 36], maxZoom: 9 })
    }
    run()
    return () => {
      cancelled = true
    }
  }, [map, segments])

  return (
    <>
      {lines.map((positions, i) => (
        <Polyline
          key={i}
          positions={positions}
          pathOptions={{ color: '#111', weight: 5, opacity: 0.9 }}
        />
      ))}
    </>
  )
}

/** @param {{ blogMap: object }} props */
export default function BlogPostMap({ blogMap }) {
  if (!blogMap) return null

  if (blogMap.variant === 'route') {
    const { title, origin, destination, segments, googleDirectionsUrl } = blogMap
    const gSrc = googleDirectionsEmbedSrc(origin, destination)

    if (gSrc) {
      return (
        <div className="blog-post-map">
          {title ? <p className="blog-post-map__title">{title}</p> : null}
          <div className="blog-post-map__iframe-wrap">
            <iframe
              className="blog-post-map__iframe"
              title={title || 'Driving route'}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={gSrc}
            />
          </div>
          <p className="blog-post-map__footnote">
            Interactive route, travel time and distance are provided by Google Maps (may differ from road or bridge
            closures on the day you travel).
          </p>
          {googleDirectionsUrl ? (
            <p className="blog-post__map-note">
              <a href={googleDirectionsUrl} target="_blank" rel="noopener noreferrer">
                Open full directions in Google Maps
              </a>
            </p>
          ) : null}
        </div>
      )
    }

    const first = segments[0].from
    const last = segments[segments.length - 1].to
    return (
      <div className="blog-post-map">
        {title ? <p className="blog-post-map__title">{title}</p> : null}
        <MapContainer
          className="blog-post-map__leaflet"
          center={[-41, 174]}
          zoom={5}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <OsrmRouteLayer segments={segments} />
          <Marker position={first} icon={pinIcon}>
            <Popup>Start</Popup>
          </Marker>
          <Marker position={last} icon={pinIcon}>
            <Popup>End</Popup>
          </Marker>
        </MapContainer>
        {googleDirectionsUrl ? (
          <p className="blog-post__map-note">
            <a href={googleDirectionsUrl} target="_blank" rel="noopener noreferrer">
              Open directions in Google Maps
            </a>
          </p>
        ) : null}
      </div>
    )
  }

  if (blogMap.variant === 'place') {
    const { title, center, zoom, googleMapsUrl } = blogMap
    return (
      <div className="blog-post-map">
        {title ? <p className="blog-post-map__title">{title}</p> : null}
        <MapContainer className="blog-post-map__leaflet" center={center} zoom={zoom} scrollWheelZoom={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
        {googleMapsUrl ? (
          <p className="blog-post__map-note">
            <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </p>
        ) : null}
      </div>
    )
  }

  if (blogMap.variant === 'branches') {
    const bounds = L.latLngBounds(NZDCR_BRANCHES.map((b) => b.position))
    return (
      <div className="blog-post-map">
        {blogMap.title ? <p className="blog-post-map__title">{blogMap.title}</p> : null}
        <MapContainer
          className="blog-post-map__leaflet"
          bounds={bounds}
          boundsOptions={{ padding: [48, 48], maxZoom: 6 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {NZDCR_BRANCHES.map((m) => (
            <Marker key={m.key} position={m.position} icon={pinIcon}>
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
        <p className="blog-post__map-note">
          <a href={ALL_BRANCHES_GOOGLE_MAPS_HREF} target="_blank" rel="noopener noreferrer">
            Multi-stop directions in Google Maps (our three depots)
          </a>
        </p>
      </div>
    )
  }

  return null
}
