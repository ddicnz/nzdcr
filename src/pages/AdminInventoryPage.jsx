import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminInventoryCarMedia from '../components/AdminInventoryCarMedia'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import InventorySortBar from '../components/InventorySortBar'
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
  deleteAdminCar,
  GET_ADMIN_CARS_API,
} from '../data/adminCarApi'
import {
  adminInventoryMatches,
  BODY_OPTIONS,
  DEFAULT_LOCATIONS,
  FUEL_OPTIONS,
  initialAdminInventoryFilters,
  itemKm,
  itemPrice,
  itemYear,
  KM_MAX_OPTIONS,
  KM_MIN_OPTIONS,
  MAKE_CHECKBOXES,
  PRICE_MAX_OPTIONS,
  PRICE_OPTIONS,
  sortInventoryList,
  STATUS_OPTIONS,
  toggleInList,
  YEAR_MAX_OPTIONS,
  YEAR_MIN_OPTIONS,
} from '../data/adminInventoryFilters'
import { formatSaleOdometer, formatSalePrice } from '../data/carsForSale'

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

const initialFilters = initialAdminInventoryFilters

export default function AdminInventoryPage() {
  const navigate = useNavigate()
  const [inventoryItems, setInventoryItems] = useState([])
  const [loadedAt, setLoadedAt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [openPicker, setOpenPicker] = useState(null)
  const [deletingCarId, setDeletingCarId] = useState(null)
  const [deletePending, setDeletePending] = useState(null)
  const [sortBy, setSortBy] = useState('default')

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

  const sortedFiltered = useMemo(() => sortInventoryList(filtered, sortBy), [filtered, sortBy])

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

  const handleDeleteConfirm = async () => {
    const v = deletePending
    if (!v) return
    const id = String(v.carId ?? '').trim()
    if (!id) return

    setDeletingCarId(id)
    try {
      await deleteAdminCar(id)
      clearAdminCarDetailCache(id)
      setInventoryItems((prev) => prev.filter((x) => String(x.carId) !== id))
      setDeletePending(null)
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

        <div className="admin-inventory-page__toolbar">
          <button type="button" className="fleet-categories__btn" onClick={loadInventory} disabled={loading}>
            {loading ? 'Loading…' : 'Refresh list'}
          </button>
          {loadedAt ? (
            <span className="admin-inventory-page__loaded">
              Cached <strong>{inventoryItems.length}</strong> vehicles · Last loaded{' '}
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
              Filters apply instantly. Total in cache: <strong>{inventoryItems.length}</strong>.
            </p>
          </div>
        </section>

        <InventorySortBar count={filtered.length} sortBy={sortBy} onSortChange={setSortBy} />

        <ul className="sale-results admin-inventory-page__results">
          {sortedFiltered.map((v) => {
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
                    onClick={() => setDeletePending(v)}
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
          <p className="sale-empty">No vehicle data — click &quot;Refresh list&quot; or check API / CORS.</p>
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

        <DeleteConfirmModal
          open={!!deletePending}
          vehicleLabel={deletePending ? listingHeadline(deletePending) : ''}
          onCancel={() => setDeletePending(null)}
          onConfirm={handleDeleteConfirm}
          isDeleting={
            !!deletePending &&
            !!deletingCarId &&
            deletingCarId === String(deletePending.carId ?? '').trim()
          }
        />
      </div>
    </div>
  )
}
