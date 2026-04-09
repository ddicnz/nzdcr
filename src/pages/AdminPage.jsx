import { Link } from 'react-router-dom'

export default function AdminPage() {
  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="admin-page__title">Admin</h1>
        <p className="admin-page__intro">
          Manage inventory and content. This area is not password-protected yet — use only in development or behind
          your own access control.
        </p>
        <div className="admin-page__actions">
          <Link to="/admin/cars/" className="fleet-categories__btn">
            View all cars
          </Link>
          <Link to="/admin/cars/quick-look" className="fleet-categories__btn">
            Quick look
          </Link>
          <Link to="/addcar/" className="fleet-categories__btn">
            Add car
          </Link>
        </div>
      </div>
    </div>
  )
}
