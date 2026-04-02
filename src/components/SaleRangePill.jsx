import { useEffect, useMemo, useRef } from 'react'

export default function SaleRangePill({
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
