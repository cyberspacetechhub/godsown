import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from './pages/home/Layout'
import HomePage from './pages/home/HomePage'
import FoodPage from './pages/home/FoodPage'
import HotelPage from './pages/home/HotelPage'
import RealEstatePage from './pages/home/RealEstatePage'
import MinistryPage from './pages/home/MinistryPage'
import NotFound from './pages/NotFound'
import Forbidden from './pages/Forbidden'
import GuestAuth from './pages/guest/GuestAuth'
import GuestDashboard from './pages/guest/GuestDashboard'
import StaffLogin from './auth/StaffLogin'
import StaffLayout from './components/staff/subComponents/StaffLayout'
import HotelDashboard from './components/staff/hotel/HotelDashboard'
import HotelBookings from './components/staff/hotel/HotelBookings'
import RestaurantDashboard from './components/staff/restaurant/RestaurantDashboard'
import RestaurantOrders from './components/staff/restaurant/RestaurantOrders'
import CreateOrder from './components/staff/restaurant/CreateOrder'
import GuestManagement from './components/administrator/hotel/GuestManagement'
import AdminLogin from './auth/AdminLogin'
import AdminProtectedRoute from './shared/AdminProtectedRoute'
import PersistLogin from './shared/PersistLogin'
import AdminLayout from './components/administrator/subComponents/AdminLayout'
import AdminDashboard from './components/administrator/subComponents/AdminDasboard'
import FoodManagement from './components/administrator/food/FoodManagement'
import OrderList from './components/administrator/food/OrderList'
import RoomManagement from './components/administrator/hotel/RoomManagement'
import BookingList from './components/administrator/hotel/BookingList'
import PropertyManagement from './components/administrator/realestate/PropertyManagement'
import ProfileManagement from './components/administrator/portfolio/ProfileManagement'
import EventManagement from './components/administrator/portfolio/EventManagement'
import StaffManagement from './components/administrator/staff/StaffManagement'
import AdminSettings from './components/administrator/settings/AdminSettings'
import Analytics from './components/administrator/settings/Analytics'
import './App.css'


function App() {
  const queryClient = new QueryClient()

  const roles = { guest: "Guest", admin: "Admin", staff: "Staff" }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="food" element={<FoodPage />} />
            <Route path="hotel" element={<HotelPage />} />
            <Route path="real-estate" element={<RealEstatePage />} />
            <Route path="ministry" element={<MinistryPage />} />
          </Route>
          <Route path="/guest/login" element={<GuestAuth />} />
          <Route path="/guest/dashboard" element={<GuestDashboard />} />
          
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/hotel" element={<StaffLayout />}>
            <Route index element={<HotelDashboard />} />
            <Route path="bookings" element={<HotelBookings />} />
            <Route path="register-guest" element={<GuestManagement />} />
          </Route>
          <Route path="/staff/restaurant" element={<StaffLayout />}>
            <Route index element={<RestaurantDashboard />} />
            <Route path="orders" element={<RestaurantOrders />} />
            <Route path="create-order" element={<CreateOrder />} />
          </Route>
          
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route element={<PersistLogin />}>
            <Route element={<AdminProtectedRoute allowedRole={roles.admin} />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="food" element={<FoodManagement />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="rooms" element={<RoomManagement />} />
                <Route path="bookings" element={<BookingList />} />
                <Route path="guests" element={<GuestManagement />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="properties" element={<PropertyManagement />} />
                <Route path="profiles" element={<ProfileManagement />} />
                <Route path="events" element={<EventManagement />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
      </Router>
    </QueryClientProvider>
  )
}

export default App
