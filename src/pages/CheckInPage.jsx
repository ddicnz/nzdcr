import { useState } from 'react'
import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import { buildRcmCheckinUrl } from '../data/rcmBooking'

export default function CheckInPage() {
  const [reservationNo, setReservationNo] = useState('')
  const [lastName, setLastName] = useState('')
  const [popupBlocked, setPopupBlocked] = useState(false)

  const payload = { reservationNo, lastName }

  const onSubmit = (e) => {
    e.preventDefault()
    setPopupBlocked(false)
    const url = buildRcmCheckinUrl(payload)
    const w = window.open(url, '_blank', 'noopener,noreferrer')
    if (w == null || typeof w.closed === 'undefined') {
      setPopupBlocked(true)
    }
  }

  return (
    <>
      <PageHeroBanner {...roadHero('CHECK-IN', 'Check-in')} />
      <div className="container checkin-page">
        <div className="checkin-page__card">
          <h2 className="checkin-page__form-title">Please enter the following:</h2>
          <p className="checkin-page__lead">
            Save time at the counter by doing your check-in now!
          </p>
          <form className="checkin-page__form" onSubmit={onSubmit}>
            <div className="checkin-page__field">
              <label htmlFor="checkin-reservation-no">Reservation No:</label>
              <input
                id="checkin-reservation-no"
                name="reservationNo"
                type="text"
                autoComplete="off"
                placeholder="Reservation Number..."
                value={reservationNo}
                onChange={(e) => setReservationNo(e.target.value)}
                required
              />
            </div>
            <div className="checkin-page__field">
              <label htmlFor="checkin-last-name">Last Name:</label>
              <input
                id="checkin-last-name"
                name="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Last Name..."
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="checkin-page__submit">
              Submit
            </button>
          </form>
          {popupBlocked ? (
            <p className="checkin-page__notice" role="status">
              Your browser blocked the new tab. Allow pop-ups for this site or{' '}
              <a href={buildRcmCheckinUrl(payload)} target="_blank" rel="noopener noreferrer">
                open check-in in a new tab
              </a>
              .
            </p>
          ) : null}
        </div>
      </div>
    </>
  )
}
