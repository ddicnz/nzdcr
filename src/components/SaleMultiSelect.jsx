import { useEffect, useMemo, useRef } from 'react'

export default function SaleMultiSelect({
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
