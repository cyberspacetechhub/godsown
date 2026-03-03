import { useState } from 'react'
import { useQuery } from 'react-query'
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress, MenuItem } from '@mui/material'
import { Wifi, AcUnit, LocalParking, LocalBar, LocalLaundryService, Restaurant, WhatsApp } from '@mui/icons-material'
import usePublicFetch from '../../hooks/usePublicFetch'

function HotelPage() {
  const [bookingDialog, setBookingDialog] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [bookingForm, setBookingForm] = useState({ guestName: '', email: '', phone: '', checkIn: '', checkOut: '', specialRequests: '', paymentMethod: 'whatsapp' })

  const fetchRooms = usePublicFetch()
  const { data: roomsData, isLoading } = useQuery('rooms', () => fetchRooms('/api/rooms'))

  const roomTypes = roomsData?.data || []
  const availableRooms = []
  
  // Flatten room types to individual available rooms
  roomTypes.forEach(roomType => {
    roomType.roomNumbers?.forEach(room => {
      if (room.isAvailable) {
        availableRooms.push({
          _id: `${roomType._id}-${room.number}`,
          roomType: roomType.roomType,
          roomNumber: room.number,
          pricePerNight: roomType.pricePerNight,
          capacity: roomType.capacity,
          description: roomType.description
        })
      }
    })
  })

  const roomTypeMap = {
    'Standard Room': { name: 'Standard Room', description: 'Comfortable room with modern amenities' },
    'Deluxe Room': { name: 'Deluxe Room', description: 'Spacious room with premium furnishings' },
    'Suite': { name: 'Suite', description: 'Luxury suite with separate living area' },
    'Executive Suite': { name: 'Executive Suite', description: 'Premium suite with executive amenities' },
    'Presidential Suite': { name: 'Presidential Suite', description: 'Ultimate luxury accommodation' }
  }

  const handleBookClick = (room) => {
    setSelectedRoom(room)
    setBookingDialog(true)
  }

  const handleBookingSubmit = () => {
    if (!bookingForm.guestName || !bookingForm.email || !bookingForm.checkIn || !bookingForm.checkOut) {
      alert('Please fill in all required fields')
      return
    }

    if (bookingForm.paymentMethod === 'whatsapp') {
      const whatsappMessage = `Hello! I'd like to book a room:\n\nRoom: ${room.roomType} (${room.roomNumber})\nPrice: ₦${room.pricePerNight.toLocaleString()}/night\n\nGuest: ${bookingForm.guestName}\nEmail: ${bookingForm.email}\nPhone: ${bookingForm.phone}\nCheck-in: ${bookingForm.checkIn}\nCheck-out: ${bookingForm.checkOut}\nSpecial Requests: ${bookingForm.specialRequests || 'None'}`
      window.open(`https://wa.me/2348001234567?text=${encodeURIComponent(whatsappMessage)}`, '_blank')
      setBookingDialog(false)
      setBookingForm({ guestName: '', email: '', phone: '', checkIn: '', checkOut: '', specialRequests: '', paymentMethod: 'whatsapp' })
    } else {
      alert('Payment integration coming soon!')
    }
  }

  const amenities = [
    { icon: <Wifi sx={{ fontSize: 40 }} />, name: 'Free WiFi' },
    { icon: <AcUnit sx={{ fontSize: 40 }} />, name: 'Air Conditioning' },
    { icon: <LocalParking sx={{ fontSize: 40 }} />, name: 'Free Parking' },
    { icon: <LocalBar sx={{ fontSize: 40 }} />, name: 'Bar & Lounge' },
    { icon: <LocalLaundryService sx={{ fontSize: 40 }} />, name: 'Laundry Service' },
    { icon: <Restaurant sx={{ fontSize: 40 }} />, name: 'Restaurant' }
  ]

  const gallery = [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80'
  ]

  return (
    <Box>
      <Box
        sx={{
          height: { xs: '60vh', md: '70vh' },
          backgroundImage: 'linear-gradient(rgba(59, 42, 30, 0.4), rgba(59, 42, 30, 0.4)), url(https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, color: '#F8F6F2', mb: 2 }}>
            Experience Comfort & Excellence
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", color: '#C6A75E', mb: 4, fontSize: { xs: '1rem', md: '1.3rem' } }}>
            Where luxury meets hospitality
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 5, py: 2, borderRadius: 2, fontSize: '1.1rem', '&:hover': { bgcolor: '#B89650', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(198, 167, 94, 0.4)' } }}>
            Book Now
          </Button>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8F6F2' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Our Rooms
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#C6A75E' }} />
            </Box>
          ) : availableRooms.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 8, fontFamily: "'Poppins', sans-serif", color: '#666' }}>
              No rooms available at the moment
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {availableRooms.map((room) => (
                <Grid item xs={12} md={4} key={room._id}>
                  <Card sx={{ borderRadius: 3, height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 32px rgba(198, 167, 94, 0.2)' } }}>
                    <CardMedia component="img" height="250" image={`https://images.unsplash.com/photo-${room.roomType.includes('Suite') ? '1582719478250-c89cae4dc85b' : room.roomType === 'Deluxe Room' ? '1590490360182-c33d57733427' : '1611892440504-42a792e24d32'}?w=600&q=80`} alt={room.roomType} />
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 1 }}>
                        {room.roomType}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
                        Room {room.roomNumber} • {room.capacity} guests
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 2 }}>
                        {room.description}
                      </Typography>
                      <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E', mb: 2 }}>
                        ₦{room.pricePerNight.toLocaleString()}/night
                      </Typography>
                      <Button variant="contained" fullWidth onClick={() => handleBookClick(room)} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
                        Book Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Amenities
          </Typography>
          <Grid container spacing={4}>
            {amenities.map((amenity, idx) => (
              <Grid item xs={6} sm={4} md={2} key={idx}>
                <Box sx={{ textAlign: 'center', p: 3, borderRadius: 2, transition: 'all 0.3s', '&:hover': { bgcolor: '#F8F6F2', transform: 'translateY(-4px)' } }}>
                  <Box sx={{ color: '#C6A75E', mb: 1 }}>{amenity.icon}</Box>
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222', fontWeight: 500 }}>
                    {amenity.name}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8F6F2' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Gallery
          </Typography>
          <Grid container spacing={3}>
            {gallery.map((img, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Box sx={{ height: 250, borderRadius: 3, overflow: 'hidden', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.3s', cursor: 'pointer', '&:hover': { transform: 'scale(1.05)' } }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 3 }}>
            Book Your Stay
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', textAlign: 'center', mb: 6 }}>
            Select a room above to start your booking
          </Typography>
        </Container>
      </Box>

      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>
          Book {selectedRoom?.roomType}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E', mb: 1 }}>
              Room {selectedRoom?.roomNumber}
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E', mb: 3 }}>
              ₦{selectedRoom?.pricePerNight.toLocaleString()}/night
            </Typography>
            <TextField fullWidth label="Full Name" required value={bookingForm.guestName} onChange={(e) => setBookingForm({ ...bookingForm, guestName: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" required type="email" value={bookingForm.email} onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone Number" value={bookingForm.phone} onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Check-in Date" required type="date" value={bookingForm.checkIn} onChange={(e) => setBookingForm({ ...bookingForm, checkIn: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
            <TextField fullWidth label="Check-out Date" required type="date" value={bookingForm.checkOut} onChange={(e) => setBookingForm({ ...bookingForm, checkOut: e.target.value })} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
            <TextField fullWidth label="Special Requests" value={bookingForm.specialRequests} onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })} multiline rows={3} sx={{ mb: 2 }} />
            <TextField fullWidth select label="Payment Method" value={bookingForm.paymentMethod} onChange={(e) => setBookingForm({ ...bookingForm, paymentMethod: e.target.value })} sx={{ mb: 2 }}>
              <MenuItem value="whatsapp">Book via WhatsApp</MenuItem>
              <MenuItem value="online">Pay Online Now</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setBookingDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
            Cancel
          </Button>
          {bookingForm.paymentMethod === 'whatsapp' ? (
            <Button variant="contained" onClick={handleBookingSubmit} startIcon={<WhatsApp />} sx={{ bgcolor: '#25D366', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#20BA5A' } }}>
              Book via WhatsApp
            </Button>
          ) : (
            <Button variant="contained" onClick={handleBookingSubmit} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
              Proceed to Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default HotelPage
