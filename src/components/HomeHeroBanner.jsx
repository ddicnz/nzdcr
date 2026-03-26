import { useMemo } from 'react'
import {
  RCM_STEP2_ACTION,
  RCM_LOCATIONS,
  RCM_CATEGORIES,
  RCM_DRIVER_AGES,
  defaultPickupDropoffDates,
  rcmTimeOptions,
} from '../data/rcmBooking'

const HERO_IMG = '/pic/homepage/lisha-riabinina-97-wrSgS50s-unsplash.jpg'

function IconSync() {
  return (
    <svg className="home-booking__btn-icon" width="20" height="20" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"
      />
    </svg>
  )
}

export default function HomeHeroBanner() {
  const { pickupStr, dropoffStr } = useMemo(() => defaultPickupDropoffDates(), [])
  const times = useMemo(() => rcmTimeOptions(), [])

  return (
    <section className="home-hero-banner" aria-label="Hero and booking">
      <div className="home-hero-banner__media">
        <img
          src={HERO_IMG}
          alt=""
          className="home-hero-banner__img"
          loading="eager"
          fetchPriority="high"
        />
        <aside className="home-hero-promo" aria-label="Service highlights">
          <h2 className="home-hero-promo__title">FREE Airport Shuttle Bus</h2>
          <ul className="home-hero-promo__list">
            <li>24/7 Pick up &amp; Drop off</li>
            <li>One-way hire available</li>
            <li>Cross-island travel supported</li>
            <li>Roadside assistance included</li>
            <li>Full tank in & out</li>
          </ul>
        </aside>
      </div>
      <div className="home-hero-banner__panel">
        <h2 className="home-booking__title">Get a Quote or Book a Vehicle</h2>
        <form
          className="home-booking"
          action={RCM_STEP2_ACTION}
          method="post"
          target="_self"
        >
          <div className="home-booking__field">
            <label htmlFor="form-Pickup-Location">Pick up Location</label>
            <select id="form-Pickup-Location" name="form-Pickup-Location" required defaultValue="4">
              {RCM_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.label}</option>
              ))}
            </select>
          </div>
          <div className="home-booking__row">
            <div className="home-booking__field">
              <label htmlFor="form-Pickup-Date">Pick up Date</label>
              <input
                id="form-Pickup-Date"
                name="form-Pickup-Date"
                type="text"
                required
                autoComplete="off"
                placeholder="dd/mm/yyyy"
                defaultValue={pickupStr}
              />
            </div>
            <div className="home-booking__field">
              <label htmlFor="form-Pickup-Time">Pick up Time</label>
              <select id="form-Pickup-Time" name="form-Pickup-Time" required defaultValue="10:00">
                {times.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="home-booking__field">
            <label htmlFor="form-Dropoff-Location">Drop off Location</label>
            <select id="form-Dropoff-Location" name="form-Dropoff-Location" required defaultValue="3">
              {RCM_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.label}</option>
              ))}
            </select>
          </div>
          <div className="home-booking__row">
            <div className="home-booking__field">
              <label htmlFor="form-Dropoff-Date">Drop off Date</label>
              <input
                id="form-Dropoff-Date"
                name="form-Dropoff-Date"
                type="text"
                required
                autoComplete="off"
                placeholder="dd/mm/yyyy"
                defaultValue={dropoffStr}
              />
            </div>
            <div className="home-booking__field">
              <label htmlFor="form-Dropoff-Time">Drop off Time</label>
              <select id="form-Dropoff-Time" name="form-Dropoff-Time" required defaultValue="10:00">
                {times.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="home-booking__row">
            <div className="home-booking__field">
              <label htmlFor="form-Category-Type">Category Type</label>
              <select id="form-Category-Type" name="form-Category-Type" required defaultValue="0">
                {RCM_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div className="home-booking__field">
              <label htmlFor="form-Minimum-Age">Driver Age</label>
              <select id="form-Minimum-Age" name="form-Minimum-Age" required defaultValue="8">
                {RCM_DRIVER_AGES.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="home-booking__field">
            <label htmlFor="form-Promo-Code">Promo Code</label>
            <input
              id="form-Promo-Code"
              name="form-Promo-Code"
              type="text"
              placeholder="Promo-Code if any..."
              autoComplete="off"
            />
          </div>
          <button type="submit" className="home-booking__submit">
            <IconSync />
            Book now!
          </button>
        </form>
      </div>
    </section>
  )
}
