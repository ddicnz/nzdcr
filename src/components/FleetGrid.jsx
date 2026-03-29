import { Link } from 'react-router-dom'
import { FLEET } from '../data/fleet'
import { RCM_BOOKING_LANDING } from '../data/rcmBooking'

export default function FleetGrid({ items = FLEET, withSection = true }) {
  const grid = (
    <div className="container fleet-grid">
      {items.map((car) => (
        <article
          key={car.name}
          className={[
            'fleet-card',
            car.detailSlug === 'premium-small-hatch' && 'fleet-card--bright-hatch',
            car.detailSlug === 'intermediate-sedan' && 'fleet-card--intermediate-sedan-img',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <Link to={`/cars/${car.detailSlug}/`} className="fleet-card__link">
            <div
              className={[
                'fleet-card__img-wrap',
                car.detailSlug === 'intermediate-hatch' && 'fleet-card__img-wrap--intermediate-hatch',
                car.detailSlug === 'large-sedan' && 'fleet-card__img-wrap--large-sedan',
                car.detailSlug === 'suv-4wd2wd' && 'fleet-card__img-wrap--suv-4wd2wd',
                car.detailSlug === 'budget-people-mover' && 'fleet-card__img-wrap--people-mover-zoom',
                car.detailSlug === 'budget-people-mover' && 'fleet-card__img-wrap--budget-people-mover-shift',
                car.detailSlug === 'luxury-people-mover' && 'fleet-card__img-wrap--people-mover-zoom',
              ]
                .filter(Boolean)
                .join(' ')}
            >
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
