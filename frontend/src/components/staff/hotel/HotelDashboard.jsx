import { useQuery } from 'react-query'
import { Box, Typography, Grid, Card, CardContent, Alert } from '@mui/material'
import { Hotel, Event, People, CheckCircle, Assignment } from '@mui/icons-material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'
import QuickRoomStatus from './QuickRoomStatus'

function HotelDashboard() {
  const fetchBookings = useFetch()
  const fetchGuests = useFetch()
  const { auth } = useAuth()

  const { data: bookingsData } = useQuery('staff-bookings', () => fetchBookings('/bookings', auth.token))
  const { data: guestsData } = useQuery('staff-guests', () => fetchGuests('/guests', auth.token))

  const bookings = Array.isArray(bookingsData?.data?.data) ? bookingsData.data.data : Array.isArray(bookingsData?.data) ? bookingsData.data : []
  const guests = Array.isArray(guestsData?.data?.data) ? guestsData.data.data : Array.isArray(guestsData?.data) ? guestsData.data : []

  // Calculate important metrics
  const pendingRoomAssignments = bookings.filter(b => b.status === 'pending' && !b.room).length
  const todayCheckIns = bookings.filter(b => {
    const today = new Date().toDateString()
    return new Date(b.checkInDate).toDateString() === today && b.status === 'confirmed'
  }).length
  const todayCheckOuts = bookings.filter(b => {
    const today = new Date().toDateString()
    return new Date(b.checkOutDate).toDateString() === today && b.status === 'confirmed'
  }).length

  const stats = [
    { 
      title: 'Total Bookings', 
      value: bookings.length, 
      icon: <Event sx={{ fontSize: 40, color: '#667eea' }} />, 
      color: '#667eea' 
    },
    { 
      title: 'Active Guests', 
      value: guests.filter(g => g.status === 'active').length, 
      icon: <People sx={{ fontSize: 40, color: '#4caf50' }} />, 
      color: '#4caf50' 
    },
    { 
      title: 'Today Check-ins', 
      value: todayCheckIns, 
      icon: <CheckCircle sx={{ fontSize: 40, color: '#2196f3' }} />, 
      color: '#2196f3' 
    },
    { 
      title: 'Pending Assignments', 
      value: pendingRoomAssignments, 
      icon: <Assignment sx={{ fontSize: 40, color: '#ff9800' }} />, 
      color: '#ff9800' 
    },
  ]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Hotel Dashboard
      </Typography>

      {/* Alerts for urgent actions */}
      {pendingRoomAssignments > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            {pendingRoomAssignments} booking(s) need room assignment. Please assign rooms to complete the bookings.
          </Typography>
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Stats Cards */}
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card sx={{ 
              borderRadius: 3, 
              background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`, 
              border: `1px solid ${stat.color}30`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: '#666', mb: 1, fontFamily: "'Poppins', sans-serif" }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color, fontFamily: "'Poppins', sans-serif" }}>
                      {stat.value}
                    </Typography>
                  </Box>
                  {stat.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Quick Room Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #F0F0F0',
            height: 'fit-content'
          }}>
            <CardContent>
              <QuickRoomStatus />
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Activity */}
        <Grid item xs={12} md={8}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '1px solid #F0F0F0'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2 }}>
                Today's Activity
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#F8F6F2', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#2196f3' }}>
                      {todayCheckIns}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      Check-ins Today
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#F8F6F2', borderRadius: 2 }}>
                    <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#ff9800' }}>
                      {todayCheckOuts}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      Check-outs Today
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default HotelDashboard