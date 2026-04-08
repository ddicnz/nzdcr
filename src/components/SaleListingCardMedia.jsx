import AdminInventoryCarMedia from './AdminInventoryCarMedia'

/**
 * 在售列表卡片：封面与 Admin 一致 — 三联拼图。全屏看全部图仅在详情页。
 */
export default function SaleListingCardMedia({ vehicle }) {
  return <AdminInventoryCarMedia vehicle={vehicle} />
}
