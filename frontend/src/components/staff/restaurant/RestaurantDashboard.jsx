import { useQuery } from 'react-query'
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material'
import { Restaurant, ShoppingCart, CheckCircle, HourglassEmpty, Add, List } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function RestaurantDashboard() {
  const fetchOrders = useFetch()
  const { auth } = useAuth()
  const navigate = useNavigate()

  const { data: ordersData } = useQuery('staff-orders', () => 
    fetchOrders('/orders', auth.token)
  )
  const orders = ordersData?.data?.data || []

  const stats = [
    { title: 'Total Orders', value: orders.length, icon: <ShoppingCart sx={{ fontSize: 40, color: '#f59e0b' }} />, color: '#f59e0b' },
    { title: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: <HourglassEmpty sx={{ fontSize: 40, color: '#ff9800' }} />, color: '#ff9800' },
    { title: 'Confirmed', value: orders.filter(o => o.status === 'confirmed').length, icon: <CheckCircle sx={{ fontSize: 40, color: '#4caf50' }} />, color: '#4caf50' },
    { title: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: <Restaurant sx={{ fontSize: 40, color: '#2196f3' }} />, color: '#2196f3' },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Restaurant Dashboard
      </Typography>

      {/* Quick Actions */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/staff/restaurant/create-order')}
            sx={{ 
              bgcolor: '#C6A75E', 
              color: '#3B2A1E', 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              py: 2,
              '&:hover': { bgcolor: '#B89650' } 
            }}
          >
            Create New Order
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<List />}
            onClick={() => navigate('/staff/restaurant/orders')}
            sx={{ 
              borderColor: '#C6A75E', 
              color: '#C6A75E', 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              py: 2,
              '&:hover': { borderColor: '#B89650', bgcolor: '#F8F6F2' } 
            }}
          >
            View All Orders
          </Button>
        </Grid>
      </Grid>

      {/* Stats */}
      <Grid container spacing={3}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ borderRadius: 2, background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`, border: `1px solid ${stat.color}30` }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>{stat.title}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color }}>{stat.value}</Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}

export default RestaurantDashboard
