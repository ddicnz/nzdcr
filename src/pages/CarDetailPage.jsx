import { useEffect, useState } from 'react'
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

  const productCategories = fleetItemCategories(car)
    .map((fc) => getProductCategoryByFleetCategory(fc))
    .filter(Boolean)
    .sort((a, b) => a.navLabel.localeCompare(b.navLabel))
  const breadcrumbProductCat = productCategories[0]
  const copy = getCarDetailCopy(car.detailSlug)
  const bullets = copy?.bullets?.length ? copy.bullets : []
  const hasTabs = carDetailHasTabs(copy)
  const showExtrasTab = Array.isArray(copy?.extras) && copy.extras.length > 0

  useEffect(() => {
    if (!showExtrasTab && activeTab === 'extras') {
      setActiveTab('description')
    }
  }, [carSlug, showExtrasTab, activeTab])
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
        {breadcrumbProductCat ? (
          <>
            <span className="car-detail__bc-sep" aria-hidden> / </span>
            <Link to={`/product-category/${breadcrumbProductCat.slug}/`}>{breadcrumbProductCat.navLabel}</Link>
          </>
        ) : null}
        <span className="car-detail__bc-sep" aria-hidden> / </span>
        <span>{car.name}</span>
      </div>

      <div className="container car-detail__hero">
        <div
          className={[
            'car-detail__media',
            car.detailSlug === 'premium-small-hatch' && 'car-detail__media--bright-hatch',
            car.detailSlug === 'intermediate-hatch' && 'car-detail__media--intermediate-hatch-img',
            car.detailSlug === 'intermediate-sedan' && 'car-detail__media--intermediate-sedan-img',
            car.detailSlug === 'large-sedan' && 'car-detail__media--large-sedan-img',
          ]
            .filter(Boolean)
            .join(' ')}
        >
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
          {productCategories.length > 0 ? (
            <p className="car-detail__taxon">
              {productCategories.length > 1 ? 'Categories' : 'Category'}:{` `}
              {productCategories.map((pc, i) => (
                <span key={pc.slug}>
                  {i > 0 ? ', ' : null}
                  <Link to={`/product-category/${pc.slug}/`}>{pc.navLabel}</Link>
                </span>
              ))}
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
              {showExtrasTab ? (
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
              ) : null}
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
                {(copy.descriptionNotes ?? ['*Seasonal & Term Conditions apply']).map((note, i) => (
                  <p key={i} className="car-detail__note">
                    {note}
                  </p>
                ))}
              </div>
            ) : null}

            {showExtrasTab && activeTab === 'extras' ? (
              <div
                id="panel-extras"
                role="tabpanel"
                aria-labelledby="tab-extras"
                className="car-detail__panel"
              >
                <ul className="car-detail__extras-list">
                  {copy.extras.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
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
                  <article
                    className={[
                      'fleet-card',
                      rel.detailSlug === 'premium-small-hatch' && 'fleet-card--bright-hatch',
                      rel.detailSlug === 'intermediate-sedan' && 'fleet-card--intermediate-sedan-img',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Link to={`/cars/${rel.detailSlug}/`} className="fleet-card__link">
                      <div
                        className={[
                          'fleet-card__img-wrap',
                          rel.detailSlug === 'intermediate-hatch' &&
                            'fleet-card__img-wrap--intermediate-hatch',
                          rel.detailSlug === 'large-sedan' && 'fleet-card__img-wrap--large-sedan',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span className="sale-badge">Sale!</span>
                        <img src={rel.img} alt="" loading="lazy" />
                      </div>
                      <h4 className="fleet-card__title">{rel.name}</h4>
                      <p className="fleet-card__price">
                        <span className="was">${rel.was.toFixed(2)}</span>
                        <span className="now">${rel.now.toFixed(2)}</span>
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
                </li>
              )
            })}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
