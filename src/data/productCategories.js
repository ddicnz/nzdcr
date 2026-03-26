/**
 * WooCommerce-style product category URLs (e.g. nzdcr.co.nz/product-category/hatches/).
 * @type {Array<{ slug: string, fleetCategory: string, navLabel: string, heroHeading: string, breadcrumbLast: string, intro: string }>}
 */
export const PRODUCT_CATEGORIES = [
  {
    slug: 'hatches',
    fleetCategory: 'compact',
    navLabel: 'Compact',
    heroHeading: 'COMPACT',
    breadcrumbLast: 'Compact',
    intro:
      "While it's important to have space, sometimes all you really need is some pace. Browse through the hatches at NZDCR and zip off with your ideal one today.",
  },
  {
    slug: 'intermediate',
    fleetCategory: 'intermediate',
    navLabel: 'Intermediate',
    heroHeading: 'INTERMEDIATE',
    breadcrumbLast: 'Intermediate',
    intro:
      "Getting from A to B quicker doesn't have to mean cramped quarters. Browse through the sensible sedan and hatch options at NZDCR and pick your perfect blend of vroom vroom and leg room.",
  },
  {
    slug: 'people-mover',
    fleetCategory: 'people-mover',
    navLabel: 'People mover',
    heroHeading: 'PEOPLE MOVER',
    breadcrumbLast: 'People mover',
    intro:
      'If you are a big group, travelling with family, have lots of gear or just want more room, try one of our people movers for size—plenty of seats and bags of space.',
  },
  {
    slug: 'station-wagon',
    fleetCategory: 'station-wagon',
    navLabel: 'Station Wagon',
    heroHeading: 'STATION WAGON',
    breadcrumbLast: 'Station Wagon',
    intro:
      'Because some weekend trips call for a little more, you need a car which stretches too. Browse through the wagons at NZ Discount Car Rentals and cruise off with all the extra space you need.',
  },
  {
    slug: 'suv',
    fleetCategory: 'suv',
    navLabel: 'SUV',
    heroHeading: 'SUV',
    breadcrumbLast: 'SUV',
    intro:
      "If you like to conquer the trail or blaze new ones, we've got just the right SUV for the job so your adventure with the great outdoors can begin.",
  },
]

export function getProductCategoryBySlug(slug) {
  if (!slug) return undefined
  return PRODUCT_CATEGORIES.find((c) => c.slug === slug)
}
