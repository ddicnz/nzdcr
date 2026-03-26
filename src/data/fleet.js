/**
 * Fleet cards — order aligned with nzdcr.co.nz/cars/ listing.
 * Use `category` for a single bucket, or `categories` when a vehicle appears under more than one
 * (e.g. Intermediate SUV 4WD in SUV, Station Wagon, and Intermediate).
 * @type {Array<{ name: string, was: number, now: number, img: string, detailSlug: string, avgRating?: number, category?: string, categories?: string[] }>}
 */
export function getFleetByDetailSlug(slug) {
  if (!slug) return undefined
  return FLEET.find((c) => c.detailSlug === slug)
}

export function fleetItemCategories(car) {
  return car.categories ?? [car.category].filter(Boolean)
}

export function fleetItemMatchesCategory(car, fleetCategory) {
  return fleetItemCategories(car).includes(fleetCategory)
}

export const FLEET = [
  {
    name: 'Small Hatch – Toyota Yaris',
    was: 44.95,
    now: 19.95,
    avgRating: 4.85,
    img: '/pic/cars/Small%20Hatch.jpg',
    category: 'compact',
    detailSlug: 'premium-small-hatch',
  },
  {
    name: 'Supersaver S/Wagon',
    was: 38.95,
    now: 27.95,
    avgRating: 4.55,
    img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=640&q=80',
    category: 'station-wagon',
    detailSlug: 'super-saver-wagon',
  },
  {
    name: 'Large sedan',
    was: 49.95,
    now: 29.95,
    avgRating: 4.6,
    img: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=640&q=80',
    category: 'intermediate',
    detailSlug: 'large-sedan',
  },
  {
    name: 'Intermediate Hatch',
    was: 45.0,
    now: 29.95,
    avgRating: 4.72,
    img: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=640&q=80',
    categories: ['intermediate', 'compact'],
    detailSlug: 'intermediate-hatch',
  },
  {
    name: 'Intermediate Sedan',
    was: 45.0,
    now: 29.95,
    avgRating: 4.68,
    img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=640&q=80',
    category: 'intermediate',
    detailSlug: 'intermediate-sedan',
  },
  {
    name: 'Supersaver people mover',
    was: 89.95,
    now: 49.95,
    avgRating: 4.45,
    img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=640&q=80',
    category: 'people-mover',
    detailSlug: 'supersaver-people-mover',
  },
  {
    name: 'Intermediate SUV 4WD',
    was: 89.95,
    now: 49.95,
    avgRating: 4.78,
    img: 'https://images.unsplash.com/photo-1511919884226-fd3f146f9f4f?w=640&q=80',
    categories: ['suv', 'station-wagon', 'intermediate'],
    detailSlug: 'intermediate-suv-4wd',
  },
  {
    name: 'Large People Mover',
    was: 99.95,
    now: 59.95,
    avgRating: 4.52,
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=640&q=80',
    category: 'people-mover',
    detailSlug: 'large-people-mover',
  },
  {
    name: '7 Seater SUV',
    was: 99.95,
    now: 69.95,
    avgRating: 4.62,
    img: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=640&q=80',
    categories: ['suv', 'people-mover'],
    detailSlug: '7-seater-suv',
  },
  {
    name: '10 seater people mover',
    was: 179.95,
    now: 99.95,
    avgRating: 4.38,
    img: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=640&q=80',
    category: 'people-mover',
    detailSlug: '10-seater-people-mover',
  },
  {
    name: '12 Seater Minibus',
    was: 250.0,
    now: 169.0,
    avgRating: 4.4,
    img: 'https://images.unsplash.com/photo-1464219789934-c2a9a5e8dc15?w=640&q=80',
    category: 'people-mover',
    detailSlug: '12-seater-minibus',
  },
]
