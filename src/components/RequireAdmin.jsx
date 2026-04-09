import { Navigate, useLocation } from 'react-router-dom'
import { isAdminAuthenticated } from '../data/adminAuth'

export default function RequireAdmin({ children }) {
  const location = useLocation()
  if (isAdminAuthenticated()) return children
  return <Navigate to="/admin-login" replace state={{ from: location }} />
}
