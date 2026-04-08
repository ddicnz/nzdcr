import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import BranchContactModal from '../components/BranchContactModal'
import SaleImageGalleryOverlay from '../components/SaleImageGalleryOverlay'
import {
  fetchPublishedSaleVehicleBySlug,
  formatSaleAdminLocation,
  saleListingImageUrls,
} from '../data/dynamoSaleCars'
import { formatSaleOdometer, formatSalePrice } from '../data/carsForSale'
import { NZDCR_BRANCHES } from '../data/branchLocations'

const LOCATION_TITLE = Object.fromEntries(NZDCR_BRANCHES.map((b) => [b.key, b.title]))

function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 7l-5 5 5 5" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 7l5 5-5 5" />
    </svg>
  )
}

export default function SaleVehicleDetailPage() {
  const { saleSlug } = useParams()
  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [slideIdx, setSlideIdx] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [contactBranchKey, setContactBranchKey] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    ;(async () => {
      try {
        const v = saleSlug ? await fetchPublishedSaleVehicleBySlug(saleSlug) : null
        if (cancelled) return
        setVehicle(v)
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Failed to load')
          setVehicle(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [saleSlug])

  const images = useMemo(() => saleListingImageUrls(vehicle), [vehicle])

  useEffect(() => {
    setSlideIdx(0)
  }, [vehicle?.slug])

  const goPrev = useCallback(
    (e) => {
      e?.stopPropagation()
      if (images.length <= 1) return
      setSlideIdx((i) => (i <= 0 ? images.length - 1 : i - 1))
    },
    [images.length],
  )

  const goNext = useCallback(
    (e) => {
      e?.stopPropagation()
      if (images.length <= 1) return
      setSlideIdx((i) => (i >= images.length - 1 ? 0 : i + 1))
    },
    [images.length],
  )

  const openGallery = useCallback(() => {
    if (!images.length) return
    setGalleryOpen(true)
  }, [images.length])

  const activeSrc = images[slideIdx] || ''

  if (loading) {
    return (
      <div className="sale-page admin-car-detail-page sale-vehicle-detail-page">
        <div className="container">
          <p className="sale-empty">Loading…</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="sale-page admin-car-detail-page sale-vehicle-detail-page">
        <div className="container">
          <p className="addcar-page__alert addcar-page__alert--error" role="alert">
            {loadError}
          </p>
          <p>
            <Link to="/cars-for-sale/">Back to cars for sale</Link>
          </p>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return <Navigate to="/cars-for-sale/" replace />
  }

  const v = vehicle
  const loc = LOCATION_TITLE[v.locationKey] ?? formatSaleAdminLocation(v)
  const mailSubject = encodeURIComponent(`Cars for sale: ${v.title}`)
  const mailHref = `mailto:booking@nzdcr.co.nz?subject=${mailSubject}`

  return (
    <div className="sale-page admin-car-detail-page sale-vehicle-detail-page">
      <div className="container">
        <nav className="addcar-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden> / </span>
          <Link to="/cars-for-sale/">Cars for sale</Link>
          <span aria-hidden> / </span>
          <span className="admin-car-detail-page__crumb-current">{v.title}</span>
        </nav>

        <div className="admin-car-detail-page__gallery sale-vehicle-detail-page__gallery">
          {activeSrc ? (
            <>
              <div
                className="admin-car-detail-page__slide sale-vehicle-detail-page__slide"
                role={images.length ? 'button' : undefined}
                tabIndex={images.length ? 0 : undefined}
                onClick={images.length ? openGallery : undefined}
                onKeyDown={
                  images.length
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          openGallery()
                        }
                      }
                    : undefined
                }
                aria-label={images.length ? 'View all photos full screen' : undefined}
              >
                <img src={activeSrc} alt={v.title} />
              </div>
              {images.length > 1 ? (
                <>
                  <button type="button" className="admin-car-detail-page__nav admin-car-detail-page__nav--prev" onClick={goPrev} aria-label="Previous photo">
                    <ChevronLeft />
                  </button>
                  <button type="button" className="admin-car-detail-page__nav admin-car-detail-page__nav--next" onClick={goNext} aria-label="Next photo">
                    <ChevronRight />
                  </button>
                  <p className="admin-car-detail-page__count">{slideIdx + 1} / {images.length}</p>
                </>
              ) : null}
            </>
          ) : (
            <div className="admin-inventory-card__noimg admin-car-detail-page__noimg">No image</div>
          )}
        </div>

        <div className="admin-car-detail-page__title-row">
          <h1 className="admin-car-detail-page__title">{v.title || `${v.year} ${v.make} ${v.model}`}</h1>
        </div>
        <p className="admin-car-detail-page__price">
          Asking price <strong>{formatSalePrice(v.price)}</strong>
        </p>

        <dl className="admin-car-detail-page__specs">
          <div>
            <dt>Make / Model</dt>
            <dd>
              {v.make} {v.model}
              {v.modelDetail ? ` · ${v.modelDetail}` : ''}
            </dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{v.year ?? '—'}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>{loc}</dd>
          </div>
          <div>
            <dt>Odometer</dt>
            <dd>{formatSaleOdometer(v.km)}</dd>
          </div>
          <div>
            <dt>Fuel</dt>
            <dd>{v.fuel ?? '—'}</dd>
          </div>
          <div>
            <dt>Transmission</dt>
            <dd>{v.transmission ?? '—'}</dd>
          </div>
          <div>
            <dt>Engine</dt>
            <dd>{v.engineCc != null ? `${Number(v.engineCc).toLocaleString('en-NZ')} cc` : '—'}</dd>
          </div>
          <div>
            <dt>Body type</dt>
            <dd>{v.bodyType ?? '—'}</dd>
          </div>
          <div>
            <dt>Exterior colour</dt>
            <dd>{v.exteriorColor ? String(v.exteriorColor) : '—'}</dd>
          </div>
          <div>
            <dt>Plate</dt>
            <dd>{v.plateNumber ? String(v.plateNumber) : '—'}</dd>
          </div>
        </dl>

        {String(v.description ?? '').trim() ? (
          <section className="admin-car-detail-page__desc">
            <h2 className="admin-car-detail-page__subh">Description</h2>
            <p>{String(v.description).trim()}</p>
          </section>
        ) : null}

        <p className="sale-detail__note">
          Enquire for finance options, trade-ins, and viewing times. Price indicative — confirm with our team.
        </p>
        <div className="sale-detail__actions">
          <button
            type="button"
            className="sale-btn sale-btn--primary"
            onClick={() => setContactBranchKey(v.locationKey)}
          >
            Contact details
          </button>
          <a href={mailHref} className="sale-btn sale-btn--ghost">
            Email us
          </a>
        </div>
      </div>

      <SaleImageGalleryOverlay
        images={images}
        isOpen={galleryOpen}
        startIndex={slideIdx}
        onClose={() => setGalleryOpen(false)}
        onNavigate={setSlideIdx}
      />
      {contactBranchKey ? (
        <BranchContactModal branchKey={contactBranchKey} onClose={() => setContactBranchKey(null)} />
      ) : null}
    </div>
  )
}
