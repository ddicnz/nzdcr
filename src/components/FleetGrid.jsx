import { Link } from 'react-router-dom'
import { FLEET } from '../data/fleet'
import { RCM_BOOKING_LANDING } from '../data/rcmBooking'

export default function FleetGrid({ items = FLEET, withSection = true }) {
  const grid = (
    <div className="container fleet-grid">
      {items.map((car) => (
        <article key={car.name} className="fleet-card">
          <Link to={`/cars/${car.detailSlug}/`} className="fleet-card__link">
            <div className="fleet-card__img-wrap">
              <span className="sale-badge">Sale!</span>
              <img src={car.img} alt="" loading="lazy" />
            </div>
            <h4 className="fleet-card__title">{car.name}</h4>
            <p className="fleet-card__price">
              <span className="was">${car.was.toFixed(2)}</span>
              <span className="now">${car.now.toFixed(2)}</span>
              <span className="from">FROM / day</span>
            </p>
          </Link>
          <a
            href={RCM_BOOKING_LANDING}
            className="fleet-card__book"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book now
          </a>
        </article>
      ))}
    </div>
  )
  if (!withSection) return grid
  return <section className="fleet-section">{grid}</section>
}
