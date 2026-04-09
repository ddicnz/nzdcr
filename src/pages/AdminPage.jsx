import { Link } from 'react-router-dom'
import { logoutAdmin } from '../data/adminAuth'

export default function AdminPage() {
  const handleLogout = () => {
    logoutAdmin()
    window.location.href = '/admin-login'
  }

  return (
    <div className="admin-page">
      <div className="container">
        <h1 className="admin-page__title">Admin</h1>
        <p className="admin-page__intro">Manage inventory and content.</p>
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
          <button type="button" className="sale-btn sale-btn--ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
