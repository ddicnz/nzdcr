import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import {
  UPDATE_CAR_API,
  clearAdminCarDetailCache,
  fetchAdminCarDetail,
  readAdminCarDetailCache,
} from '../data/adminCarApi'
import { SALE_BODY_TYPES } from '../data/carsForSale'

const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const TRANSMISSIONS = ['Automatic', 'Manual']
const LOCATIONS = ['Auckland', 'Christchurch', 'Queenstown']
const STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'sold', label: 'Sold' },
]

function cleanUrlList(arr) {
  if (!Array.isArray(arr)) return []
  return arr.map((x) => String(x).trim()).filter(Boolean)
}

function valuesEqual(a, b) {
  if (a === b) return true
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    return a.every((v, i) => v === b[i])
  }
  return false
}

/** Same normalization as the form; compared on submit so only changed fields go in updateInfo. */
function baselinePayloadFromItem(item) {
  const f = itemToForm(item)
  if (!f) return null
  const odometerNum = Math.round(Number(String(f.odometer).replace(/km$/i, '').replace(/,/g, '')))
  const engineCcNum = Math.round(Number(String(f.engineCc).replace(/cc$/i, '').replace(/,/g, '')))
  return {
    title: f.title.trim(),
    make: f.make.trim(),
    model: f.model.trim(),
    modelDetail: f.modelDetail.trim(),
    year: Number(f.year),
    price: Math.round(Number(f.price)),
    location: f.location,
    odometer: odometerNum,
    fuel: f.fuel,
    transmission: f.transmission,
    engineCc: engineCcNum,
    bodyType: f.bodyType,
    description: f.description.trim(),
    exteriorColor: f.exteriorColor.trim(),
    plateNumber: f.plateNumber.trim(),
    status: f.status,
    coverImages: cleanUrlList(item.coverImages),
    galleryImages: cleanUrlList(item.galleryImages),
  }
}

function itemToForm(item) {
  if (!item) return null
  const odo = item.odometer
  const odoStr =
    typeof odo === 'number' && Number.isFinite(odo)
      ? String(Math.round(odo))
      : String(odo ?? '')
          .replace(/km/gi, '')
          .replace(/,/g, '')
          .trim() || '0'
  const eng = item.engineCc
  const engStr =
    typeof eng === 'number' && Number.isFinite(eng)
      ? String(Math.round(eng))
      : String(eng ?? '')
          .replace(/cc/gi, '')
          .replace(/,/g, '')
          .trim()
  const price = item.price
  const priceStr =
    typeof price === 'number' && Number.isFinite(price)
      ? String(Math.round(price))
      : String(price ?? '').replace(/,/g, '')

  const bodyType =
    item.bodyType && SALE_BODY_TYPES.includes(item.bodyType) ? item.bodyType : SALE_BODY_TYPES[0] || 'SUV'

  return {
    title: String(item.title ?? ''),
    make: String(item.make ?? ''),
    model: String(item.model ?? ''),
    modelDetail: String(item.modelDetail ?? ''),
    year: item.year != null ? String(item.year) : '',
    price: priceStr,
    odometer: odoStr,
    fuel: FUELS.includes(item.fuel) ? item.fuel : 'Petrol',
    transmission: TRANSMISSIONS.includes(item.transmission) ? item.transmission : 'Automatic',
    engineCc: engStr,
    bodyType,
    location: LOCATIONS.includes(item.location) ? item.location : 'Auckland',
    description: String(item.description ?? ''),
    exteriorColor: String(item.exteriorColor ?? ''),
    plateNumber: String(item.plateNumber ?? ''),
    status: item.status === 'sold' || item.status === 'published' ? item.status : 'published',
  }
}

export default function AdminEditCarPage() {
  const { carId: carIdParam } = useParams()
  const location = useLocation()

  const [sourceItem, setSourceItem] = useState(null)
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [loadError, setLoadError] = useState(null)
  const [updateDialog, setUpdateDialog] = useState(null)

  const applyItem = useCallback((item) => {
    setSourceItem(item)
    setForm(itemToForm(item))
  }, [])

  useEffect(() => {
    const id = String(carIdParam || '').trim()
    if (!id) {
      setSourceItem(null)
      setForm(null)
      setLoadError('Missing carId')
      setLoading(false)
      return
    }

    const st = location.state?.fromDetail
    if (st && st.carId === id) {
      applyItem(st)
    } else {
      const cached = readAdminCarDetailCache(id)
      if (cached) applyItem(cached)
    }

    setLoadError(null)
    setLoading(true)
    let cancelled = false
    ;(async () => {
      try {
        const next = await fetchAdminCarDetail(id)
        if (!cancelled) applyItem(next)
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : 'Failed to load')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [carIdParam, location.key, location.state?.fromDetail?.carId, applyItem])

  const setField = (key) => (e) => {
    if (!form) return
    setForm((p) => ({ ...p, [key]: e.target.value }))
    setLoadError(null)
    setUpdateDialog(null)
  }

  useEffect(() => {
    if (!updateDialog) return
    const onKey = (ev) => {
      if (ev.key === 'Escape') setUpdateDialog(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [updateDialog])

  const validate = () => {
    if (!form) return 'Form is not ready'
    const y = Number(form.year)
    if (!form.make.trim()) return 'Please enter Make'
    if (!form.model.trim()) return 'Please enter Model'
    if (!form.year || !Number.isFinite(y) || y < 1980 || y > new Date().getFullYear() + 1) return 'Please enter a valid Year'
    if (!form.title.trim()) return 'Please enter Title'
    const price = Number(form.price)
    if (!form.price || !Number.isFinite(price) || price <= 0) return 'Please enter a valid Price'
    if (!form.odometer.trim()) return 'Please enter Odometer'
    const odo = Number(String(form.odometer).replace(/km$/i, '').replace(/,/g, ''))
    if (!Number.isFinite(odo) || odo < 0) return 'Odometer must be a number (km)'
    const cc = Number(String(form.engineCc).replace(/cc$/i, '').replace(/,/g, ''))
    if (!form.engineCc || !Number.isFinite(cc) || cc <= 0) return 'Please enter a valid engine size (cc)'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form || !sourceItem?.carId) {
      setUpdateDialog({
        ok: false,
        title: 'Update failed',
        detail: 'Vehicle data is not ready. Refresh the page and try again.',
      })
      return
    }
    const apiUrl = String(UPDATE_CAR_API || '').trim()
    if (!apiUrl) {
      setUpdateDialog({
        ok: false,
        title: 'Update failed',
        detail: 'Update API is not configured (UPDATE_CAR_API).',
      })
      return
    }

    const err = validate()
    if (err) {
      setUpdateDialog({
        ok: false,
        title: 'Cannot save',
        detail: err,
      })
      return
    }

    setSubmitting(true)
    setUpdateDialog(null)

    const carId = String(sourceItem.carId).trim()
    const baseline = baselinePayloadFromItem(sourceItem)
    if (!baseline) {
      setUpdateDialog({
        ok: false,
        title: 'Update failed',
        detail: 'Could not build a save baseline. Open this page again from the vehicle detail view.',
      })
      setSubmitting(false)
      return
    }

    const yearNum = Number(form.year)
    const odometerNum = Math.round(Number(String(form.odometer).replace(/km$/i, '').replace(/,/g, '')))
    const engineCcNum = Math.round(Number(String(form.engineCc).replace(/cc$/i, '').replace(/,/g, '')))

    const proposed = {
      title: form.title.trim(),
      make: form.make.trim(),
      model: form.model.trim(),
      modelDetail: form.modelDetail.trim(),
      year: yearNum,
      price: Math.round(Number(form.price)),
      location: form.location,
      odometer: odometerNum,
      fuel: form.fuel,
      transmission: form.transmission,
      engineCc: engineCcNum,
      bodyType: form.bodyType,
      description: form.description.trim(),
      exteriorColor: form.exteriorColor.trim(),
      plateNumber: form.plateNumber.trim(),
      status: form.status,
      coverImages: baseline.coverImages,
      galleryImages: baseline.galleryImages,
    }

    const PATCH_KEYS = [
      'title',
      'make',
      'model',
      'modelDetail',
      'year',
      'price',
      'location',
      'odometer',
      'fuel',
      'transmission',
      'engineCc',
      'bodyType',
      'description',
      'exteriorColor',
      'plateNumber',
      'status',
      'coverImages',
      'galleryImages',
    ]

    const payload = { carId }
    for (const k of PATCH_KEYS) {
      if (!valuesEqual(proposed[k], baseline[k])) {
        payload[k] = proposed[k]
      }
    }

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || data.error || `Update failed: ${res.status}`)
      }
      clearAdminCarDetailCache(carId)
      if (data.item && typeof data.item === 'object') {
        applyItem(data.item)
      }
      setUpdateDialog({
        ok: true,
        title: 'Updated successfully',
        detail:
          Object.keys(payload).length <= 1
            ? 'No field changes detected; the server may still have refreshed updatedAt.'
            : 'Vehicle details were saved.',
      })
    } catch (ex) {
      setUpdateDialog({
        ok: false,
        title: 'Update failed',
        detail: ex instanceof Error ? ex.message : 'Update failed',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const carIdLabel = sourceItem?.carId || carIdParam || '—'
  const backTo = `/admin/cars/${encodeURIComponent(String(carIdParam || '').trim())}`

  return (
    <div className="addcar-page">
      <div className="container">
        <nav className="addcar-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/admin/">Admin</Link>
          <span aria-hidden> / </span>
          <Link to="/admin/cars">All cars</Link>
          <span aria-hidden> / </span>
          <Link to={backTo}>Detail</Link>
          <span aria-hidden> / </span>
          <span>Edit</span>
        </nav>

        <h1 className="addcar-page__title">Edit vehicle</h1>
        <p className="addcar-page__hint">
          <strong>carId</strong> (read-only): <code>{carIdLabel}</code>. On save, only <strong>changed fields</strong> are sent
          in <code>updateInfo</code>; Lambda merges the rest with existing data in Dynamo. This page does not edit images yet.
        </p>

        {loadError ? (
          <p className="addcar-page__alert addcar-page__alert--error" role="alert">
            {loadError}
          </p>
        ) : null}

        {loading && !form ? <p className="sale-empty">Loading…</p> : null}

        {form ? (
          <form className="addcar-form" onSubmit={handleSubmit} noValidate>
            <div className="addcar-form__section">
              <h2 className="addcar-form__heading">Vehicle details</h2>
              <div className="addcar-form__grid">
                <label className="sale-field">
                  <span className="sale-field__label">Title</span>
                  <input
                    className="sale-field__input"
                    value={form.title}
                    onChange={setField('title')}
                    placeholder="2018 Toyota Highlander 7 Seater SUV"
                    required
                    autoComplete="off"
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Make</span>
                  <input
                    className="sale-field__input"
                    value={form.make}
                    onChange={setField('make')}
                    placeholder="Toyota"
                    required
                    autoComplete="off"
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Model</span>
                  <input
                    className="sale-field__input"
                    value={form.model}
                    onChange={setField('model')}
                    placeholder="Highlander"
                    required
                    autoComplete="off"
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Model detail</span>
                  <input
                    className="sale-field__input"
                    value={form.modelDetail}
                    onChange={setField('modelDetail')}
                    placeholder="GXL 7 Seater"
                    autoComplete="off"
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Year</span>
                  <input
                    className="sale-field__input"
                    type="number"
                    min={1980}
                    max={new Date().getFullYear() + 1}
                    step={1}
                    value={form.year}
                    onChange={setField('year')}
                    required
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Price (NZD)</span>
                  <input
                    className="sale-field__input"
                    type="number"
                    min={1}
                    step={1}
                    value={form.price}
                    onChange={setField('price')}
                    placeholder="28990"
                    required
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Odometer (km)</span>
                  <input
                    className="sale-field__input"
                    type="number"
                    min={0}
                    step={1}
                    value={form.odometer}
                    onChange={setField('odometer')}
                    placeholder="85000"
                    required
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Engine (cc)</span>
                  <input
                    className="sale-field__input"
                    type="number"
                    min={1}
                    step={1}
                    value={form.engineCc}
                    onChange={setField('engineCc')}
                    placeholder="3500"
                    required
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Fuel</span>
                  <select className="sale-field__input" value={form.fuel} onChange={setField('fuel')}>
                    {FUELS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Transmission</span>
                  <select className="sale-field__input" value={form.transmission} onChange={setField('transmission')}>
                    {TRANSMISSIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Body type</span>
                  <select className="sale-field__input" value={form.bodyType} onChange={setField('bodyType')}>
                    {SALE_BODY_TYPES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Location</span>
                  <select className="sale-field__input" value={form.location} onChange={setField('location')}>
                    {LOCATIONS.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Exterior colour</span>
                  <input
                    className="sale-field__input"
                    value={form.exteriorColor}
                    onChange={setField('exteriorColor')}
                    placeholder="Black"
                    autoComplete="off"
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Plate number</span>
                  <input
                    className="sale-field__input"
                    value={form.plateNumber}
                    onChange={setField('plateNumber')}
                    placeholder="ABC789"
                    autoComplete="off"
                  />
                </label>
                <label className="sale-field">
                  <span className="sale-field__label">Status</span>
                  <select className="sale-field__input" value={form.status} onChange={setField('status')}>
                    {STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="addcar-form__section">
              <label className="sale-field sale-field--wide">
                <span className="sale-field__label">Description</span>
                <textarea
                  className="sale-field__input addcar-form__textarea"
                  rows={4}
                  value={form.description}
                  onChange={setField('description')}
                  placeholder="Spacious 7 seater SUV, perfect for family use."
                />
              </label>
            </div>

            <div className="addcar-form__actions addcar-form__actions--paired">
              <button
                type="submit"
                className="fleet-categories__btn admin-inventory-listing__btn-update"
                disabled={submitting}
              >
                {submitting ? 'Saving…' : 'Update'}
              </button>
              <Link to={backTo} className="fleet-categories__btn admin-form-cancel-link">
                Cancel
              </Link>
            </div>
          </form>
        ) : !loading ? (
          <p className="sale-empty">Could not load vehicle data</p>
        ) : null}

        {updateDialog ? (
          <div className="admin-update-dialog" role="presentation">
            <div
              className="admin-update-dialog__backdrop"
              aria-hidden
              onClick={() => setUpdateDialog(null)}
            />
            <div
              className="admin-update-dialog__panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="admin-update-dialog-title"
            >
              <h2
                id="admin-update-dialog-title"
                className={`admin-update-dialog__title ${updateDialog.ok ? 'admin-update-dialog__title--ok' : 'admin-update-dialog__title--err'}`}
              >
                {updateDialog.title}
              </h2>
              <p className="admin-update-dialog__detail">{updateDialog.detail}</p>
              <button
                type="button"
                className="fleet-categories__btn admin-update-dialog__ok"
                onClick={() => setUpdateDialog(null)}
              >
                OK
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
