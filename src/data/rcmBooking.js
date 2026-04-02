/** Rental Car Manager — Discount Car Rentals (must match live step1 API / form field names). */
export const RCM_BOOKING_LANDING =
  'https://web.rentalcarmanager.com/API3/Discount-Car-Rentals/'

/** Customer kiosk / check-in workflow (header “Check-in” opens this on RCM). */
export const RCM_CHECKIN_WORKFLOW_URL =
  'https://web.rentalcarmanager.com/Workflow/workflow/2'

export const RCM_CHECKIN_WORKFLOW_KEY =
  'TnpEaXNjb3VudENhclJlbnRhbHMyMDJ8UkNNU3VwcG9ydHxpeURybzJMNw=='

/**
 * Optional query keys for {@link buildRcmCheckinUrl} when pre-filling. Adjust if RCM changes.
 */
export const RCM_CHECKIN_RESERVATION_QUERY_KEY = 'reservationno'
export const RCM_CHECKIN_LASTNAME_QUERY_KEY = 'lastname'

/**
 * @param {{ reservationNo?: string, lastName?: string }} params
 */
export function buildRcmCheckinUrl({ reservationNo = '', lastName = '' } = {}) {
  const u = new URL(RCM_CHECKIN_WORKFLOW_URL)
  u.searchParams.set('workflowcode', 'kiosk')
  u.searchParams.set('key', RCM_CHECKIN_WORKFLOW_KEY)
  const res = typeof reservationNo === 'string' ? reservationNo.trim() : ''
  const last = typeof lastName === 'string' ? lastName.trim() : ''
  if (res) u.searchParams.set(RCM_CHECKIN_RESERVATION_QUERY_KEY, res)
  if (last) u.searchParams.set(RCM_CHECKIN_LASTNAME_QUERY_KEY, last)
  return u.toString()
}

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

/** YYYY-MM-DD in local calendar (for &lt;input type="date"&gt;) */
export function dateToIsoLocal(d) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/** YYYY-MM-DD → d/m/Y for RCM hidden fields */
export function isoLocalToRcm(iso) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return ''
  const [y, m, d] = iso.split('-').map((x) => parseInt(x, 10))
  return formatRcmDate(new Date(y, m - 1, d))
}

/** 首页预定默认：取车 = 今天起第 7 天，还车 = 取车后再 5 天 */
export function defaultPickupDropoffDates() {
  const pickup = new Date()
  pickup.setDate(pickup.getDate() + 7)
  pickup.setHours(0, 0, 0, 0)
  const dropoff = new Date(pickup)
  dropoff.setDate(dropoff.getDate() + 5)
  return {
    pickupStr: formatRcmDate(pickup),
    dropoffStr: formatRcmDate(dropoff),
    pickupIso: dateToIsoLocal(pickup),
    dropoffIso: dateToIsoLocal(dropoff),
  }
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
