import { useCallback, useMemo, useState } from 'react'

function dedupeUrls(list) {
  const seen = new Set()
  const out = []
  for (const u of list || []) {
    const s = String(u || '').trim()
    if (!s || seen.has(s)) continue
    seen.add(s)
    out.push(s)
  }
  return out
}

function fallbackThumb(v) {
  if (v.thumbnail && String(v.thumbnail).trim()) return String(v.thumbnail).trim()
  const c = v.coverImages
  if (Array.isArray(c) && c.length && typeof c[0] === 'string' && c[0].trim()) return c[0].trim()
  return ''
}

/** 轮播顺序：优先 API 的 images，否则 cover + gallery；仍无则 thumbnail */
function allSlidesFor(v) {
  if (Array.isArray(v.images) && v.images.length) return dedupeUrls(v.images)
  const merged = dedupeUrls([...(v.coverImages || []), ...(v.galleryImages || [])])
  if (merged.length) return merged
  const t = fallbackThumb(v)
  return t ? [t] : []
}

/** 三联封面：coverImages[0..2]，不足则第一张用 thumbnail 兜底，其余空栅格 */
function mosaicSlotsFor(v) {
  const thumb = fallbackThumb(v)
  const raw = (v.coverImages || []).map((u) => String(u || '').trim()).filter(Boolean)
  return [0, 1, 2].map((i) => raw[i] || (i === 0 ? thumb : '') || '')
}

function ChevronPrev() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 7l-5 5 5 5" />
    </svg>
  )
}

function ChevronNext() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M10 7l5 5-5 5" />
    </svg>
  )
}

/**
 * 管理端列表头图：默认左大右双（三张封面），左右箭头进入全宽轮播（images 全量逐张）。
 */
export default function AdminInventoryCarMedia({ vehicle }) {
  const allSlides = useMemo(() => allSlidesFor(vehicle), [vehicle])
  const mosaicSlots = useMemo(() => mosaicSlotsFor(vehicle), [vehicle])
  const [mode, setMode] = useState('mosaic')
  const [slideIdx, setSlideIdx] = useState(0)

  const openHref = useMemo(() => {
    if (mode === 'carousel' && allSlides[slideIdx]) return allSlides[slideIdx]
    return mosaicSlots[0] || mosaicSlots[1] || mosaicSlots[2] || allSlides[0] || ''
  }, [mode, slideIdx, allSlides, mosaicSlots])

  const goPrev = useCallback(() => {
    if (mode === 'mosaic') return
    if (slideIdx <= 0) {
      setMode('mosaic')
      return
    }
    setSlideIdx((i) => i - 1)
  }, [mode, slideIdx])

  const goNext = useCallback(() => {
    if (allSlides.length === 0) return
    if (mode === 'mosaic') {
      setMode('carousel')
      setSlideIdx(0)
      return
    }
    if (slideIdx < allSlides.length - 1) setSlideIdx((i) => i + 1)
  }, [mode, slideIdx, allSlides.length])

  const showPrev = mode === 'carousel'
  const showNext = allSlides.length > 0 && (mode === 'mosaic' || slideIdx < allSlides.length - 1)

  const hasAnyVisual = mosaicSlots.some(Boolean) || allSlides.length > 0
  if (!hasAnyVisual) {
    return <div className="admin-inventory-card__noimg admin-inventory-listing__noimg">No image</div>
  }

  return (
    <div className="admin-inv-media">
      {mode === 'mosaic' ? (
        <div className="admin-inv-media__mosaic" aria-hidden={!mosaicSlots.some(Boolean)}>
          <div className="admin-inv-media__cell admin-inv-media__cell--main">
            {mosaicSlots[0] ? (
              <img src={mosaicSlots[0]} alt="" loading="lazy" decoding="async" />
            ) : (
              <span className="admin-inv-media__ph" />
            )}
          </div>
          <div className="admin-inv-media__cell admin-inv-media__cell--tr">
            {mosaicSlots[1] ? <img src={mosaicSlots[1]} alt="" loading="lazy" decoding="async" /> : <span className="admin-inv-media__ph" />}
          </div>
          <div className="admin-inv-media__cell admin-inv-media__cell--br">
            {mosaicSlots[2] ? <img src={mosaicSlots[2]} alt="" loading="lazy" decoding="async" /> : <span className="admin-inv-media__ph" />}
          </div>
        </div>
      ) : (
        <div className="admin-inv-media__carousel">
          {allSlides[slideIdx] ? (
            <img src={allSlides[slideIdx]} alt="" loading="lazy" decoding="async" />
          ) : null}
        </div>
      )}

      {allSlides.length > 0 ? (
        <>
          {showPrev ? (
            <button type="button" className="admin-inv-media__nav admin-inv-media__nav--prev" onClick={goPrev} aria-label="上一张或返回拼图">
              <ChevronPrev />
            </button>
          ) : null}
          {showNext ? (
            <button
              type="button"
              className="admin-inv-media__nav admin-inv-media__nav--next"
              onClick={goNext}
              disabled={mode === 'carousel' && slideIdx >= allSlides.length - 1}
              aria-label={mode === 'mosaic' ? '逐张浏览全部图片' : '下一张'}
            >
              <ChevronNext />
            </button>
          ) : null}
        </>
      ) : null}

      {openHref ? (
        <a
          className="admin-inv-media__open"
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在新标签打开当前显示的图片"
        >
          打开原图
        </a>
      ) : null}
    </div>
  )
}
