import { ADMIN_SORT_OPTIONS } from '../data/adminInventoryFilters'

export default function InventorySortBar({ count, sortBy, onSortChange }) {
  return (
    <div className="admin-inventory-sort-bar" role="region" aria-label="Sort results">
      <p className="admin-inventory-sort-bar__count" role="status">
        Showing <strong>{count.toLocaleString('en-NZ')}</strong> {count === 1 ? 'vehicle' : 'vehicles'}
      </p>
      <label className="admin-inventory-sort-bar__sort">
        <span className="admin-inventory-sort-bar__sort-label">Sort</span>
        <select
          className="admin-inventory-sort-bar__select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort vehicles"
        >
          {ADMIN_SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
