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
    img: '/pic/cars/super-saver-wagon.png',
    category: 'station-wagon',
    detailSlug: 'super-saver-wagon',
  },
  {
    name: 'Large sedan',
    was: 49.95,
    now: 29.95,
    avgRating: 4.6,
    img: '/pic/cars/Large%20Sedan.png',
    category: 'intermediate',
    detailSlug: 'large-sedan',
  },
  {
    name: 'Intermediate Hatch',
    was: 45.0,
    now: 29.95,
    avgRating: 4.72,
    img: '/pic/cars/Intermediate%20Hatch.jpg',
    categories: ['intermediate', 'compact'],
    detailSlug: 'intermediate-hatch',
  },
  {
    name: 'Intermediate Sedan',
    was: 45.0,
    now: 29.95,
    avgRating: 4.68,
    img: '/pic/cars/Intermediate%20Sedan.jpg',
    category: 'intermediate',
    detailSlug: 'intermediate-sedan',
  },
  {
    name: 'Supersaver people mover',
    was: 89.95,
    now: 49.95,
    avgRating: 4.45,
    img: '/pic/cars/Supersaver%20people%20mover.png',
    category: 'people-mover',
    detailSlug: 'budget-people-mover',
  },
  {
    name: 'Intermediate SUV 4WD',
    was: 89.95,
    now: 49.95,
    avgRating: 4.78,
    img: '/pic/cars/Intermediate%20SUV%204WD.png',
    categories: ['suv', 'station-wagon', 'intermediate'],
    detailSlug: 'suv-4wd2wd',
  },
  {
    name: 'Large People Mover',
    was: 99.95,
    now: 59.95,
    avgRating: 4.52,
    img: '/pic/cars/Large%20People%20Mover.png',
    category: 'people-mover',
    detailSlug: 'luxury-people-mover',
  },
  {
    name: '7 Seater SUV',
    was: 99.95,
    now: 69.95,
    avgRating: 4.62,
    img: '/pic/cars/7%20Seater%20SUV.png',
    categories: ['suv', 'people-mover'],
    detailSlug: '7-seater-suv',
  },
  {
    name: '10 seater people mover',
    was: 179.95,
    now: 99.95,
    avgRating: 4.38,
    img: '/pic/cars/10%20seater%20people%20mover.png',
    category: 'people-mover',
    detailSlug: '10-seater-people-mover',
  },
  {
    name: '12 Seater Minibus',
    was: 250.0,
    now: 169.0,
    avgRating: 4.4,
    img: '/pic/cars/12%20Seater%20Minibus.png',
    category: 'people-mover',
    detailSlug: '12-seater-minibus',
  },
]
