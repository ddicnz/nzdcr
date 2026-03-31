import { Link, Navigate, useParams } from 'react-router-dom'
import {
  formatSaleOdometer,
  formatSalePrice,
  getSaleVehicleBySlug,
} from '../data/carsForSale'
import { NZDCR_BRANCHES } from '../data/branchLocations'

const LOCATION_TITLE = Object.fromEntries(NZDCR_BRANCHES.map((b) => [b.key, b.title]))

export default function SaleVehicleDetailPage() {
  const { saleSlug } = useParams()
  const v = saleSlug ? getSaleVehicleBySlug(saleSlug) : null

  if (!v) {
    return <Navigate to="/cars-for-sale/" replace />
  }

  const loc = LOCATION_TITLE[v.location] ?? v.location
  const mailSubject = encodeURIComponent(`Cars for sale: ${v.title}`)
  const mailHref = `mailto:booking@nzdcr.co.nz?subject=${mailSubject}`

  return (
    <div className="sale-detail">
      <div className="container sale-detail__breadcrumb">
        <Link to="/">Home</Link>
        <span className="sale-detail__bc-sep" aria-hidden>
          {' '}
          /{' '}
        </span>
        <Link to="/cars-for-sale/">Cars for sale</Link>
        <span className="sale-detail__bc-sep" aria-hidden>
          {' '}
          /{' '}
        </span>
        <span>{v.title}</span>
      </div>

      <div className="container sale-detail__grid">
        <div className="sale-detail__media">
          <img src={v.image} alt={v.title} width={960} height={600} />
        </div>
        <div className="sale-detail__summary">
          <h1 className="sale-detail__title">{v.title}</h1>
          <p className="sale-detail__price">
            {formatSalePrice(v.price)}* <span className="sale-detail__price-note">drive away</span>
          </p>
          <dl className="sale-detail__specs">
            <div className="sale-detail__spec-row">
              <dt>Location</dt>
              <dd>{loc}</dd>
            </div>
            <div className="sale-detail__spec-row">
              <dt>Year</dt>
              <dd>{v.year}</dd>
            </div>
            <div className="sale-detail__spec-row">
              <dt>Odometer</dt>
              <dd>{formatSaleOdometer(v.km)}</dd>
            </div>
            <div className="sale-detail__spec-row">
              <dt>Fuel</dt>
              <dd>{v.fuel}</dd>
            </div>
            <div className="sale-detail__spec-row">
              <dt>Transmission</dt>
              <dd>{v.transmission}</dd>
            </div>
            <div className="sale-detail__spec-row">
              <dt>Engine</dt>
              <dd>{v.engineCc}cc</dd>
            </div>
            <div className="sale-detail__spec-row">
              <dt>Body</dt>
              <dd>{v.bodyType}</dd>
            </div>
            <div className="sale-detail__spec-row">
              <dt>Make &amp; model</dt>
              <dd>
                {v.make} {v.model}
              </dd>
            </div>
          </dl>
          <p className="sale-detail__note">
            Enquire for finance options, trade-ins, and viewing times. Price indicative — confirm with our team.
          </p>
          <div className="sale-detail__actions">
            <a href="tel:080017951795" className="sale-btn sale-btn--primary">
              Call to enquire
            </a>
            <a href={mailHref} className="sale-btn sale-btn--ghost">
              Email us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
