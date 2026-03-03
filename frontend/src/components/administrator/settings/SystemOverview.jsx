import { useQuery } from 'react-query'
import { Box, Typography, Grid, Card, CardContent, Chip, LinearProgress, Paper, Divider, Avatar } from '@mui/material'
import { Hotel, Restaurant, Business, People, AttachMoney, Pending, CheckCircle, TrendingUp } from '@mui/icons-material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function SystemOverview() {
  const fetchData = useFetch()
  const { auth } = useAuth()

  const { data: stats } = useQuery('system-stats', () => 
    Promise.all([
      fetchData('/rooms', auth.token),
      fetchData('/orders', auth.token),
      fetchData('/bookings', auth.token),
      fetchData('/users', auth.token),
      fetchData('/properties', auth.token)
    ]).then(([rooms, orders, bookings, users, properties]) => ({
      rooms: rooms?.data?.data || [],
      orders: orders?.data?.data || [],
      bookings: bookings?.data?.data || [],
      users: users?.data?.data || [],
      properties: properties?.data?.data || []
    }))
  )

  const getStats = () => {
    if (!stats) return {}
    
    console.log('Bookings data:', stats.bookings)
    
    const totalRooms = stats.rooms.reduce((acc, room) => acc + (room.roomNumbers?.length || 0), 0)
    const availableRooms = stats.rooms.reduce((acc, room) => 
      acc + (room.roomNumbers?.filter(r => r.isAvailable).length || 0), 0)
    
    const orderRevenue = stats.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const bookingRevenue = stats.bookings.reduce((sum, booking) => {
      console.log(`Booking ${booking._id}: totalAmount = ${booking.totalAmount}`)
      return sum + (booking.totalAmount || 0)
    }, 0)
    const totalRevenue = orderRevenue + bookingRevenue
    
    console.log('Calculated booking revenue:', bookingRevenue)
    
    return {
      totalRooms,
      availableRooms,
      occupancyRate: totalRooms > 0 ? ((totalRooms - availableRooms) / totalRooms * 100).toFixed(1) : 0,
      totalOrders: stats.orders.length,
      pendingOrders: stats.orders.filter(o => o.status === 'pending').length,
      completedOrders: stats.orders.filter(o => o.status === 'delivered').length,
      totalBookings: stats.bookings.length,
      activeBookings: stats.bookings.filter(b => b.status === 'confirmed').length,
      totalUsers: stats.users.length,
      totalProperties: stats.properties.length,
      orderRevenue,
      bookingRevenue,
      totalRevenue
    }
  }

  const systemStats = getStats()
  const recentOrders = stats?.orders?.slice(-5).reverse() || []
  const recentBookings = stats?.bookings?.slice(-5).reverse() || []

  const StatCard = ({ title, value, subtitle, icon: Icon, color, progress }) => (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ fontSize: 40, color, mr: 2 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>
              {value}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#999', mb: 1 }}>
            {subtitle}
          </Typography>
        )}
        {progress !== undefined && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 8, 
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': { backgroundColor: color }
              }} 
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', textAlign: 'right' }}>
              {progress}%
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        System Overview
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Hotel Rooms"
            value={systemStats.totalRooms || 0}
            subtitle={`${systemStats.availableRooms || 0} available`}
            icon={Hotel}
            color="#2196f3"
            progress={100 - systemStats.occupancyRate}
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Restaurant Orders"
            value={systemStats.totalOrders || 0}
            subtitle={`${systemStats.pendingOrders || 0} pending`}
            icon={Restaurant}
            color="#ff9800"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Bookings"
            value={systemStats.totalBookings || 0}
            subtitle={`${systemStats.activeBookings || 0} active`}
            icon={Business}
            color="#4caf50"
          />
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <StatCard
            title="Total Users"
            value={systemStats.totalUsers || 0}
            subtitle="Registered users"
            icon={People}
            color="#9c27b0"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#10b981', mr: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>₦{(systemStats.totalRevenue || 0).toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#f59e0b', mr: 2 }}>
                  <Restaurant />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Order Revenue</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>₦{(systemStats.orderRevenue || 0).toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#3b82f6', mr: 2 }}>
                  <Hotel />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Booking Revenue</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>₦{(systemStats.bookingRevenue || 0).toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">Completed Orders</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>{systemStats.completedOrders || 0}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 3 }}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Chip 
                    label="Manage Rooms" 
                    clickable 
                    sx={{ width: '100%', py: 2, bgcolor: '#E3F2FD', color: '#1976d2' }} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip 
                    label="View Orders" 
                    clickable 
                    sx={{ width: '100%', py: 2, bgcolor: '#FFF3E0', color: '#f57c00' }} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip 
                    label="System Settings" 
                    clickable 
                    sx={{ width: '100%', py: 2, bgcolor: '#F3E5F5', color: '#7b1fa2' }} 
                  />
                </Grid>
                <Grid item xs={6}>
                  <Chip 
                    label="Analytics" 
                    clickable 
                    sx={{ width: '100%', py: 2, bgcolor: '#E8F5E8', color: '#388e3c' }} 
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 3 }}>
                System Status
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Hotel Service</Typography>
                  <Chip label="Active" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Restaurant Service</Typography>
                  <Chip label="Active" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Real Estate Service</Typography>
                  <Chip label="Active" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Portfolio Service</Typography>
                  <Chip label="Active" size="small" sx={{ bgcolor: '#4caf50', color: 'white' }} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 3 }}>
                Recent Activity
              </Typography>
              <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                {recentOrders.slice(0, 3).map((order, index) => (
                  <Box key={order._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Order #{order._id.slice(-6)}</Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>₦{order.totalAmount}</Typography>
                      </Box>
                      <Chip 
                        label={order.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: order.status === 'delivered' ? '#4caf50' : '#ff9800',
                          color: 'white',
                          textTransform: 'capitalize'
                        }} 
                      />
                    </Box>
                    {index < 2 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))}
                {recentBookings.slice(0, 2).map((booking, index) => (
                  <Box key={booking._id} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>Booking #{booking._id.slice(-6)}</Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>₦{booking.totalAmount || 0}</Typography>
                      </Box>
                      <Chip 
                        label={booking.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: booking.status === 'confirmed' ? '#4caf50' : '#ff9800',
                          color: 'white',
                          textTransform: 'capitalize'
                        }} 
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SystemOverview