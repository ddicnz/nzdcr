import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import DeleteConfirmModal from '../components/DeleteConfirmModal'
import InventorySortBar from '../components/InventorySortBar'
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
import { formatSalePrice } from '../data/carsForSale'

const initialFilters = initialAdminInventoryFilters

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

export default function AdminQuickLookPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadedAt, setLoadedAt] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [openPicker, setOpenPicker] = useState(null)
  const [deletingCarId, setDeletingCarId] = useState(null)
  const [deletePending, setDeletePending] = useState(null)
  const [sortBy, setSortBy] = useState('default')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(GET_ADMIN_CARS_API)
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        throw new Error(data.message || data.error || `加载失败（${res.status}）`)
      }
      const list = Array.isArray(data.items) ? data.items : []
      setItems(list)
      setLoadedAt(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const locationOptions = useMemo(() => {
    const set = new Set(DEFAULT_LOCATIONS)
    for (const it of items) {
      if (it.location) set.add(it.location)
    }
    return [...set].sort().map((loc) => ({ value: loc, label: loc }))
  }, [items])

  const modelOptions = useMemo(
    () => adminModelOptionsFromItems(items, filters.makes),
    [items, filters.makes],
  )

  useEffect(() => {
    setFilters((prev) => {
      const valid = new Set(adminModelOptionsFromItems(items, prev.makes).map((o) => o.value))
      const models = prev.models.filter((k) => valid.has(k))
      if (models.length === prev.models.length) return prev
      return { ...prev, models }
    })
  }, [items, filters.makes])

  const filtered = useMemo(() => items.filter((v) => adminInventoryMatches(filters, v)), [items, filters])

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
      setItems((prev) => prev.filter((x) => String(x.carId) !== id))
      setDeletePending(null)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : '删除失败')
    } finally {
      setDeletingCarId(null)
    }
  }

  return (
    <div className="sale-page admin-quick-look-page">
      <div className="container">
        <nav className="addcar-page__breadcrumb" aria-label="Breadcrumb">
          <Link to="/admin/">Admin</Link>
          <span aria-hidden> / </span>
          <Link to="/admin/cars/">All cars</Link>
          <span aria-hidden> / </span>
          <span className="admin-car-detail-page__crumb-current">Quick look</span>
        </nav>

        <p className="sale-page__intro">
          Text-only list — same inventory and filters as <strong>View all cars</strong>. Click a row for vehicle detail.
        </p>

        <div className="admin-inventory-page__toolbar">
          <button type="button" className="fleet-categories__btn" onClick={load} disabled={loading}>
            {loading ? '加载中…' : '刷新列表'}
          </button>
          {loadedAt ? (
            <span className="admin-inventory-page__loaded">
              <strong>{items.length}</strong> 条 · 上次加载 {loadedAt.toLocaleString('en-NZ')}
            </span>
          ) : null}
        </div>

        {error ? (
          <p className="addcar-page__alert addcar-page__alert--error" role="alert">
            {error}
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
              dropdownKey="ql-make"
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
              dropdownKey="ql-model"
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
              dropdownKey="ql-body"
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
              dropdownKey="ql-loc"
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
              dropdownKey="ql-status"
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
                dropdownKey="ql-year"
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
                dropdownKey="ql-price"
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
                dropdownKey="ql-km"
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
                dropdownKey="ql-fuel"
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
              Filters apply instantly. Total in cache: <strong>{items.length}</strong>.
            </p>
          </div>
        </section>

        <InventorySortBar count={filtered.length} sortBy={sortBy} onSortChange={setSortBy} />

        <ul className="admin-quick-look__list" aria-label="Vehicle list">
          {sortedFiltered
            .filter((v) => String(v.carId ?? '').trim())
            .map((v) => {
              const cardCarId = String(v.carId ?? '').trim()
              return (
                <li key={cardCarId} className="admin-quick-look__item">
                  <div className="admin-quick-look__row">
                    <Link
                      className="admin-quick-look__link"
                      to={`/admin/cars/${encodeURIComponent(cardCarId)}`}
                      state={{ fromList: v }}
                    >
                      <span className="admin-quick-look__headline">{listingHeadline(v)}</span>
                      <span className="admin-quick-look__price">{formatSalePrice(itemPrice(v))}</span>
                    </Link>
                    <div
                      className="admin-quick-look__actions admin-inventory-listing__actions"
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

        {!loading && filtered.length === 0 && items.length === 0 && !error ? (
          <p className="sale-empty">暂无车辆数据。</p>
        ) : null}

        {!loading && sortedFiltered.length === 0 && items.length > 0 ? (
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
