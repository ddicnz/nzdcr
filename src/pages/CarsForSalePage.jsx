import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InventorySortBar from '../components/InventorySortBar'
import PageHeroBanner from '../components/PageHeroBanner'
import SaleListingCardMedia from '../components/SaleListingCardMedia'
import BranchContactModal from '../components/BranchContactModal'
import {
  IconAdminEngine,
  IconAdminFuel,
  IconAdminOdometer,
  IconAdminPin,
  IconAdminTransmission,
} from '../components/AdminListingSpecIcons'
import SaleMultiSelect from '../components/SaleMultiSelect'
import SaleRangePill from '../components/SaleRangePill'
import { roadHero } from '../data/pageHeros'
import { NZDCR_BRANCHES } from '../data/branchLocations'
import {
  fetchPublishedSaleInventory,
  formatSaleAdminLocation,
  formatSaleEngineCc,
  formatSaleListedLine,
  saleListingHeadline,
  saleModelOptionsFromInventory,
} from '../data/dynamoSaleCars'
import { sortInventoryList } from '../data/adminInventoryFilters'
import {
  formatSaleOdometer,
  formatSalePrice,
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
const PAGE_SIZE = 10

const LOCATION_OPTIONS = NZDCR_BRANCHES.map((b) => ({ value: b.key, label: b.title }))

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
}

function vehicleMatches(f, v) {
  const kw = f.keyword.trim().toLowerCase()
  if (kw) {
    const blob = `${v.title ?? ''} ${v.make ?? ''} ${v.model ?? ''} ${v.slug ?? ''} ${v.description ?? ''}`
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
  if (f.locations.length && !f.locations.includes(v.locationKey)) return false
  const price = v.price
  const year = v.year
  const km = v.km

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
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  kmMin: '',
  kmMax: '',
}

const MAKE_CHECKBOXES = SALE_MAKE_OPTIONS.filter((o) => o.value)
const BODY_OPTIONS = SALE_BODY_TYPES.map((bt) => ({ value: bt, label: bt }))
const FUEL_OPTIONS = FUEL_VALUES.map((f) => ({ value: f, label: f }))

export default function CarsForSalePage() {
  const navigate = useNavigate()
  const [inventoryItems, setInventoryItems] = useState([])
  const [inventoryLoading, setInventoryLoading] = useState(true)
  const [inventoryError, setInventoryError] = useState(null)
  const [filters, setFilters] = useState(initialFilters)
  const [openPicker, setOpenPicker] = useState(null)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('default')
  const [contactBranchKey, setContactBranchKey] = useState(null)

  const loadInventory = useCallback(async () => {
    setInventoryLoading(true)
    setInventoryError(null)
    try {
      const items = await fetchPublishedSaleInventory()
      setInventoryItems(items)
    } catch (e) {
      setInventoryError(e instanceof Error ? e.message : '加载失败')
      setInventoryItems([])
    } finally {
      setInventoryLoading(false)
    }
  }, [])

  useEffect(() => {
    loadInventory()
  }, [loadInventory])

  const modelOptions = useMemo(
    () => saleModelOptionsFromInventory(inventoryItems, filters.makes),
    [inventoryItems, filters.makes],
  )

  useEffect(() => {
    setFilters((prev) => {
      const valid = new Set(saleModelOptionsFromInventory(inventoryItems, prev.makes).map((o) => o.value))
      const models = prev.models.filter((k) => valid.has(k))
      if (models.length === prev.models.length) return prev
      return { ...prev, models }
    })
  }, [inventoryItems, filters.makes])

  const filtered = useMemo(
    () => inventoryItems.filter((v) => vehicleMatches(filters, v)),
    [inventoryItems, filters],
  )

  const sortedFiltered = useMemo(() => sortInventoryList(filtered, sortBy), [filtered, sortBy])

  const filterKey = useMemo(() => JSON.stringify(filters), [filters])
  useEffect(() => {
    setPage(1)
  }, [filterKey, sortBy])

  const totalPages = Math.max(1, Math.ceil(sortedFiltered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageSlice = useMemo(
    () => sortedFiltered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [sortedFiltered, safePage],
  )

  const setField = (key) => (e) => {
    setFilters((prev) => ({ ...prev, [key]: e.target.value }))
  }

  const toggleFilterList = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: toggleInList(prev[key], value) }))
  }

  const clearBodyTypes = () => {
    setFilters((prev) => ({ ...prev, bodyTypes: [] }))
  }

  const handleReset = () => {
    setOpenPicker(null)
    setFilters(initialFilters)
  }

  const scrollToTop = () => {
    document.getElementById('cars-for-sale-top')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHeroBanner {...roadHero('CARS FOR SALE', 'Cars for Sale')} />
      <div className="sale-page" id="cars-for-sale-top">
        <div className="container">
          <p className="sale-page__intro">
            Quality used vehicles from our branches — search by body type, budget, and location. Listings are loaded
            from our live inventory (published only).
            <strong> Enquire</strong> on any listing — we&apos;re happy to help with finance and trade-ins.
          </p>

          <section className="sale-quick" aria-label="Quick filter by body type">
            <h2 className="sale-quick__title">Browse by body type</h2>
            <div className="fleet-categories sale-quick__fleet">
              <button
                type="button"
                className={`fleet-categories__btn ${filters.bodyTypes.length === 0 ? 'is-active' : ''}`}
                onClick={clearBodyTypes}
              >
                All
              </button>
              {SALE_BODY_TYPES.map((bt) => (
                <button
                  key={bt}
                  type="button"
                  className={`fleet-categories__btn ${filters.bodyTypes.includes(bt) ? 'is-active' : ''}`}
                  onClick={() => toggleFilterList('bodyTypes', bt)}
                >
                  {bt}
                </button>
              ))}
            </div>
          </section>

          <section className="sale-search" aria-label="Search vehicles">
            <h2 className="sale-search__title">Find a vehicle</h2>

            <div className="sale-search__block sale-search__block--row1">
              <label className="sale-field sale-field--keyword">
                <span className="sale-field__label">Keyword</span>
                <input
                  type="search"
                  className="sale-field__input"
                  placeholder="Make, model, or keyword…"
                  value={filters.keyword}
                  onChange={setField('keyword')}
                  autoComplete="off"
                />
              </label>

              <SaleMultiSelect
                dropdownKey="make"
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
                dropdownKey="model"
                openKey={openPicker}
                onOpenKeyChange={setOpenPicker}
                label="Model"
                placeholder={modelOptions.length ? 'Any model' : inventoryLoading ? 'Loading…' : 'No models in stock'}
                options={modelOptions}
                selected={filters.models}
                onToggle={(v) => toggleFilterList('models', v)}
                onClear={() => setFilters((p) => ({ ...p, models: [] }))}
              />

              <SaleMultiSelect
                dropdownKey="body"
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
                dropdownKey="location"
                openKey={openPicker}
                onOpenKeyChange={setOpenPicker}
                label="Location"
                placeholder="Any location"
                options={LOCATION_OPTIONS}
                selected={filters.locations}
                onToggle={(v) => toggleFilterList('locations', v)}
                onClear={() => setFilters((p) => ({ ...p, locations: [] }))}
              />
            </div>

            <div className="sale-search__row-pills">
              <div className="sale-field sale-field--range-block">
                <span className="sale-field__label">Year</span>
                <SaleRangePill
                  dropdownKey="yearRange"
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
                  dropdownKey="priceRange"
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
                  dropdownKey="kmRange"
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
                  dropdownKey="fuel"
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
                Filters apply instantly. Total in stock: <strong>{inventoryItems.length}</strong>.
                {inventoryLoading ? ' Loading inventory…' : null}
              </p>
            </div>
          </section>

          <InventorySortBar count={filtered.length} sortBy={sortBy} onSortChange={setSortBy} />

          {inventoryError ? (
            <p className="addcar-page__alert addcar-page__alert--error" role="alert">
              {inventoryError}{' '}
              <button type="button" className="sale-empty__reset" onClick={loadInventory}>
                Retry
              </button>
            </p>
          ) : null}

          <ul className="sale-results admin-inventory-page__results">
            {pageSlice.map((v) => {
              const slug = String(v.slug || '').trim()
              const mailSubject = encodeURIComponent(`Cars for sale: ${v.title || slug}`)
              const mailHref = `mailto:booking@nzdcr.co.nz?subject=${mailSubject}`
              return (
                <li
                  key={slug}
                  className="admin-inventory-listing admin-inventory-listing--clickable"
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/cars-for-sale/${encodeURIComponent(slug)}/`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/cars-for-sale/${encodeURIComponent(slug)}/`)
                    }
                  }}
                >
                  <div className="admin-inventory-listing__media">
                    <SaleListingCardMedia vehicle={v} />
                  </div>
                  <div className="admin-inventory-listing__body">
                    <p className="admin-inventory-listing__listed">{formatSaleListedLine(v)}</p>
                    <h3 className="admin-inventory-listing__title">{saleListingHeadline(v)}</h3>
                    {String(v.description ?? '').trim() ? (
                      <p className="admin-inventory-listing__desc">{String(v.description).trim()}</p>
                    ) : null}
                    <ul className="admin-inventory-listing__specs">
                      <li className="admin-inventory-listing__spec">
                        <IconAdminPin />
                        <span>{formatSaleAdminLocation(v)}</span>
                      </li>
                      <li className="admin-inventory-listing__spec">
                        <IconAdminOdometer />
                        <span>{formatSaleOdometer(v.km)}</span>
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
                        <span>{formatSaleEngineCc(v)}</span>
                      </li>
                    </ul>
                    <p className="admin-inventory-listing__asking-line">
                      Asking price {formatSalePrice(v.price)}
                    </p>
                    <p className="admin-inventory-listing__disclaimer">Includes on road costs</p>
                    <p className="sale-card__view sale-card__view--in-grid">View details</p>
                    <div
                      className="admin-inventory-listing__actions"
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        className="fleet-categories__btn admin-inventory-listing__action-btn admin-inventory-listing__btn-update"
                        onClick={() => setContactBranchKey(v.locationKey)}
                      >
                        Contact details
                      </button>
                      <a
                        href={mailHref}
                        className="fleet-categories__btn admin-inventory-listing__action-btn admin-form-cancel-link"
                      >
                        Email us
                      </a>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>

          {!inventoryLoading && filtered.length === 0 && !inventoryError ? (
            <p className="sale-empty">
              No vehicles match those filters. Try widening your search or{' '}
              <button type="button" className="sale-empty__reset" onClick={handleReset}>
                reset all
              </button>
              .
            </p>
          ) : null}

          {!inventoryLoading && inventoryItems.length === 0 && !inventoryError ? (
            <p className="sale-empty">No published vehicles in stock right now. Please check back later.</p>
          ) : null}

          {totalPages > 1 && sortedFiltered.length > 0 ? (
            <nav className="sale-pagination" aria-label="Page navigation">
              <button
                type="button"
                className="sale-pagination__btn"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              {totalPages <= 12 ? (
                Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`sale-pagination__btn ${num === safePage ? 'sale-pagination__btn--active' : ''}`}
                    onClick={() => setPage(num)}
                  >
                    {num}
                  </button>
                ))
              ) : (
                <span className="sale-pagination__ellipsis" style={{ padding: '0 0.5rem', fontWeight: 700 }}>
                  Page {safePage} of {totalPages}
                </span>
              )}
              <button
                type="button"
                className="sale-pagination__btn"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </nav>
          ) : null}

          {sortedFiltered.length > 0 ? (
            <div className="sale-back-to-top-wrap">
              <button type="button" className="sale-back-to-top" onClick={scrollToTop}>
                Back to top
              </button>
            </div>
          ) : null}

          {contactBranchKey ? (
            <BranchContactModal branchKey={contactBranchKey} onClose={() => setContactBranchKey(null)} />
          ) : null}
        </div>
      </div>
    </>
  )
}
