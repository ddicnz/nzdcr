import { useEffect, useMemo } from 'react'
import { NZDCR_SALES_FREE_PHONE, branchByLocationKeyOrDefault } from '../data/branchLocations'

/** Google Maps 嵌入（按门店坐标，无需前端 Maps JS Key） */
function googleMapsEmbedSrc(branch) {
  const [lat, lng] = branch.position
  return `https://www.google.com/maps?q=${lat},${lng}&z=16&hl=en&output=embed`
}

export default function BranchContactModal({ branchKey, onClose }) {
  const branch = branchByLocationKeyOrDefault(branchKey)
  const mapSrc = useMemo(() => googleMapsEmbedSrc(branch), [branch])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="branch-contact-modal" role="presentation">
      <div className="branch-contact-modal__backdrop" aria-hidden onClick={onClose} />
      <div
        className="branch-contact-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="branch-contact-modal-title"
      >
        <div className="branch-contact-modal__head">
          <h2 id="branch-contact-modal-title" className="branch-contact-modal__title">
            Contact details — {branch.title}
          </h2>
          <button type="button" className="branch-contact-modal__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="branch-contact-modal__map">
          <iframe
            key={branch.key}
            title={`${branch.title} on Google Maps`}
            className="branch-contact-modal__map-frame"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <div className="branch-contact-modal__body">
          <p className="branch-contact-modal__address">{branch.address}</p>
          <p className="branch-contact-modal__phone-row">
            <span className="branch-contact-modal__phone-label">{branch.title}</span>
            <a href={branch.phoneLocal.href} className="branch-contact-modal__phone-link">
              {branch.phoneLocal.label}
            </a>
          </p>
          <p className="branch-contact-modal__phone-row">
            <span className="branch-contact-modal__phone-label">All branches</span>
            <a href={NZDCR_SALES_FREE_PHONE.href} className="branch-contact-modal__phone-link">
              {NZDCR_SALES_FREE_PHONE.label}
            </a>
          </p>
          <p className="branch-contact-modal__maps-link">
            <a href={branch.googleUrl} target="_blank" rel="noopener noreferrer">
              Open in Google Maps
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
