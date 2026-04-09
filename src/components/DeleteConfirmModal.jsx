import { useEffect } from 'react'

/**
 * 居中确认删除弹窗（替代 window.confirm）
 * @param {object} props
 * @param {boolean} props.open
 * @param {string} props.vehicleLabel — 展示用标题/车名
 * @param {() => void} props.onCancel
 * @param {() => void | Promise<void>} props.onConfirm
 * @param {boolean} [props.isDeleting]
 */
export default function DeleteConfirmModal({ open, vehicleLabel, onCancel, onConfirm, isDeleting }) {
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open || isDeleting) return
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, isDeleting, onCancel])

  if (!open) return null

  return (
    <div className="confirm-modal" role="presentation">
      <div className="confirm-modal__backdrop" aria-hidden onClick={isDeleting ? undefined : onCancel} />
      <div
        className="confirm-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-delete-title"
      >
        <h2 id="confirm-modal-delete-title" className="confirm-modal__title">
          确认删除
        </h2>
        <p className="confirm-modal__message">
          确定要删除「<strong>{vehicleLabel}</strong>」吗？此操作不可恢复。
        </p>
        <div className="confirm-modal__actions">
          <button type="button" className="confirm-modal__btn confirm-modal__btn--ghost" onClick={onCancel} disabled={isDeleting}>
            取消
          </button>
          <button type="button" className="confirm-modal__btn confirm-modal__btn--danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? '删除中…' : '删除'}
          </button>
        </div>
      </div>
    </div>
  )
}
