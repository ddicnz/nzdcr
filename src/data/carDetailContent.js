/**
 * Rich copy for `/cars/:detailSlug/`.
 * Prefer `descriptionIntro` + `specs` + `extras` for tabbed UI; legacy `sectionsHtml` falls back to one block.
 *
 * specs[].icon keys: doors | ac | seats | automatic | luggage | engine
 *
 * @type {Record<string, {
 *   bullets: string[],
 *   relatedSlugs?: string[],
 *   descriptionIntro?: string,
 *   specs?: Array<{ icon: string, text: string }>,
 *   extras?: string[],
 *   reviewCount?: number,
 *   reviewsEmpty?: string,
 *   sectionsHtml?: string,
 *   descriptionNotes?: string[]
 * }>}
 */
export const CAR_DETAIL_COPY = {
  'premium-small-hatch': {
    bullets: [
      'Small and easy to park',
      'Toyota Yaris/Vitz or a similar',
      '1.3L, 5dr, Petrol, Automatic',
      'Very good on fuel',
    ],
    relatedSlugs: ['intermediate-hatch'],
    descriptionIntro:
      "When you want to enjoy comfortable and new small economy cars, pick one from the premium small hatch range at NZDCR. They are fuel-efficient and perfect for a small family and luggage.",
    specs: [
      { icon: 'doors', text: '5 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '4 Seats' },
      { icon: 'automatic', text: 'Automatic' },
      { icon: 'luggage', text: '2 Large Luggages' },
      { icon: 'engine', text: '1.3L' },
    ],
    extras: [
      'Snow Chains from $25/month',
      'Baby Capsule (birth to 6 months) $25/month',
      'Baby Seat (6 months to 4 years) $25/month',
      'Booster Seat (4 to 6 years) $25/month',
      'Basic GPS unit $8/Day',
      'GPS unit $10/Day',
      'Advanced GPS unit $12/Day',
    ],
    reviewCount: 0,
    reviewsEmpty: 'There are no reviews yet.',
  },
  'super-saver-wagon': {
    bullets: [
      'Well Maintained Budget cars',
      'Toyota Corolla Fielder or similar Medium Sized Wagon',
    ],
    relatedSlugs: ['intermediate-suv-4wd'],
    descriptionIntro:
      'Which is the best choice for the family trip with tight budget.',
    specs: [
      { icon: 'doors', text: '5 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '5 Seats' },
      { icon: 'automatic', text: 'Automatic' },
      { icon: 'luggage', text: '3 Large luggages, 4 Small luggages' },
      { icon: 'engine', text: '1.5–1.8L' },
    ],
    extras: [
      'Snow Chains from $25/month',
      'Baby Capsule (birth to 6 months) $25/month',
      'Baby Seat (6 months to 4 years) $25/month',
      'Booster Seat (4 to 6 years) $25/month',
      'Basic GPS unit $8/Day',
      'GPS unit $10/Day',
      'Advanced GPS unit $12/Day',
    ],
    reviewCount: 0,
    reviewsEmpty: 'There are no reviews yet.',
    descriptionNotes: [
      '*Seasonal & Term Conditions apply',
      '* Special price applies in seasonal occasional and depends on the length of hire. Please refer to the figures with real booking dates.',
    ],
  },
  'intermediate-hatch': {
    bullets: ['Median size hatchback', 'Toyota Corolla or similar'],
    relatedSlugs: [
      'large-sedan',
      'intermediate-sedan',
      'premium-small-hatch',
      'intermediate-suv-4wd',
    ],
    descriptionIntro:
      'Hatch Cars with most comfortable interior, and the best space for you, for your family, and for your friends.',
    specs: [
      { icon: 'doors', text: '5 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '5 Seats' },
      { icon: 'automatic', text: 'Automatic' },
      { icon: 'luggage', text: '1 Large luggage, 1 Small luggage' },
      { icon: 'engine', text: '1.5–1.8 L' },
    ],
    reviewCount: 0,
    reviewsEmpty: 'There are no reviews yet.',
    descriptionNotes: ['*Seasonal & Term Conditions Apply'],
  },
  'intermediate-sedan': {
    bullets: ['Median size Cars', 'Toyota Corolla 4 door sedan or Similar'],
    relatedSlugs: ['large-sedan', 'intermediate-hatch', 'intermediate-suv-4wd'],
    descriptionIntro:
      'The best for you to enjoy the New Zealand road-trip.',
    specs: [
      { icon: 'doors', text: '4 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '5 Seats' },
      { icon: 'automatic', text: 'Automatic Transmission' },
      { icon: 'luggage', text: '2 Large luggages, 2 Small luggages' },
      { icon: 'engine', text: '1.3–1.8 L' },
    ],
    extras: [
      'Snow Chains from $25/month',
      'Baby Capsule (birth to 6 months) $25/month',
      'Baby Seat (6 months to 4 years) $25/month',
      'Booster Seat (4 to 6 years) $25/month',
      'Basic GPS unit $8/Day',
      'GPS unit $10/Day',
      'Advanced GPS unit $12/Day',
    ],
    reviewCount: 0,
    reviewsEmpty: 'There are no reviews yet.',
    descriptionNotes: ['*Seasonal & Terms & Conditions Apply'],
  },
}

export function getCarDetailCopy(slug) {
  if (!slug || typeof slug !== 'string') return null
  return CAR_DETAIL_COPY[slug] ?? null
}

export function carDetailHasTabs(copy) {
  if (!copy) return false
  return Boolean(
    copy.descriptionIntro ||
      (copy.specs && copy.specs.length) ||
      (copy.extras && copy.extras.length) ||
      copy.reviewCount !== undefined,
  )
}
