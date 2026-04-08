import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminInventoryCarMedia from '../components/AdminInventoryCarMedia'
import {
  IconAdminEngine,
  IconAdminFuel,
  IconAdminOdometer,
  IconAdminPin,
  IconAdminTransmission,
} from '../components/AdminListingSpecIcons'
import SaleMultiSelect from '../components/SaleMultiSelect'
import SaleRangePill from '../components/SaleRangePill'
import {
  adminModelOptionsFromItems,
  clearAdminCarDetailCache,
  DELETE_CAR_API,
  GET_ADMIN_CARS_API,
} from '../data/adminCarApi'
import { formatSaleOdometer, formatSalePrice } from '../data/carsForSale'
import {
  KM_MAX_OPTIONS,
  KM_MIN_OPTIONS,
  PRICE_MAX_OPTIONS,
  PRICE_OPTIONS,
  SALE_BODY_TYPES,
  SALE_MAKE_OPTIONS,
  YEAR_MAX_OPTIONS,
  YEAR_MIN_OPTIONS,
} from '../data/carsForSale'

const FUEL_VALUES = ['Petrol', 'Diesel', 'Hybrid', 'Electric']
const DEFAULT_LOCATIONS = ['Auckland', 'Christchurch', 'Queenstown']
const STATUS_OPTIONS = [
  { value: 'published', label: 'Published' },
  { value: 'sold', label: 'Sold' },
]

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
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

function itemYear(v) {
  const y = v.year
  if (typeof y === 'number' && Number.isFinite(y)) return y
  const n = Number(y)
  return Number.isFinite(n) ? n : 0
}

function formatAdminLocation(v) {
  const loc = String(v.location ?? '').trim()
  const reg = String(v.region ?? '').trim()
  if (loc && reg && loc.toLowerCase() !== reg.toLowerCase()) return `${loc}, ${reg}`
  return loc || reg || '—'
}

function formatAdminEngineCc(v) {
  const cc = v.engineCc
  if (typeof cc === 'number' && Number.isFinite(cc) && cc > 0) {
    return `${Math.round(cc).toLocaleString('en-NZ')} cc`
  }
  const s = String(v.engine ?? '').trim()
  return s || '—'
}

function formatListedLine(v) {
  if (v.status === 'sold') return 'Sold'
  const created = v.createdAt
  if (!created) return 'Published'
  const d = new Date(created)
  if (Number.isNaN(d.getTime())) return 'Published'
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return 'Listed today'
  return `Listed ${d.toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}`
}

function listingHeadline(v) {
  const y = itemYear(v)
  const make = String(v.make ?? '').trim()
  const model = String(v.model ?? '').trim()
  const parts = []
  if (y > 0) parts.push(String(y))
  if (make) parts.push(make)
  if (model) parts.push(model)
  return parts.length ? parts.join(' ') : String(v.title ?? '').trim() || '—'
}

function adminInventoryMatches(f, v) {
  const kw = f.keyword.trim().toLowerCase()
  if (kw) {
    const blob = `${v.title ?? ''} ${v.make ?? ''} ${v.model ?? ''} ${v.carId ?? ''} ${v.description ?? ''}`
      .toLowerCase()
    if (!blob.includes(kw)) return false
  }
  if (f.makes.length && !f.makes.includes(v.make)) return false
  if (f.models.length) {
    const key = `${v.make}|${v.model}`
    if (!f.models.includes(key)) return false
  }
  if (f.bodyTypes.length && !f.bodyTypes.includes(v.bodyType)) return false
  if (f.fuels.length && !f.fuels.includes(v.fuel)) return false
  if (f.locations.length && !f.locations.includes(v.location)) return false
  if (f.statuses.length && !f.statuses.includes(v.status)) return false

  const price = itemPrice(v)
  const year = itemYear(v)
  const km = itemKm(v)

  if (f.priceMin) {
    const min = Number(f.priceMin)
    if (Number.isFinite(min) && price < min) return false
  }
  if (f.priceMax) {
    const max = Number(f.priceMax)
    if (Number.isFinite(max) && price > max) return false
  }
  if (f.yearMin) {
    const y = Number(f.yearMin)
    if (Number.isFinite(y) && year < y) return false
  }
  if (f.yearMax) {
    const y = Number(f.yearMax)
    if (Number.isFinite(y) && year > y) return false
  }
  if (f.kmMin) {
    const min = Number(f.kmMin)
    if (Number.isFinite(min) && km < min) return false
  }
  if (f.kmMax) {
    const max = Number(f.kmMax)
    if (Number.isFinite(max) && km > max) return false
  }
  return true
}

const initialFilters = {
  keyword: '',
  makes: [],
  models: [],
  bodyTypes: [],
  fuels: [],
  locations: [],
  statuses: [],
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  kmMin: '',
  kmMax: '',
}

const MAKE_CHECKBOXES = SALE_MAKE_OPTIONS.filter((o) => o.value)
const BODY_OPTIONS = SALE_BODY_TYPES.map((bt) => ({ value: bt, label: bt }))
const FUEL_OPTIONS = FUEL_VALUES.map((x) => ({ value: x, label: x }))

export default function AdminInventoryPage() {
  const navigate = useNavigate()
  const [inventoryItems, setInventoryItems] = useState([])
  const [loadedAt, setLoadedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [openPicker, setOpenPicker] = useState(null)
  const [deletingCarId, setDeletingCarId] = useState(null)

  const loadInventory = useCallback(async () => {
    setLoading(true)
    setFetchError(null)
    try {
      const res = await fetch(GET_ADMIN_CARS_API)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || data.error || `加载失败（${res.status}）`)
      }
      const items = Array.isArray(data.items) ? data.items : []
      setInventoryItems(items)
      setLoadedAt(new Date())
    } catch (e) {
      setFetchError(e instanceof Error ? e.message : '加载失败')
      setInventoryItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  const locationOptions = useMemo(() => {
    const set = new Set(DEFAULT_LOCATIONS)
    for (const it of inventoryItems) {
      if (it.location) set.add(it.location)
    }
    return [...set].sort().map((loc) => ({ value: loc, label: loc }))
  }, [inventoryItems])

  const modelOptions = useMemo(
    () => adminModelOptionsFromItems(inventoryItems, filters.makes),
    [inventoryItems, filters.makes],
  )

  useEffect(() => {
    setFilters((prev) => {
      const valid = new Set(adminModelOptionsFromItems(inventoryItems, prev.makes).map((o) => o.value))
      const models = prev.models.filter((k) => valid.has(k))
      if (models.length === prev.models.length) return prev
      return { ...prev, models }
    })
  }, [inventoryItems, filters.makes])

  const filtered = useMemo(
    () => inventoryItems.filter((v) => adminInventoryMatches(filters, v)),
    [inventoryItems, filters],
  )

  const setField = (key) => (e) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const toggleFilterList = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: toggleInList(prev[key], value) }))
  }

  const handleReset = () => {
    setOpenPicker(null)
    setFilters(initialFilters)
  }

  const handleDeleteCard = async (v) => {
    const id = String(v.carId ?? '').trim()
    if (!id) return
    const label = listingHeadline(v)
    if (!window.confirm(`确认删除「${label}」？此操作不可恢复。`)) return

    const apiUrl = String(DELETE_CAR_API || '').trim()
    if (!apiUrl) {
      window.alert('尚未配置删除接口：请在 src/data/adminCarApi.js 中设置 DELETE_CAR_API')
      return
    }

    setDeletingCarId(id)
    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || data.error || `删除失败：${res.status}`)
      }
      clearAdminCarDetailCache(id)
      setInventoryItems((prev) => prev.filter((x) => String(x.carId) !== id))
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '删除失败')
    } finally {
      setDeletingCarId(null)
    }
  }

  return (
    <div className="sale-page admin-inventory-page">
      <div className="container">
        <nav className="addcar-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/admin/">Admin</Link>
          <span aria-hidden> / </span>
          <span>All cars</span>
        </nav>

        <p className="sale-page__intro">
          数据来自 DynamoDB（<code>getadmincars</code>），加载后缓存在本页内存中；可筛选 <strong>published</strong> 与{' '}
          <strong>sold</strong>。头图为 <code>coverImages</code> 三联拼图；<strong>点击整条卡片</strong>进入详情（
          <code>getcardetail</code>）。
        </p>

        <div className="admin-inventory-page__toolbar">
          <button type="button" className="fleet-categories__btn" onClick={loadInventory} disabled={loading}>
            {loading ? '加载中…' : '刷新列表'}
          </button>
          {loadedAt ? (
            <span className="admin-inventory-page__loaded">
              已缓存 <strong>{inventoryItems.length}</strong> 条 · 上次加载{' '}
              {loadedAt.toLocaleString('en-NZ')}
            </span>
          ) : null}
        </div>

        {fetchError ? (
          <p className="addcar-page__alert addcar-page__alert--error" role="alert">
            {fetchError}
          </p>
        ) : null}

        <section className="sale-search" aria-label="Filter inventory">
          <h2 className="sale-search__title">Find a vehicle</h2>

          <div className="sale-search__block sale-search__block--row1 sale-search__block--row1--admin">
            <label className="sale-field sale-field--keyword">
              <span className="sale-field__label">Keyword</span>
              <input
                type="search"
                className="sale-field__input"
                placeholder="Title, make, model, carId…"
                value={filters.keyword}
                onChange={setField('keyword')}
                autoComplete="off"
              />
            </label>

            <SaleMultiSelect
              dropdownKey="adm-make"
              openKey={openPicker}
              onOpenKeyChange={setOpenPicker}
              label="Make"
              placeholder="Any make"
              options={MAKE_CHECKBOXES}
              selected={filters.makes}
              onToggle={(v) => toggleFilterList('makes', v)}
              onClear={() => setFilters((p) => ({ ...p, makes: [] }))}
            />

            <SaleMultiSelect
              dropdownKey="adm-model"
              openKey={openPicker}
              onOpenKeyChange={setOpenPicker}
              label="Model"
              placeholder={modelOptions.length ? 'Any model' : '—'}
              options={modelOptions}
              selected={filters.models}
              onToggle={(v) => toggleFilterList('models', v)}
              onClear={() => setFilters((p) => ({ ...p, models: [] }))}
            />

            <SaleMultiSelect
              dropdownKey="adm-body"
              openKey={openPicker}
              onOpenKeyChange={setOpenPicker}
              label="Body style"
              placeholder="Any body type"
              options={BODY_OPTIONS}
              selected={filters.bodyTypes}
              onToggle={(v) => toggleFilterList('bodyTypes', v)}
              onClear={() => setFilters((p) => ({ ...p, bodyTypes: [] }))}
            />

            <SaleMultiSelect
              dropdownKey="adm-loc"
              openKey={openPicker}
              onOpenKeyChange={setOpenPicker}
              label="Location"
              placeholder="Any location"
              options={locationOptions}
              selected={filters.locations}
              onToggle={(v) => toggleFilterList('locations', v)}
              onClear={() => setFilters((p) => ({ ...p, locations: [] }))}
            />

            <SaleMultiSelect
              dropdownKey="adm-status"
              openKey={openPicker}
              onOpenKeyChange={setOpenPicker}
              label="Status"
              placeholder="All statuses"
              options={STATUS_OPTIONS}
              selected={filters.statuses}
              onToggle={(v) => toggleFilterList('statuses', v)}
              onClear={() => setFilters((p) => ({ ...p, statuses: [] }))}
            />
          </div>

          <div className="sale-search__row-pills">
            <div className="sale-field sale-field--range-block">
              <span className="sale-field__label">Year</span>
              <SaleRangePill
                dropdownKey="adm-year"
                openKey={openPicker}
                onOpenKeyChange={setOpenPicker}
                title="Year"
                summaryPrefix="Year"
                fromOptions={YEAR_MIN_OPTIONS}
                toOptions={YEAR_MAX_OPTIONS}
                fromValue={filters.yearMin}
                toValue={filters.yearMax}
                onFromChange={(v) => setFilters((p) => ({ ...p, yearMin: v }))}
                onToChange={(v) => setFilters((p) => ({ ...p, yearMax: v }))}
                onClear={() => setFilters((p) => ({ ...p, yearMin: '', yearMax: '' }))}
              />
            </div>
            <div className="sale-field sale-field--range-block">
              <span className="sale-field__label">Price</span>
              <SaleRangePill
                dropdownKey="adm-price"
                openKey={openPicker}
                onOpenKeyChange={setOpenPicker}
                title="Price"
                summaryPrefix="Price"
                fromOptions={PRICE_OPTIONS}
                toOptions={PRICE_MAX_OPTIONS}
                fromValue={filters.priceMin}
                toValue={filters.priceMax}
                onFromChange={(v) => setFilters((p) => ({ ...p, priceMin: v }))}
                onToChange={(v) => setFilters((p) => ({ ...p, priceMax: v }))}
                onClear={() => setFilters((p) => ({ ...p, priceMin: '', priceMax: '' }))}
              />
            </div>
            <div className="sale-field sale-field--range-block">
              <span className="sale-field__label">Odometer</span>
              <SaleRangePill
                dropdownKey="adm-km"
                openKey={openPicker}
                onOpenKeyChange={setOpenPicker}
                title="Odometer"
                summaryPrefix="Odometer"
                fromOptions={KM_MIN_OPTIONS}
                toOptions={KM_MAX_OPTIONS}
                fromValue={filters.kmMin}
                toValue={filters.kmMax}
                onFromChange={(v) => setFilters((p) => ({ ...p, kmMin: v }))}
                onToChange={(v) => setFilters((p) => ({ ...p, kmMax: v }))}
                onClear={() => setFilters((p) => ({ ...p, kmMin: '', kmMax: '' }))}
              />
            </div>

            <div className="sale-field sale-field--row2-fuel">
              <SaleMultiSelect
                dropdownKey="adm-fuel"
                openKey={openPicker}
                onOpenKeyChange={setOpenPicker}
                label="Fuel"
                placeholder="Any fuel"
                options={FUEL_OPTIONS}
                selected={filters.fuels}
                onToggle={(v) => toggleFilterList('fuels', v)}
                onClear={() => setFilters((p) => ({ ...p, fuels: [] }))}
              />
            </div>
          </div>

          <div className="sale-search__actions">
            <button type="button" className="fleet-categories__btn" onClick={handleReset}>
              Reset all
            </button>
            <p className="sale-search__hint" role="status">
              Showing <strong>{filtered.length}</strong> of {inventoryItems.length} vehicles — filters apply instantly.
            </p>
          </div>
        </section>

        <ul className="sale-results admin-inventory-page__results">
          {filtered.map((v) => {
            const cardCarId = String(v.carId ?? '').trim()
            return (
            <li
              key={cardCarId || v.carId}
              className="admin-inventory-listing admin-inventory-listing--clickable"
              role="button"
              tabIndex={0}
              onClick={() =>
                navigate(`/admin/cars/${encodeURIComponent(cardCarId)}`, { state: { fromList: v } })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate(`/admin/cars/${encodeURIComponent(cardCarId)}`, { state: { fromList: v } })
                }
              }}
            >
              <div className="admin-inventory-listing__media">
                <AdminInventoryCarMedia key={v.carId} vehicle={v} />
              </div>
              <div className="admin-inventory-listing__body">
                <p
                  className={`admin-inventory-listing__listed ${v.status === 'sold' ? 'admin-inventory-listing__listed--sold' : ''}`}
                >
                  {formatListedLine(v)}
                </p>
                <h3 className="admin-inventory-listing__title">{listingHeadline(v)}</h3>
                {String(v.description ?? '').trim() ? (
                  <p className="admin-inventory-listing__desc">{String(v.description).trim()}</p>
                ) : null}
                <ul className="admin-inventory-listing__specs">
                  <li className="admin-inventory-listing__spec">
                    <IconAdminPin />
                    <span>{formatAdminLocation(v)}</span>
                  </li>
                  <li className="admin-inventory-listing__spec">
                    <IconAdminOdometer />
                    <span>{formatSaleOdometer(itemKm(v))}</span>
                  </li>
                  <li className="admin-inventory-listing__spec">
                    <IconAdminFuel />
                    <span>{v.fuel ? String(v.fuel) : '—'}</span>
                  </li>
                  <li className="admin-inventory-listing__spec">
                    <IconAdminTransmission />
                    <span>{v.transmission ? String(v.transmission) : '—'}</span>
                  </li>
                  <li className="admin-inventory-listing__spec">
                    <IconAdminEngine />
                    <span>{formatAdminEngineCc(v)}</span>
                  </li>
                </ul>
                <p className="admin-inventory-listing__asking-line">
                  Asking price {formatSalePrice(itemPrice(v))}
                </p>
                <p className="admin-inventory-listing__disclaimer">Includes on road costs</p>
                <div
                  className="admin-inventory-listing__actions"
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <Link
                    to={`/admin/cars/${encodeURIComponent(cardCarId)}/edit`}
                    state={{ fromDetail: v }}
                    className="fleet-categories__btn admin-inventory-listing__action-btn admin-inventory-listing__btn-update"
                  >
                    Update
                  </Link>
                  <button
                    type="button"
                    className="fleet-categories__btn admin-inventory-listing__btn-delete"
                    disabled={deletingCarId === cardCarId}
                    onClick={() => handleDeleteCard(v)}
                  >
                    {deletingCarId === cardCarId ? '删除中…' : 'Delete'}
                  </button>
                </div>
              </div>
            </li>
            )
          })}
        </ul>

        {!loading && filtered.length === 0 && inventoryItems.length === 0 ? (
          <p className="sale-empty">暂无车辆数据，请点击「刷新列表」或检查 API / CORS。</p>
        ) : null}

        {!loading && filtered.length === 0 && inventoryItems.length > 0 ? (
          <p className="sale-empty">
            没有匹配筛选的车辆，请放宽条件或
            <button type="button" className="sale-empty__reset" onClick={handleReset}>
              reset all
            </button>
            。
          </p>
        ) : null}
      </div>
    </div>
  )
}
