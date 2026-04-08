import { useCallback, useEffect, useState } from 'react'

function ChevronLeft() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 7l-5 5 5 5" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 7l5 5-5 5" />
    </svg>
  )
}

/**
 * 全屏图片轮播（在售车详情 / 列表卡片共用）
 * @param {object} props
 * @param {string[]} props.images
 * @param {boolean} props.isOpen
 * @param {number} [props.startIndex]
 * @param {() => void} props.onClose
 * @param {(index: number) => void} [props.onNavigate] — 在画廊内切换时回调（用于同步列表卡片小图索引）
 */
export default function SaleImageGalleryOverlay({ images, isOpen, startIndex = 0, onClose, onNavigate }) {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    if (!isOpen || !images.length) return
    const c = Math.min(Math.max(0, startIndex), images.length - 1)
    setIdx(c)
  }, [isOpen, startIndex, images.length])

  const goPrev = useCallback(() => {
    if (images.length <= 1) return
    setIdx((i) => {
      const n = i <= 0 ? images.length - 1 : i - 1
      onNavigate?.(n)
      return n
    })
  }, [images.length, onNavigate])

  const goNext = useCallback(() => {
    if (images.length <= 1) return
    setIdx((i) => {
      const n = i >= images.length - 1 ? 0 : i + 1
      onNavigate?.(n)
      return n
    })
  }, [images.length, onNavigate])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose, goPrev, goNext])

  if (!isOpen || !images.length) return null

  const activeSrc = images[idx] || ''

  return (
    <div className="sale-detail-gallery" role="presentation">
      <button type="button" className="sale-detail-gallery__backdrop" aria-label="Close gallery" onClick={onClose} />
      <div className="sale-detail-gallery__content" role="dialog" aria-modal="true" aria-label="Vehicle photos">
        <button type="button" className="sale-detail-gallery__close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {images.length > 1 ? (
          <>
            <button type="button" className="sale-detail-gallery__nav sale-detail-gallery__nav--prev" onClick={goPrev} aria-label="Previous photo">
              <ChevronLeft />
            </button>
            <button type="button" className="sale-detail-gallery__nav sale-detail-gallery__nav--next" onClick={goNext} aria-label="Next photo">
              <ChevronRight />
            </button>
          </>
        ) : null}
        <div className="sale-detail-gallery__stage">
          {activeSrc ? <img src={activeSrc} alt="" className="sale-detail-gallery__img" /> : null}
        </div>
        {images.length > 1 ? (
          <p className="sale-detail-gallery__count">
            {idx + 1} / {images.length}
          </p>
        ) : null}
      </div>
    </div>
  )
}
