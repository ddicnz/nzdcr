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
    relatedSlugs: ['suv-4wd2wd'],
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
      'suv-4wd2wd',
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
    descriptionNotes: ['*Seasonal & Term Conditions Apply'],
  },
  'large-sedan': {
    bullets: [
      'Comfortable Economy Cars',
      'World famous family size 4 door Sedan Toyota Camry, or similar model',
      '2012 – 2019',
    ],
    relatedSlugs: ['intermediate-sedan', 'suv-4wd2wd', 'intermediate-hatch'],
    descriptionIntro:
      'The best partner for trip with most comfortable seats and excellent driving experience.',
    specs: [
      { icon: 'doors', text: '4 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '5 Seats' },
      { icon: 'automatic', text: 'Automatic' },
      { icon: 'luggage', text: '3 Large luggages, 2 Small luggages' },
      { icon: 'engine', text: '1.8–2.0L' },
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
    descriptionNotes: ['*Seasonal & Term Conditions apply'],
  },
  'intermediate-sedan': {
    bullets: ['Median size Cars', 'Toyota Corolla 4 door sedan or Similar'],
    relatedSlugs: ['large-sedan', 'intermediate-hatch', 'suv-4wd2wd'],
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
  'suv-4wd2wd': {
    bullets: ['Median size SUV', 'Toyota Rav4 AWD Model or similar', '2014 – 2019'],
    relatedSlugs: ['7-seater-suv', 'super-saver-wagon', 'large-sedan', 'intermediate-hatch'],
    descriptionIntro:
      "When your trips need you to go off road, don't go off the rails looking for the right SUV 4WD to rent. Our range of 4WD is great for ski, fishing and camping trips on rougher roads.",
    specs: [
      { icon: 'doors', text: '5 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '5 Seats' },
      { icon: 'automatic', text: 'Automatic Transmission' },
      { icon: 'luggage', text: '3 Large luggages, 1 Small luggage' },
      { icon: 'engine', text: '2.4 L' },
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
      '* Special price applies in seasonal occasional and depends on the length of hire. Please refer to the figures with real booking dates.',
    ],
  },
  'budget-people-mover': {
    bullets: [
      'Well maintained Budget Cars',
      'Toyota Estima 7 or 8 seater or similars',
      'If you require specifically 8 seater please call or email to confirm',
    ],
    relatedSlugs: [
      '12-seater-minibus',
      '10-seater-people-mover',
      '7-seater-suv',
      'luxury-people-mover',
    ],
    descriptionIntro:
      "Some trips aren't complete unless the whole family's there. If you add more space for everyone without adding too much to the cost of your next trip, check out the budget people mover archives at NZDCR. Great for a budget holiday for larger groups and luggage.",
    specs: [
      { icon: 'doors', text: '4 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '7/8 Seats' },
      { icon: 'automatic', text: 'Automatic Transmission' },
      { icon: 'luggage', text: '4 Large luggages, 3 Small luggages' },
      { icon: 'engine', text: '2.2–2.4 L' },
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
    descriptionNotes: ['*Seasonal & Term Conditions apply'],
  },
  'luxury-people-mover': {
    bullets: [
      'Super comfortable people mover, highway star',
      'Toyota Alphard / Toyota Vellfire or Similar model',
      '7/8 Seater, 2.4L-3.0L, Petrol, Auto',
      '2008 – 2012',
    ],
    relatedSlugs: [
      'budget-people-mover',
      '12-seater-minibus',
      '10-seater-people-mover',
      '7-seater-suv',
    ],
    descriptionIntro:
      "If you're looking for a Premium people mover to hire in New Zealand, we've got the world most popular people carriers such as Toyota Alphard and Nissan Elgrand for hire, which you can't find from most of other car rental companies. To enjoy the journey while you travel with your families in New Zealand, here you have got the best choice.",
    specs: [
      { icon: 'doors', text: '5 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '7/8 Seats' },
      { icon: 'automatic', text: 'Automatic Transmission' },
      { icon: 'luggage', text: '2 Large luggages, 4 Small luggages' },
      { icon: 'engine', text: '2.4–3.0L' },
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
    descriptionNotes: ['*Seasonal & Term Conditions apply'],
  },
  '7-seater-suv': {
    bullets: [
      'Full family size SUV',
      'Toyota Highlander or Similar',
      '7 Seater, 2+3+2, 3.5L, Petrol, Auto, Safe to drive',
    ],
    relatedSlugs: [
      '10-seater-people-mover',
      'suv-4wd2wd',
      'budget-people-mover',
      'luxury-people-mover',
    ],
    descriptionIntro:
      "If you're looking for a 7 Seater people carrier as well as a SUV to hire in New Zealand, we've got the world most popular 7 Seater SUV in New Zealand Toyota Highlander for hire. Highlander is New Zealand New Model 7 Seater. To enjoy the journey while you travel with your families in New Zealand, here you have got the best choice.",
    specs: [
      { icon: 'doors', text: '5 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '7 Seats' },
      { icon: 'automatic', text: 'Automatic Transmission' },
      { icon: 'luggage', text: '2 Large luggages, 2 Small luggages' },
      { icon: 'engine', text: '2.4L' },
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
  '10-seater-people-mover': {
    bullets: [
      'Comfortable Economy MPV',
      '10 Seater Toyota Hiace or similar Minivan with luggage space.',
    ],
    relatedSlugs: [
      'budget-people-mover',
      '7-seater-suv',
      'luxury-people-mover',
      '12-seater-minibus',
    ],
    descriptionIntro:
      'Choose Toyota Hiace 10 seaters people movers from NZDCR, perfect for group travellers or sports team. Best value for your money and safe to drive, automatic, 2.7L petrol vehicle.',
    specs: [
      { icon: 'doors', text: '4 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '10 Seats' },
      { icon: 'automatic', text: 'Automatic Transmission' },
      { icon: 'luggage', text: '7 Large luggages' },
      { icon: 'engine', text: '2.7 L' },
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
    descriptionNotes: ['*Seasonal & Term Conditions apply'],
  },
  '12-seater-minibus': {
    bullets: [
      'Spacious 12 seater Minibus',
      'Toyota Hiace or similar',
      'Plenty of luggage space',
      'Automatic',
    ],
    relatedSlugs: [
      '7-seater-suv',
      '10-seater-people-mover',
      'budget-people-mover',
      'luxury-people-mover',
    ],
    descriptionIntro:
      "If you're looking for a 12 seater Minibus to hire in New Zealand, we've got the best option for hire, the Toyota Hiace and/or LDV V80 Minibus. They are Automatic, running on Diesel or Petrol. They have 12 seaters with spacious luggage space on the back so that you don't need to hire a trailer separately. It is perfect for family or small group tour. To enjoy your top class journey while you travel in New Zealand, here you have got the best choice.",
    specs: [
      { icon: 'doors', text: '4 Doors' },
      { icon: 'ac', text: 'Air-conditioning' },
      { icon: 'seats', text: '12 Seats' },
      { icon: 'automatic', text: 'Automatic Transmission' },
      { icon: 'luggage', text: '8 Large luggages, 10 Small luggages' },
      { icon: 'engine', text: '3.0L Diesel Turbo' },
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
      'Price is for reference only and it varies depending on the season and length of rental. Please refer to the booking system live prices as the accurate prices.',
      '*Seasonal & Term Conditions apply',
    ],
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
