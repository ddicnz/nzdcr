/** Shared depot data for Leaflet maps (Auckland / Christchurch / Frankton). */
export const NZDCR_BRANCHES = [
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

export const ALL_BRANCHES_GOOGLE_MAPS_HREF =
  'https://www.google.com/maps/dir/3+Verissimo+Drive,+Mangere,+Auckland,+New+Zealand/264+Russley+Road,+Avonhead,+Christchurch,+8042,+New+Zealand/121+Glenda+Drive,+Frankton,+9300,+New+Zealand'

export function branchByKey(key) {
  const b = NZDCR_BRANCHES.find((x) => x.key === key)
  if (!b) throw new Error(`Unknown branch: ${key}`)
  return b
}
