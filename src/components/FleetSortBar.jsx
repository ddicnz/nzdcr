import { useSearchParams } from 'react-router-dom'
import {
  DEFAULT_ORDERBY,
  FLEET_ORDERBY_OPTIONS,
  migrateSearchParamsToOrderby,
  normalizeOrderby,
} from '../data/fleetSort'

export default function FleetSortBar({ resultLine }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const orderby = normalizeOrderby(searchParams.get('orderby'))

  const onChange = (e) => {
    const v = normalizeOrderby(e.target.value)
    const next = migrateSearchParamsToOrderby(searchParams)
    if (v === DEFAULT_ORDERBY) next.delete('orderby')
    else next.set('orderby', v)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="fleet-toolbar">
      <p className="fleet-toolbar__count">{resultLine}</p>
      <label className="fleet-toolbar__sort">
        <span className="sr-only">Sort results</span>
        <select
          className="fleet-toolbar__select"
          value={orderby}
          onChange={onChange}
          aria-label="Sort products"
        >
          {FLEET_ORDERBY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
