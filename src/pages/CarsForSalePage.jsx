import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageHeroBanner from '../components/PageHeroBanner'
import { roadHero } from '../data/pageHeros'
import {
  formatSaleOdometer,
  formatSalePrice,
  KM_MAX_OPTIONS,
  KM_MIN_OPTIONS,
  PRICE_MAX_OPTIONS,
  PRICE_OPTIONS,
  SALE_BODY_TYPES,
  SALE_MAKE_OPTIONS,
  SALE_VEHICLES,
  saleModelOptionsForMakes,
  YEAR_MAX_OPTIONS,
  YEAR_MIN_OPTIONS,
} from '../data/carsForSale'
import { NZDCR_BRANCHES } from '../data/branchLocations'

const FUEL_VALUES = ['Petrol', 'Diesel', 'Hybrid']

function toggleInList(list, value) {
  return list.includes(value) ? list.filter((x) => x !== value) : [...list, value]
}

function vehicleMatches(f, v) {
  const kw = f.keyword.trim().toLowerCase()
  if (kw) {
    const blob = `${v.title} ${v.make} ${v.model}`.toLowerCase()
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
  if (f.priceMin) {
    const min = Number(f.priceMin)
    if (Number.isFinite(min) && v.price < min) return false
  }
  if (f.priceMax) {
    const max = Number(f.priceMax)
    if (Number.isFinite(max) && v.price > max) return false
  }
  if (f.yearMin) {
    const y = Number(f.yearMin)
    if (Number.isFinite(y) && v.year < y) return false
  }
  if (f.yearMax) {
    const y = Number(f.yearMax)
    if (Number.isFinite(y) && v.year > y) return false
  }
  if (f.kmMin) {
    const min = Number(f.kmMin)
    if (Number.isFinite(min) && v.km < min) return false
  }
  if (f.kmMax) {
    const max = Number(f.kmMax)
    if (Number.isFinite(max) && v.km > max) return false
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
const LOCATION_OPTIONS = NZDCR_BRANCHES.map((b) => ({ value: b.key, label: b.title }))
const LOCATION_LABEL = Object.fromEntries(NZDCR_BRANCHES.map((b) => [b.key, b.title]))

function SaleMultiSelect({
  dropdownKey,
  openKey,
  onOpenKeyChange,
  label,
  placeholder,
  options,
  selected,
  onToggle,
  onClear,
}) {
  const open = openKey === dropdownKey
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onOpenKeyChange(null)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenKeyChange(null)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenKeyChange])

  const summary = useMemo(() => {
    if (selected.length === 0) return placeholder
    const labels = selected
      .map((v) => options.find((o) => o.value === v)?.label ?? v)
      .filter(Boolean)
    if (labels.length <= 2) return labels.join(', ')
    return `${selected.length} selected`
  }, [selected, options, placeholder])

  const labelId = `sale-ms-${dropdownKey}-label`

  return (
    <div className={`sale-field sale-ms ${open ? 'is-open' : ''}`}>
      <span className="sale-field__label" id={labelId}>
        {label}
      </span>
      <div className="sale-ms__control" ref={rootRef}>
        <button
          type="button"
          className="sale-ms__trigger sale-field__input"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-labelledby={labelId}
          onClick={() => onOpenKeyChange(open ? null : dropdownKey)}
        >
          <span className="sale-ms__value">{summary}</span>
          <span className="sale-ms__chev" aria-hidden />
        </button>
        {open ? (
          <div className="sale-ms__panel" role="listbox" aria-multiselectable="true">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="sale-ms__option"
                role="option"
                aria-selected={selected.includes(opt.value)}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(opt.value)}
                  onChange={() => onToggle(opt.value)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
            {onClear && selected.length > 0 ? (
              <div className="sale-ms__footer">
                <button type="button" className="sale-ms__clear" onClick={() => onClear()}>
                  Clear
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}

function SaleRangePill({
  dropdownKey,
  openKey,
  onOpenKeyChange,
  title,
  summaryPrefix,
  fromOptions,
  toOptions,
  fromValue,
  toValue,
  onFromChange,
  onToChange,
  onClear,
}) {
  const open = openKey === dropdownKey
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) onOpenKeyChange(null)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') onOpenKeyChange(null)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onOpenKeyChange])

  const rangeSummary = useMemo(() => {
    if (!fromValue && !toValue) return 'Any'
    const fl = fromValue ? (fromOptions.find((o) => o.value === fromValue)?.label ?? fromValue) : 'Any'
    const tl = toValue ? (toOptions.find((o) => o.value === toValue)?.label ?? toValue) : 'Any'
    return `${fl} – ${tl}`
  }, [fromValue, toValue, fromOptions, toOptions])

  const ariaLabel = `${summaryPrefix}: ${rangeSummary}`

  return (
    <div className={`sale-pill-wrap ${open ? 'is-open' : ''}`} ref={rootRef}>
      <button
        type="button"
        className="sale-pill"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        onClick={() => onOpenKeyChange(open ? null : dropdownKey)}
      >
        <span className="sale-pill__text">{rangeSummary}</span>
        <span className="sale-pill__chev" aria-hidden />
      </button>
      {open ? (
        <div className="sale-pill-panel" role="dialog" aria-label={title}>
          <div className="sale-pill-panel__title">{title}</div>
          <div className="sale-pill-panel__range">
            <label className="sale-pill-panel__field">
              <span className="sale-pill-panel__sublabel">From</span>
              <select
                className="sale-field__input"
                value={fromValue}
                onChange={(e) => onFromChange(e.target.value)}
              >
                {fromOptions.map(({ value, label }) => (
                  <option key={`${value}-${label}`} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <span className="sale-pill-panel__dash" aria-hidden>
              —
            </span>
            <label className="sale-pill-panel__field">
              <span className="sale-pill-panel__sublabel">To</span>
              <select
                className="sale-field__input"
                value={toValue}
                onChange={(e) => onToChange(e.target.value)}
              >
                {toOptions.map(({ value, label }) => (
                  <option key={`${value}-${label}`} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="button" className="sale-pill-panel__clear" onClick={() => onClear()}>
            Clear
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default function CarsForSalePage() {
  const [filters, setFilters] = useState(initialFilters)
  const [openPicker, setOpenPicker] = useState(null)

  const modelOptions = useMemo(() => saleModelOptionsForMakes(filters.makes), [filters.makes])

  useEffect(() => {
    setFilters((prev) => {
      const valid = new Set(saleModelOptionsForMakes(prev.makes).map((o) => o.value))
      const models = prev.models.filter((k) => valid.has(k))
      if (models.length === prev.models.length) return prev
      return { ...prev, models }
    })
  }, [filters.makes])

  const filtered = useMemo(() => SALE_VEHICLES.filter((v) => vehicleMatches(filters, v)), [filters])

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

  return (
    <>
      <PageHeroBanner {...roadHero('CARS FOR SALE', 'Cars for Sale')} />
      <div className="sale-page">
        <div className="container">
          <p className="sale-page__intro">
            Quality used vehicles at competitive prices — search by body type, budget, and more.
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
                placeholder={modelOptions.length ? 'Any model' : 'No models in stock'}
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
                Showing <strong>{filtered.length}</strong> of {SALE_VEHICLES.length} vehicles — filters apply
                instantly.
              </p>
            </div>
          </section>

          <ul className="sale-results">
            {filtered.map((v) => (
              <li key={v.slug} className="sale-card">
                <Link className="sale-card__link" to={`/cars-for-sale/${v.slug}/`}>
                  <div className="sale-card__media">
                    <img
                      src={v.image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      width={640}
                      height={400}
                    />
                  </div>
                  <div className="sale-card__body">
                    <h3 className="sale-card__title">{v.title}</h3>
                    <p className="sale-card__price">{formatSalePrice(v.price)}*</p>
                    <p className="sale-card__meta">
                      {LOCATION_LABEL[v.location] ?? v.location} · {formatSaleOdometer(v.km)},{' '}
                      {v.transmission}, {v.engineCc}cc, {v.fuel}
                    </p>
                    <span className="sale-card__view">View details</span>
                  </div>
                </Link>
                <div className="sale-card__actions">
                  <a href="tel:080017951795" className="sale-btn sale-btn--primary">
                    Call to enquire
                  </a>
                  <a
                    href="mailto:booking@nzdcr.co.nz?subject=Cars%20for%20sale%20enquiry"
                    className="sale-btn sale-btn--ghost"
                  >
                    Email us
                  </a>
                </div>
              </li>
            ))}
          </ul>

          {filtered.length === 0 ? (
            <p className="sale-empty">
              No vehicles match those filters. Try widening your search or{' '}
              <button type="button" className="sale-empty__reset" onClick={handleReset}>
                reset all
              </button>
              .
            </p>
          ) : null}
        </div>
      </div>
    </>
  )
}
