import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { fetchAdminCarDetail, readAdminCarDetailCache } from '../data/adminCarApi'
import { formatSaleOdometer, formatSalePrice } from '../data/carsForSale'

function dedupeImageUrls(covers, gallery) {
  const seen = new Set()
  const out = []
  for (const u of [...(covers || []), ...(gallery || [])]) {
    const s = String(u || '').trim()
    if (!s || seen.has(s)) continue
    seen.add(s)
    out.push(s)
  }
  return out
}

function itemKm(v) {
  const o = v.odometer
  if (typeof o === 'number' && Number.isFinite(o)) return o
  const s = String(o ?? '')
    .replace(/km/gi, '')
    .replace(/,/g, '')
    .trim()
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

function itemPrice(v) {
  const p = v.price
  if (typeof p === 'number' && Number.isFinite(p)) return p
  const n = Number(String(p).replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

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

export default function AdminCarDetailPage() {
  const { carId: carIdParam } = useParams()
  const location = useLocation()

  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [slideIdx, setSlideIdx] = useState(0)

  const images = useMemo(() => {
    if (!item) return []
    return dedupeImageUrls(item.coverImages, item.galleryImages)
  }, [item])

  useEffect(() => {
    setSlideIdx(0)
  }, [item?.carId])

  useEffect(() => {
    const id = String(carIdParam || '').trim()
    if (!id) {
      setItem(null)
      setError('缺少 carId')
      setLoading(false)
      return
    }

    const st = location.state?.fromList
    if (st && st.carId === id) {
      setItem(st)
    } else {
      setItem(readAdminCarDetailCache(id))
    }

    setError(null)
    setLoading(true)
    let cancelled = false
    ;(async () => {
      try {
        const next = await fetchAdminCarDetail(id)
        if (!cancelled) setItem(next)
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : '加载失败')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [carIdParam, location.key, location.state?.fromList?.carId])

  const goPrev = useCallback(() => {
    if (images.length <= 1) return
    setSlideIdx((i) => (i <= 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const goNext = useCallback(() => {
    if (images.length <= 1) return
    setSlideIdx((i) => (i >= images.length - 1 ? 0 : i + 1))
  }, [images.length])

  const activeSrc = images[slideIdx] || ''

  return (
    <div className="sale-page admin-car-detail-page">
      <div className="container">
        <nav className="addcar-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/admin/">Admin</Link>
          <span aria-hidden> / </span>
          <Link to="/admin/cars">All cars</Link>
          <span aria-hidden> / </span>
          <span className="admin-car-detail-page__crumb-current">{item?.title || carIdParam || '…'}</span>
        </nav>

        {error ? (
          <p className="addcar-page__alert addcar-page__alert--error" role="alert">
            {error}
          </p>
        ) : null}

        {loading && !item ? <p className="sale-empty">加载中…</p> : null}

        {item ? (
          <>
            <div className="admin-car-detail-page__gallery">
              {activeSrc ? (
                <>
                  <div className="admin-car-detail-page__slide">
                    <img src={activeSrc} alt="" />
                  </div>
                  {images.length > 1 ? (
                    <>
                      <button type="button" className="admin-car-detail-page__nav admin-car-detail-page__nav--prev" onClick={goPrev} aria-label="上一张">
                        <ChevronLeft />
                      </button>
                      <button type="button" className="admin-car-detail-page__nav admin-car-detail-page__nav--next" onClick={goNext} aria-label="下一张">
                        <ChevronRight />
                      </button>
                      <p className="admin-car-detail-page__count">
                        {slideIdx + 1} / {images.length}
                      </p>
                    </>
                  ) : null}
                </>
              ) : (
                <div className="admin-inventory-card__noimg admin-car-detail-page__noimg">No image</div>
              )}
            </div>

            <div className="admin-car-detail-page__title-row">
              <h1 className="admin-car-detail-page__title">{item.title || `${item.year} ${item.make} ${item.model}`}</h1>
              <Link
                to={`/admin/cars/${encodeURIComponent(item.carId)}/edit`}
                state={{ fromDetail: item }}
                className="fleet-categories__btn admin-car-detail-page__update-link"
              >
                Update
              </Link>
            </div>
            <p className="admin-car-detail-page__price">
              Asking price <strong>{formatSalePrice(itemPrice(item))}</strong>
            </p>

            <dl className="admin-car-detail-page__specs">
              <div>
                <dt>carId</dt>
                <dd>
                  <code>{item.carId}</code>
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{item.status ?? '—'}</dd>
              </div>
              <div>
                <dt>Slug</dt>
                <dd>
                  {item.slug ? (
                    <Link to={`/cars-for-sale/${item.slug}/`}>
                      {item.slug}
                    </Link>
                  ) : (
                    '—'
                  )}
                </dd>
              </div>
              <div>
                <dt>Make / Model</dt>
                <dd>
                  {item.make} {item.model}
                  {item.modelDetail ? ` · ${item.modelDetail}` : ''}
                </dd>
              </div>
              <div>
                <dt>Year</dt>
                <dd>{item.year ?? '—'}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{item.location ?? '—'}</dd>
              </div>
              <div>
                <dt>Odometer</dt>
                <dd>{formatSaleOdometer(itemKm(item))}</dd>
              </div>
              <div>
                <dt>Fuel</dt>
                <dd>{item.fuel ?? '—'}</dd>
              </div>
              <div>
                <dt>Transmission</dt>
                <dd>{item.transmission ?? '—'}</dd>
              </div>
              <div>
                <dt>Engine</dt>
                <dd>{item.engineCc != null ? `${Number(item.engineCc).toLocaleString('en-NZ')} cc` : '—'}</dd>
              </div>
              <div>
                <dt>Body type</dt>
                <dd>{item.bodyType ?? '—'}</dd>
              </div>
              <div>
                <dt>Exterior colour</dt>
                <dd>{item.exteriorColor ? String(item.exteriorColor) : '—'}</dd>
              </div>
              <div>
                <dt>Plate</dt>
                <dd>{item.plateNumber ? String(item.plateNumber) : '—'}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{item.createdAt ? String(item.createdAt) : '—'}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{item.updatedAt ? String(item.updatedAt) : '—'}</dd>
              </div>
            </dl>

            {String(item.description ?? '').trim() ? (
              <section className="admin-car-detail-page__desc">
                <h2 className="admin-car-detail-page__subh">Description</h2>
                <p>{String(item.description).trim()}</p>
              </section>
            ) : null}

            {item.thumbnail ? (
              <p className="admin-car-detail-page__meta-muted">
                thumbnail:{' '}
                <a href={item.thumbnail} target="_blank" rel="noopener noreferrer">
                  open
                </a>
              </p>
            ) : null}
          </>
        ) : !loading ? (
          <p className="sale-empty">无车辆数据</p>
        ) : null}
      </div>
    </div>
  )
}
