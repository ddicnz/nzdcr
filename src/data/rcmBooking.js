/** Rental Car Manager — Discount Car Rentals (must match live step1 API / form field names). */
export const RCM_STEP2_ACTION =
  'https://web.rentalcarmanager.com/API3/Discount-Car-Rentals/step2'

export const RCM_LOCATIONS = [
  { id: '3', label: 'Auckland Airport' },
  { id: '4', label: 'Christchurch Airport' },
  { id: '5', label: 'Queenstown Airport' },
]

/** "All" = 0 per RCM LoadCategoryType */
export const RCM_CATEGORIES = [
  { id: '0', label: 'All' },
  { id: '1', label: 'Compact' },
  { id: '20', label: 'Intermediate' },
  { id: '21', label: 'Station Wagon' },
  { id: '15', label: 'SUV' },
  { id: '14', label: 'People Mover' },
  { id: '17', label: 'Trailer' },
]

/** Option value = rcmDriverAgesInfo id */
export const RCM_DRIVER_AGES = [
  { id: '13', label: '20' },
  { id: '4', label: '21' },
  { id: '5', label: '22' },
  { id: '6', label: '23' },
  { id: '7', label: '24' },
  { id: '8', label: '25+' },
]

/** d/m/Y as required by RCM */
export function formatRcmDate(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
}

export function defaultPickupDropoffDates() {
  const pickup = new Date()
  pickup.setDate(pickup.getDate() + 1)
  pickup.setHours(0, 0, 0, 0)
  const dropoff = new Date(pickup)
  dropoff.setDate(dropoff.getDate() + 7)
  return { pickupStr: formatRcmDate(pickup), dropoffStr: formatRcmDate(dropoff) }
}

const TIME_START = 8
const TIME_END_H = 17

export function rcmTimeOptions() {
  const out = []
  for (let h = TIME_START; h <= TIME_END_H; h++) {
    for (const m of [0, 30]) {
      if (h === TIME_END_H && m > 0) break
      out.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    }
  }
  return out
}
