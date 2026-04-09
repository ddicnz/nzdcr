import { useEffect } from 'react'

/**
 * 屏幕居中成功提示弹窗
 * @param {object} props
 * @param {boolean} props.open
 * @param {string} props.title
 * @param {import('react').ReactNode} props.children
 * @param {() => void} props.onClose
 * @param {string} [props.buttonLabel]
 */
export default function SuccessCenterModal({ open, title, children, onClose, buttonLabel = '确定' }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="confirm-modal" role="presentation">
      <div className="confirm-modal__backdrop" aria-hidden onClick={onClose} />
      <div
        className="confirm-modal__panel confirm-modal__panel--success"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="success-center-modal-title"
      >
        <h2 id="success-center-modal-title" className="confirm-modal__title">
          {title}
        </h2>
        <div className="confirm-modal__message confirm-modal__message--success">{children}</div>
        <div className="confirm-modal__actions confirm-modal__actions--single">
          <button type="button" className="confirm-modal__btn confirm-modal__btn--primary" onClick={onClose}>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
