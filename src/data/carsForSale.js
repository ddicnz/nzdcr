/** @typedef {{ slug: string, title: string, make: string, model: string, bodyType: string, price: number, year: number, km: number, fuel: string, transmission: string, engineCc: number, image: string, location: 'akl' | 'chc' | 'zqn' }} SaleVehicle */

export const SALE_BODY_TYPES = [
  'Sedan',
  'Hatchback',
  'SUV',
  'Wagon',
  'People mover',
  'Commercial',
]

export const SALE_MAKE_OPTIONS = [
  { value: '', label: 'Any make' },
  { value: 'Toyota', label: 'Toyota' },
  { value: 'Honda', label: 'Honda' },
  { value: 'Mazda', label: 'Mazda' },
  { value: 'BMW', label: 'BMW' },
  { value: 'Volkswagen', label: 'Volkswagen' },
  { value: 'Mitsubishi', label: 'Mitsubishi' },
  { value: 'Nissan', label: 'Nissan' },
  { value: 'Subaru', label: 'Subaru' },
]

const IMG = (name) => `/pic/cars/${name}`

/** Demo inventory — replace with CMS/API when available. */
/** @type {SaleVehicle[]} */
export const SALE_VEHICLES = [
  {
    slug: '2016-toyota-corolla-glx-hybrid',
    title: '2016 Toyota Corolla GLX Hybrid, low km, chain-driven',
    make: 'Toyota',
    model: 'Corolla',
    bodyType: 'Hatchback',
    price: 15990,
    year: 2016,
    km: 68200,
    fuel: 'Hybrid',
    transmission: 'Automatic',
    engineCc: 1500,
    image: IMG('Intermediate Hatch.jpg'),
    location: 'akl',
  },
  {
    slug: '2015-honda-odyssey-8-seater',
    title: '2015 Honda Odyssey 8-seater, high spec',
    make: 'Honda',
    model: 'Odyssey',
    bodyType: 'People mover',
    price: 19990,
    year: 2015,
    km: 112900,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 2400,
    image: IMG('10 seater people mover.png'),
    location: 'akl',
  },
  {
    slug: '2017-mazda-cx-5-awd',
    title: '2017 Mazda CX-5 AWD, new shape, high spec',
    make: 'Mazda',
    model: 'CX-5',
    bodyType: 'SUV',
    price: 24950,
    year: 2017,
    km: 52000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 2000,
    image: IMG('Intermediate SUV 4WD.png'),
    location: 'chc',
  },
  {
    slug: '2016-bmw-x1-18d-xdrive',
    title: '2016 BMW X1 18d xDrive, cam chain, high spec',
    make: 'BMW',
    model: 'X1',
    bodyType: 'SUV',
    price: 18990,
    year: 2016,
    km: 78200,
    fuel: 'Diesel',
    transmission: 'Automatic',
    engineCc: 2000,
    image: IMG('7 Seater SUV.png'),
    location: 'chc',
  },
  {
    slug: '2014-volkswagen-golf-gti',
    title: '2014 Volkswagen Golf GTI, low ks, excellent',
    make: 'Volkswagen',
    model: 'Golf GTI',
    bodyType: 'Hatchback',
    price: 21800,
    year: 2014,
    km: 66700,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 2000,
    image: IMG('Intermediate Hatch.jpg'),
    location: 'zqn',
  },
  {
    slug: '2013-toyota-camry-glx-sedan',
    title: '2013 Toyota Camry GLX sedan, one owner',
    make: 'Toyota',
    model: 'Camry',
    bodyType: 'Sedan',
    price: 12990,
    year: 2013,
    km: 132000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 2500,
    image: IMG('Intermediate Sedan.jpg'),
    location: 'akl',
  },
  {
    slug: '2015-mitsubishi-triton-glx-double-cab',
    title: '2015 Mitsubishi Triton GLX double cab ute',
    make: 'Mitsubishi',
    model: 'Triton',
    bodyType: 'Commercial',
    price: 26900,
    year: 2015,
    km: 89500,
    fuel: 'Diesel',
    transmission: 'Automatic',
    engineCc: 2500,
    image: IMG('Intermediate SUV 4WD.png'),
    location: 'chc',
  },
  {
    slug: '2014-subaru-outback-awd-wagon',
    title: '2014 Subaru Outback AWD wagon, serviced',
    make: 'Subaru',
    model: 'Outback',
    bodyType: 'Wagon',
    price: 17490,
    year: 2014,
    km: 118000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    engineCc: 2500,
    image: IMG('super-saver-wagon.png'),
    location: 'zqn',
  },
]

export const KM_MIN_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '0', label: '0 km' },
  { value: '40000', label: '40,000 km' },
  { value: '80000', label: '80,000 km' },
  { value: '120000', label: '120,000 km' },
]

export const KM_MAX_OPTIONS = [
  { value: '', label: 'Any' },
  { value: '60000', label: '60,000 km' },
  { value: '100000', label: '100,000 km' },
  { value: '140000', label: '140,000 km' },
  { value: '200000', label: '200,000 km' },
]

export const PRICE_OPTIONS = [
  { value: '', label: 'Min' },
  { value: '10000', label: '$10,000' },
  { value: '15000', label: '$15,000' },
  { value: '20000', label: '$20,000' },
  { value: '25000', label: '$25,000' },
  { value: '30000', label: '$30,000' },
]

export const PRICE_MAX_OPTIONS = [
  { value: '', label: 'Max' },
  { value: '20000', label: '$20,000' },
  { value: '25000', label: '$25,000' },
  { value: '30000', label: '$30,000' },
  { value: '40000', label: '$40,000' },
  { value: '50000', label: '$50,000' },
]

const yearNow = new Date().getFullYear()
export const YEAR_MIN_OPTIONS = [{ value: '', label: 'From' }].concat(
  Array.from({ length: 12 }, (_, i) => {
    const y = yearNow - i
    return { value: String(y), label: String(y) }
  }),
)

export const YEAR_MAX_OPTIONS = [{ value: '', label: 'To' }].concat(
  Array.from({ length: 12 }, (_, i) => {
    const y = yearNow - i
    return { value: String(y), label: String(y) }
  }),
)

/**
 * 下拉多选用：未选品牌时列出库存里所有「品牌|车型」；选了品牌则只列这些品牌下的车型。
 * @param {string[]} makesFilter
 * @returns {{ value: string, label: string }[]}
 */
export function saleModelOptionsForMakes(makesFilter) {
  const list = makesFilter.length
    ? SALE_VEHICLES.filter((v) => makesFilter.includes(v.make))
    : SALE_VEHICLES
  const seen = new Set()
  const out = []
  for (const v of list) {
    const value = `${v.make}|${v.model}`
    if (seen.has(value)) continue
    seen.add(value)
    const label = makesFilter.length === 1 ? v.model : `${v.model} (${v.make})`
    out.push({ value, label })
  }
  out.sort((a, b) => a.label.localeCompare(b.label, 'en-NZ'))
  return out
}

/** @param {string} slug */
export function getSaleVehicleBySlug(slug) {
  return SALE_VEHICLES.find((v) => v.slug === slug) ?? null
}

export function formatSalePrice(n) {
  return new Intl.NumberFormat('en-NZ', {
    style: 'currency',
    currency: 'NZD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function formatSaleOdometer(n) {
  return `${n.toLocaleString('en-NZ')} km`
}
