/** Shared depot data for Leaflet maps (Auckland / Christchurch / Frankton). */
export const NZDCR_BRANCHES = [
  {
    key: 'akl',
    title: 'Auckland',
    address: '3 Verissimo Drive, Mangere, Auckland, New Zealand',
    position: [-36.9727, 174.7842],
    googleUrl: 'https://www.google.com/maps?q=3+Verissimo+Drive,+Mangere,+Auckland,+New+Zealand',
    phoneLocal: { href: 'tel:+6496882299', label: '(+64) 9 688 2299' },
  },
  {
    key: 'chc',
    title: 'Christchurch',
    address: '264 Russley Road, Avonhead, Christchurch 8042, New Zealand',
    position: [-43.5083, 172.559],
    googleUrl: 'https://www.google.com/maps?q=264+Russley+Road,+Avonhead,+Christchurch+8042,+New+Zealand',
    phoneLocal: { href: 'tel:+6439743818', label: '(+64) 3 974 3818' },
  },
  {
    key: 'zqn',
    title: 'Queenstown',
    address: '121 Glenda Drive, Frankton 9300, New Zealand',
    position: [-45.0158, 168.7305],
    googleUrl: 'https://www.google.com/maps?q=121+Glenda+Drive,+Frankton,+9300,+New+Zealand',
    phoneLocal: { href: 'tel:+6439743819', label: '(+64) 3 974 3819' },
  },
]

/** NZ freephone — all branches (see Contact us) */
export const NZDCR_SALES_FREE_PHONE = { href: 'tel:080017951795', label: '0800 1795 1795' }

export const ALL_BRANCHES_GOOGLE_MAPS_HREF =
  'https://www.google.com/maps/dir/3+Verissimo+Drive,+Mangere,+Auckland,+New+Zealand/264+Russley+Road,+Avonhead,+Christchurch,+8042,+New+Zealand/121+Glenda+Drive,+Frankton,+9300,+New+Zealand'

export function branchByKey(key) {
  const b = NZDCR_BRANCHES.find((x) => x.key === key)
  if (!b) throw new Error(`Unknown branch: ${key}`)
  return b
}

export function branchByLocationKeyOrDefault(key) {
  const b = NZDCR_BRANCHES.find((x) => x.key === key)
  return b ?? NZDCR_BRANCHES[0]
}
