import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import CarDetailSpecIcon from '../components/CarDetailSpecIcon'
import {
  carDetailHasTabs,
  getCarDetailCopy,
} from '../data/carDetailContent'
import {
  fleetItemCategories,
  getFleetByDetailSlug,
} from '../data/fleet'
import { getProductCategoryByFleetCategory } from '../data/productCategories'
import { RCM_BOOKING_LANDING } from '../data/rcmBooking'

export default function CarDetailPage() {
  const { carSlug } = useParams()
  const car = getFleetByDetailSlug(carSlug ?? '')
  const [activeTab, setActiveTab] = useState('description')

  if (!car) {
    return <Navigate to="/cars/" replace />
  }

  const primaryFleetCat = fleetItemCategories(car)[0]
  const productCat = getProductCategoryByFleetCategory(primaryFleetCat)
  const copy = getCarDetailCopy(car.detailSlug)
  const bullets = copy?.bullets?.length ? copy.bullets : []
  const hasTabs = carDetailHasTabs(copy)
  const sectionsHtml =
    copy?.sectionsHtml ??
    '<p>Full description for this vehicle is being added.</p>'
  const reviewCount = copy?.reviewCount ?? 0

  return (
    <div className="car-detail">
      <div className="container car-detail__breadcrumb">
        <Link to="/">Home</Link>
        <span className="car-detail__bc-sep" aria-hidden> / </span>
        <Link to="/cars/">Cars to hire</Link>
        {productCat ? (
          <>
            <span className="car-detail__bc-sep" aria-hidden> / </span>
            <Link to={`/product-category/${productCat.slug}/`}>{productCat.navLabel}</Link>
          </>
        ) : null}
        <span className="car-detail__bc-sep" aria-hidden> / </span>
        <span>{car.name}</span>
      </div>

      <div className="container car-detail__hero">
        <div className="car-detail__media">
          <span className="sale-badge">Sale!</span>
          <img src={car.img} alt="" />
        </div>
        <div className="car-detail__summary">
          <h1 className="car-detail__title">{car.name}</h1>
          <p className="car-detail__price">
            <span className="car-detail__was">${car.was.toFixed(2)}</span>
            <span className="car-detail__now">${car.now.toFixed(2)}</span>
            <span className="car-detail__from"> FROM</span>
          </p>
          {bullets.length > 0 ? (
            <ul className="car-detail__bullets">
              {bullets.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
          <a
            href={RCM_BOOKING_LANDING}
            className="car-detail__book"
            target="_blank"
            rel="noopener noreferrer"
          >
            Book now
          </a>
          {productCat ? (
            <p className="car-detail__taxon">
              Category:{` `}
              <Link to={`/product-category/${productCat.slug}/`}>{productCat.navLabel}</Link>
            </p>
          ) : null}
        </div>
      </div>

      <div className="container car-detail__body-wrap">
        {hasTabs && copy ? (
          <>
            <div className="car-detail__tabs" role="tablist" aria-label="Vehicle details">
              <button
                type="button"
                role="tab"
                id="tab-description"
                aria-selected={activeTab === 'description'}
                aria-controls="panel-description"
                className={`car-detail__tab${activeTab === 'description' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button
                type="button"
                role="tab"
                id="tab-extras"
                aria-selected={activeTab === 'extras'}
                aria-controls="panel-extras"
                className={`car-detail__tab${activeTab === 'extras' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('extras')}
              >
                Extras
              </button>
              <button
                type="button"
                role="tab"
                id="tab-reviews"
                aria-selected={activeTab === 'reviews'}
                aria-controls="panel-reviews"
                className={`car-detail__tab${activeTab === 'reviews' ? ' is-active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviewCount})
              </button>
            </div>

            {activeTab === 'description' ? (
              <div
                id="panel-description"
                role="tabpanel"
                aria-labelledby="tab-description"
                className="car-detail__panel"
              >
                {copy.descriptionIntro ? (
                  <p className="car-detail__intro">{copy.descriptionIntro}</p>
                ) : null}
                {copy.specs?.length ? (
                  <div className="car-detail__spec-grid">
                    {copy.specs.map((row) => (
                      <div key={row.text} className="car-detail__spec-cell">
                        <CarDetailSpecIcon name={row.icon} />
                        <span className="car-detail__spec-text">{row.text}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
                <p className="car-detail__note">*Seasonal &amp; Term Conditions apply</p>
              </div>
            ) : null}

            {activeTab === 'extras' ? (
              <div
                id="panel-extras"
                role="tabpanel"
                aria-labelledby="tab-extras"
                className="car-detail__panel"
              >
                {copy.extras?.length ? (
                  <ul className="car-detail__extras-list">
                    {copy.extras.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="car-detail__muted">No extras listed.</p>
                )}
              </div>
            ) : null}

            {activeTab === 'reviews' ? (
              <div
                id="panel-reviews"
                role="tabpanel"
                aria-labelledby="tab-reviews"
                className="car-detail__panel"
              >
                <p className="car-detail__reviews-empty">
                  {copy.reviewsEmpty ?? 'There are no reviews yet.'}
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <div
            className="terms-prose car-detail__body"
            dangerouslySetInnerHTML={{ __html: sectionsHtml }}
          />
        )}
      </div>

      {copy?.relatedSlugs?.length ? (
        <section className="container car-detail__related">
          <h2 className="car-detail__related-title">Related products</h2>
          <ul className="car-detail__related-list">
            {copy.relatedSlugs.map((slug) => {
              const rel = getFleetByDetailSlug(slug)
              if (!rel) return null
              return (
                <li key={slug}>
                  <Link to={`/cars/${rel.detailSlug}/`} className="car-detail__related-card">
                    <span className="sale-badge sale-badge--sm">Sale!</span>
                    <span className="car-detail__related-name">{rel.name}</span>
                    <span className="car-detail__related-price">
                      <span className="was">${rel.was.toFixed(2)}</span>
                      <span className="now">${rel.now.toFixed(2)}</span>
                      <span className="from"> FROM</span>
                    </span>
                    <span className="car-detail__related-cta">Book Now</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
