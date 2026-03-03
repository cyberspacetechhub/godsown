import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Forbidden from '../pages/Forbidden'

function AdminProtectedRoute({ allowedRole }) {
  const { auth } = useAuth()

  if (!auth?.token) {
    return <Navigate to="/admin/login" replace />
  }

  if (auth?.user?.role !== allowedRole) {
    return <Forbidden />
  }

  return <Outlet />
}

export default AdminProtectedRoute
