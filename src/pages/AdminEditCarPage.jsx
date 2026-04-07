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
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const applyItem = useCallback((item) => {
    setSourceItem(item)
    setForm(itemToForm(item))
  }, [])

  useEffect(() => {
    const id = String(carIdParam || '').trim()
    if (!id) {
      setSourceItem(null)
      setForm(null)
      setError('缺少 carId')
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

    setError(null)
    setLoading(true)
    let cancelled = false
    ;(async () => {
      try {
        const next = await fetchAdminCarDetail(id)
        if (!cancelled) applyItem(next)
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
  }, [carIdParam, location.key, location.state?.fromDetail?.carId, applyItem])

  const setField = (key) => (e) => {
    if (!form) return
    setForm((p) => ({ ...p, [key]: e.target.value }))
    setError(null)
    setMessage(null)
  }

  const validate = () => {
    if (!form) return '表单未就绪'
    const y = Number(form.year)
    if (!form.make.trim()) return '请填写 Make'
    if (!form.model.trim()) return '请填写 Model'
    if (!form.year || !Number.isFinite(y) || y < 1980 || y > new Date().getFullYear() + 1) return '请填写有效 Year'
    if (!form.title.trim()) return '请填写 Title'
    const price = Number(form.price)
    if (!form.price || !Number.isFinite(price) || price <= 0) return '请填写有效 Price'
    if (!form.odometer.trim()) return '请填写 Odometer'
    const odo = Number(String(form.odometer).replace(/km$/i, '').replace(/,/g, ''))
    if (!Number.isFinite(odo) || odo < 0) return 'Odometer 应为数字（公里）'
    const cc = Number(String(form.engineCc).replace(/cc$/i, '').replace(/,/g, ''))
    if (!form.engineCc || !Number.isFinite(cc) || cc <= 0) return '请填写有效 Engine CC'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form || !sourceItem?.carId) {
      setError('数据未加载完成')
      return
    }
    const apiUrl = String(UPDATE_CAR_API || '').trim()
    if (!apiUrl) {
      setError('尚未配置更新接口：请在 src/data/adminCarApi.js 中设置 UPDATE_CAR_API')
      return
    }

    const err = validate()
    if (err) {
      setError(err)
      return
    }

    setSubmitting(true)
    setError(null)
    setMessage(null)

    const carId = String(sourceItem.carId).trim()
    const yearNum = Number(form.year)
    const makeTrim = form.make.trim()
    const modelTrim = form.model.trim()
    const odometerNum = Math.round(Number(String(form.odometer).replace(/km$/i, '').replace(/,/g, '')))
    const engineCcNum = Math.round(Number(String(form.engineCc).replace(/cc$/i, '').replace(/,/g, '')))

    const coverImages = Array.isArray(sourceItem.coverImages) ? [...sourceItem.coverImages] : []
    const galleryImages = Array.isArray(sourceItem.galleryImages) ? [...sourceItem.galleryImages] : []
    const images =
      Array.isArray(sourceItem.images) && sourceItem.images.length
        ? [...sourceItem.images]
        : [...coverImages, ...galleryImages]

    const payload = {
      carId,
      title: form.title.trim(),
      make: makeTrim,
      model: modelTrim,
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
      modelDetail: form.modelDetail.trim(),
      status: form.status,
      coverImages,
      galleryImages,
      images,
    }
    if (sourceItem.slug) payload.slug = sourceItem.slug
    if (sourceItem.thumbnail) payload.thumbnail = sourceItem.thumbnail

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || data.error || `更新失败：${res.status}`)
      }
      clearAdminCarDetailCache(carId)
      setMessage('已保存。若详情仍显示旧数据，请刷新页面。')
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : '更新失败')
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
          <Link to={backTo}>详情</Link>
          <span aria-hidden> / </span>
          <span>Edit</span>
        </nav>

        <h1 className="addcar-page__title">Edit vehicle</h1>
        <p className="addcar-page__hint">
          <strong>carId</strong>（只读）：<code>{carIdLabel}</code>。本页暂不修改图片，提交时会沿用当前系统中的封面与图库 URL。
        </p>

        {error ? (
          <p className="addcar-page__alert addcar-page__alert--error" role="alert">
            {error}
          </p>
        ) : null}
        {message ? (
          <p className="addcar-page__alert addcar-page__alert--ok" role="status">
            {message}
          </p>
        ) : null}

        {loading && !form ? <p className="sale-empty">加载中…</p> : null}

        {form ? (
          <form className="addcar-form" onSubmit={handleSubmit} noValidate>
            <div className="addcar-form__section">
              <h2 className="addcar-form__heading">基本信息</h2>
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
                {submitting ? '保存中…' : 'Update'}
              </button>
              <Link to={backTo} className="fleet-categories__btn admin-form-cancel-link">
                取消
              </Link>
            </div>
          </form>
        ) : !loading ? (
          <p className="sale-empty">无法加载车辆数据</p>
        ) : null}
      </div>
    </div>
  )
}
