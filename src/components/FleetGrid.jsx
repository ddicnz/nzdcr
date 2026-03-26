import { FLEET } from '../data/fleet'

export default function FleetGrid({ items = FLEET, withSection = true }) {
  const grid = (
    <div className="container fleet-grid">
      {items.map((car) => (
        <article key={car.name} className="fleet-card">
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
        </article>
      ))}
    </div>
  )
  if (!withSection) return grid
  return <section className="fleet-section">{grid}</section>
}
