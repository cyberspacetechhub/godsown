import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Chip, Tabs, Tab } from '@mui/material'
import { Wifi, ExitToApp, SwapHoriz, CalendarMonth, Hotel, ContentCopy } from '@mui/icons-material'
import axios from 'axios'
import GuestWiFi from './GuestWiFi'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'multiservice_api_key_2024_secure'

function GuestDashboard() {
  const [guest, setGuest] = useState(null)
  const [bookings, setBookings] = useState([])
  const [tabValue, setTabValue] = useState(0)
  const [roomChangeDialog, setRoomChangeDialog] = useState(false)
  const [roomChangeReason, setRoomChangeReason] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('guestToken')
      const response = await axios.get(`${API_BASE_URL}/api/guests/dashboard`, {
        headers: { 'x-api-key': API_KEY, 'Authorization': `Bearer ${token}` }
      })
      setGuest(response.data.data.guest)
      setBookings(response.data.data.bookings)
    } catch (error) {
      if (error.response?.status === 401) {
        navigate('/guest/login')
      }
    }
  }

  const requestRoomChange = async () => {
    try {
      const token = localStorage.getItem('guestToken')
      await axios.post(`${API_BASE_URL}/api/guests/room-change`, { reason: roomChangeReason }, {
        headers: { 'x-api-key': API_KEY, 'Authorization': `Bearer ${token}` }
      })
      alert('Room change request submitted successfully')
      setRoomChangeDialog(false)
      setRoomChangeReason('')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit request')
    }
  }

  const handleCheckout = async () => {
    if (!confirm('Are you sure you want to checkout?')) return
    try {
      const token = localStorage.getItem('guestToken')
      await axios.post(`${API_BASE_URL}/api/guests/checkout`, {}, {
        headers: { 'x-api-key': API_KEY, 'Authorization': `Bearer ${token}` }
      })
      alert('Checkout successful')
      localStorage.removeItem('guestToken')
      localStorage.removeItem('guestData')
      navigate('/guest/login')
    } catch (error) {
      alert(error.response?.data?.message || 'Checkout failed')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('guestToken')
    localStorage.removeItem('guestData')
    navigate('/guest/login')
  }

  if (!guest) return null

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F6F2', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E' }}>
            Welcome, {guest.name}
          </Typography>
          <Button variant="outlined" onClick={handleLogout} sx={{ borderColor: '#C6A75E', color: '#C6A75E' }}>
            Logout
          </Button>
        </Box>

        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Dashboard" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
          <Tab label="WiFi Access" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
        </Tabs>

        {tabValue === 0 && (
          <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: 'white', borderRadius: 2 }}>
                  <CardContent>
                    <Hotel sx={{ fontSize: 40, color: '#C6A75E', mb: 1 }} />
                    <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
                      Room Number
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>
                      {guest.roomNumber || 'N/A'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={3}>
                <Card sx={{ bgcolor: 'white', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
                      Status
                    </Typography>
                    <Chip label={guest.status} sx={{ bgcolor: guest.status === 'active' ? '#25D366' : '#666', color: 'white', fontWeight: 600 }} />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" fullWidth startIcon={<SwapHoriz />} onClick={() => setRoomChangeDialog(true)} sx={{ bgcolor: '#3b82f6', color: 'white', py: 2, '&:hover': { bgcolor: '#2563eb' } }}>
                  Request Room Change
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" fullWidth startIcon={<ExitToApp />} onClick={handleCheckout} sx={{ bgcolor: '#ef4444', color: 'white', py: 2, '&:hover': { bgcolor: '#dc2626' } }}>
                  Checkout
                </Button>
              </Grid>
            </Grid>

            <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 3 }}>
              My Bookings
            </Typography>
            <Grid container spacing={3}>
              {bookings.map((booking) => (
                <Grid item xs={12} md={6} key={booking._id}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                          Room {booking.room?.roomNumber}
                        </Typography>
                        <Chip label={booking.status} size="small" sx={{ bgcolor: booking.status === 'confirmed' ? '#25D366' : '#666', color: 'white' }} />
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <CalendarMonth sx={{ fontSize: 20, color: '#666' }} />
                        <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                          {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                        Payment: {booking.paymentStatus}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {tabValue === 1 && <GuestWiFi />}
      </Container>

      <Dialog open={roomChangeDialog} onClose={() => setRoomChangeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>
          Request Room Change
        </DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Reason for room change" multiline rows={4} value={roomChangeReason} onChange={(e) => setRoomChangeReason(e.target.value)} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRoomChangeDialog(false)} sx={{ color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={requestRoomChange} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', '&:hover': { bgcolor: '#B89650' } }}>
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GuestDashboard
