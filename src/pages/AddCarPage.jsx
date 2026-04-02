import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ADDCAR_API,
  ADMIN_GALLERY_IMAGE_INDEX_START,
  ALLOWED_IMAGE_TYPES,
  GET_UPLOAD_URL_API,
  MAX_IMAGE_BYTES,
  generateCarId,
} from '../data/adminCarApi'
import { SALE_BODY_TYPES } from '../data/carsForSale'

const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const TRANSMISSIONS = ['Automatic', 'Manual']
const LOCATIONS = ['Auckland', 'Christchurch', 'Queenstown']
const STATUSES = [
  { value: 'published', label: 'Published' },
  { value: 'sold', label: 'Sold' },
]

const initialForm = {
  title: '',
  make: '',
  model: '',
  modelDetail: '',
  year: '',
  price: '',
  odometer: '',
  fuel: 'Petrol',
  transmission: 'Automatic',
  engineCc: '',
  bodyType: 'SUV',
  location: 'Auckland',
  description: '',
  exteriorColor: '',
  plateNumber: '',
  status: 'published',
}

function validatePickedFiles(fileList) {
  const list = Array.from(fileList || [])
  const out = []
  for (const file of list) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { error: `不支持的类型：${file.name}（请用 JPEG / PNG / WebP / GIF）` }
    }
    if (file.size > MAX_IMAGE_BYTES) {
      return { error: `文件过大：${file.name}（单张最大 3 MB）` }
    }
    out.push(file)
  }
  return { files: out }
}

export default function AddCarPage() {
  const [form, setForm] = useState(initialForm)
  const [coverFiles, setCoverFiles] = useState([])
  const [galleryFiles, setGalleryFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const previewCarIdPrefix = useMemo(() => {
    if (!form.make.trim() || !form.model.trim() || !form.year) return null
    const m = form.make.trim().toUpperCase().replace(/\s+/g, '-')
    const mo = form.model.trim().toUpperCase().replace(/\s+/g, '-')
    return `${m}-${mo}-${form.year}`
  }, [form.make, form.model, form.year])

  const setField = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }))
    setError(null)
    setMessage(null)
  }

  const onCoverFilesSelected = (e) => {
    setError(null)
    setMessage(null)
    const { files: valid, error } = validatePickedFiles(e.target.files)
    if (error) {
      setError(error)
      e.target.value = ''
      return
    }
    setCoverFiles((prev) => {
      const next = [...prev, ...valid]
      if (next.length > 3) {
        setError('封面需正好 3 张，当前会超过 3 张，请先移除再添加')
        return prev
      }
      return next
    })
    e.target.value = ''
  }

  const onGalleryFilesSelected = (e) => {
    setError(null)
    setMessage(null)
    const { files: valid, error } = validatePickedFiles(e.target.files)
    if (error) {
      setError(error)
      e.target.value = ''
      return
    }
    setGalleryFiles((prev) => [...prev, ...valid])
    e.target.value = ''
  }

  const removeCoverFile = (index) => {
    setCoverFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const removeGalleryFile = (index) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const validate = () => {
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

    if (coverFiles.length !== 3) return '封面图必须上传 3 张（请用「选择封面图」添加）'

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setSubmitting(true)
    setError(null)
    setMessage(null)

    const carId = generateCarId(form.make, form.model, form.year)
    const yearNum = Number(form.year)
    const makeTrim = form.make.trim()
    const modelTrim = form.model.trim()
    const odometerNum = Math.round(Number(String(form.odometer).replace(/km$/i, '').replace(/,/g, '')))
    const engineCcNum = Math.round(Number(String(form.engineCc).replace(/cc$/i, '').replace(/,/g, '')))
    const coverUrls = []
    const galleryUrls = []

    const uploadViaPresign = async (file, imageIndex) => {
      const res = await fetch(GET_UPLOAD_URL_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carId,
          make: makeTrim,
          model: modelTrim,
          year: yearNum,
          fileName: file.name,
          contentType: file.type,
          imageIndex,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || data.error || `get_upload_url 失败：${res.status}`)
      }
      const uploadUrl = data.uploadUrl
      const fileUrl = data.fileUrl
      if (!uploadUrl || !fileUrl) {
        throw new Error('get_upload_url 响应缺少 uploadUrl / fileUrl')
      }
      const putRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      })
      if (!putRes.ok) {
        throw new Error(`上传 S3 失败：${file.name}（${putRes.status}）`)
      }
      return fileUrl
    }

    try {
      for (let i = 0; i < coverFiles.length; i++) {
        const url = await uploadViaPresign(coverFiles[i], i + 1)
        coverUrls.push(url)
      }
      for (let i = 0; i < galleryFiles.length; i++) {
        const url = await uploadViaPresign(galleryFiles[i], ADMIN_GALLERY_IMAGE_INDEX_START + i)
        galleryUrls.push(url)
      }

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
        coverImages: coverUrls,
        galleryImages: galleryUrls,
        images: [...coverUrls, ...galleryUrls],
      }

      const addRes = await fetch(ADDCAR_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const addData = await addRes.json().catch(() => ({}))
      if (!addRes.ok) {
        throw new Error(addData.message || addData.error || `addcar 失败：${addRes.status}`)
      }

      setMessage(`已提交。carId：${carId}`)
      setForm(initialForm)
      setCoverFiles([])
      setGalleryFiles([])
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : '提交失败')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="addcar-page">
      <div className="container">
        <nav className="addcar-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/admin/">Admin</Link>
          <span aria-hidden> / </span>
          <span>Add car</span>
        </nav>

        <h1 className="addcar-page__title">Add vehicle</h1>
        <p className="addcar-page__hint">
          提交时会按 Make / Model / Year 与时间戳生成 <strong>carId</strong>
        </p>
        <p className="addcar-page__carid-preview">
          carId 格式：<code>
            {previewCarIdPrefix ? `${previewCarIdPrefix}-YYYYMMDDHHMMSS` : '—（请填写 Make、Model、Year）'}
          </code>
          <span className="addcar-page__hint-inline"></span>
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

          <div className="addcar-form__section">
            <h2 className="addcar-form__heading">图片</h2>
            <p className="addcar-page__hint">
              单张最大{' '}
              <strong>3 MB</strong>；JPEG / PNG / WebP / GIF。
            </p>
            <div className="addcar-form__upload-block">
              <h3 className="addcar-form__subheading">封面图（必须 3 张）</h3>
              <p className="addcar-page__hint addcar-form__upload-hint">
                上传时 <code>imageIndex</code> 为 1、2、3 → Lambda 生成 <code>cover.*</code>、<code>2.*</code>、<code>3.*</code>
              </p>
              <label className="addcar-form__file-btn">
                <span className="fleet-categories__btn addcar-form__file-trigger">选择封面图</span>
                <input type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} multiple onChange={onCoverFilesSelected} hidden />
              </label>
              <p className="addcar-form__count">
                已选 <strong>{coverFiles.length}</strong> / 3
              </p>
              {coverFiles.length > 0 ? (
                <ul className="addcar-form__file-list">
                  {coverFiles.map((f, i) => (
                    <li key={`cover-${f.name}-${i}`}>
                      <span className="addcar-form__file-badge">封面 {i + 1}</span>
                      <span>{f.name}</span>
                      <span className="addcar-form__file-meta">{(f.size / 1024).toFixed(0)} KB</span>
                      <button type="button" className="addcar-form__remove" onClick={() => removeCoverFile(i)}>
                        移除
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <div className="addcar-form__upload-block">
              <h3 className="addcar-form__subheading">其他图片（图库，可选多张）</h3>
              <p className="addcar-page__hint addcar-form__upload-hint">
                与 get_upload_url 约定：全局 <code>imageIndex</code> 从 <strong>{ADMIN_GALLERY_IMAGE_INDEX_START}</strong> 起（1–3 已用于封面 →{' '}
                <code>cover.png</code>、<code>2.*</code>、<code>3.*</code>）。可不选图库。
              </p>
              <label className="addcar-form__file-btn">
                <span className="fleet-categories__btn addcar-form__file-trigger">选择图库图片</span>
                <input type="file" accept={ALLOWED_IMAGE_TYPES.join(',')} multiple onChange={onGalleryFilesSelected} hidden />
              </label>
              {galleryFiles.length > 0 ? (
                <ul className="addcar-form__file-list">
                  {galleryFiles.map((f, i) => (
                    <li key={`gallery-${f.name}-${i}`}>
                      <span className="addcar-form__file-badge">#{ADMIN_GALLERY_IMAGE_INDEX_START + i}</span>
                      <span>{f.name}</span>
                      <span className="addcar-form__file-meta">{(f.size / 1024).toFixed(0)} KB</span>
                      <button type="button" className="addcar-form__remove" onClick={() => removeGalleryFile(i)}>
                        移除
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="addcar-form__actions">
            <button type="submit" className="fleet-categories__btn" disabled={submitting}>
              {submitting ? '提交中…' : 'Submit'}
            </button>
            <Link to="/admin/" className="sale-btn sale-btn--ghost">
              取消
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
