import { useMemo } from 'react'

function fallbackThumb(v) {
  if (v.thumbnail && String(v.thumbnail).trim()) return String(v.thumbnail).trim()
  const c = v.coverImages
  if (Array.isArray(c) && c.length && typeof c[0] === 'string' && c[0].trim()) return c[0].trim()
  return ''
}

/** 三联封面：coverImages[0..2]，不足则首张用 thumbnail 兜底 */
function mosaicSlotsFor(v) {
  const thumb = fallbackThumb(v)
  const raw = (v.coverImages || []).map((u) => String(u || '').trim()).filter(Boolean)
  return [0, 1, 2].map((i) => raw[i] || (i === 0 ? thumb : '') || '')
}

/**
 * 管理端列表：仅展示三张封面拼图（与 getadmincars 的 coverImages 一致），无轮播。
 */
export default function AdminInventoryCarMedia({ vehicle }) {
  const mosaicSlots = useMemo(() => mosaicSlotsFor(vehicle), [vehicle])
  const openHref = mosaicSlots[0] || mosaicSlots[1] || mosaicSlots[2] || ''

  if (!mosaicSlots.some(Boolean)) {
    return <div className="admin-inventory-card__noimg admin-inventory-listing__noimg">No image</div>
  }

  return (
    <div className="admin-inv-media">
      <div className="admin-inv-media__mosaic">
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

      {openHref ? (
        <a
          className="admin-inv-media__open"
          href={openHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="在新标签打开封面大图"
          onClick={(e) => e.stopPropagation()}
        >
          打开原图
        </a>
      ) : null}
    </div>
  )
}
