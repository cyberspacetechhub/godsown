import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, IconButton, MenuItem, FormControl, InputLabel, Select, Alert } from '@mui/material'
import { Add, Edit, Delete, Assignment } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import useDelete from '../../../hooks/useDelete'
import useAuth from '../../../hooks/useAuth'
import RoomAssignmentDialog from '../../staff/hotel/RoomAssignmentDialog'

function GuestManagement() {
  const [createDialog, setCreateDialog] = useState(false)
  const [editDialog, setEditDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [assignmentDialog, setAssignmentDialog] = useState(false)
  const [bookingDialog, setBookingDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [selectedGuest, setSelectedGuest] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    roomType: '',
    roomId: ''
  })
  const [guestForm, setGuestForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    address: '', 
    roomType: '', 
    checkInDate: '', 
    checkOutDate: '' 
  })
  
  const queryClient = useQueryClient()
  const fetchGuests = useFetch()
  const fetchBookings = useFetch()
  const createGuest = usePost()
  const deleteGuest = useDelete()
  const { auth } = useAuth()

  const { data: guestsData, isLoading } = useQuery('guests', () => fetchGuests('/guests', auth.token))
  const { data: bookingsData } = useQuery('bookings', () => fetchBookings('/bookings', auth.token))
  
  // Fetch available rooms when room type is selected
  const { data: availableRoomsData } = useQuery(
    ['available-rooms', bookingForm.roomType],
    () => fetchGuests('/rooms', auth.token),
    { enabled: !!bookingForm.roomType }
  )
  
  const guests = Array.isArray(guestsData?.data?.data) ? guestsData.data.data : Array.isArray(guestsData?.data) ? guestsData.data : []
  const bookings = Array.isArray(bookingsData?.data?.data) ? bookingsData.data.data : Array.isArray(bookingsData?.data) ? bookingsData.data : []
  const roomTypes = Array.isArray(availableRoomsData?.data?.data) ? availableRoomsData.data.data : []
  
  // Get available room numbers for selected room type
  const selectedRoomType = roomTypes.find(rt => rt.roomType === bookingForm.roomType)
  const availableRoomNumbers = selectedRoomType ? selectedRoomType.roomNumbers.filter(room => room.isAvailable) : []
  
  // Get pending bookings that need room assignment
  const pendingBookings = bookings.filter(booking => booking.status === 'pending' && !booking.roomNumber)

  const createMutation = useMutation(
    (data) => createGuest('/guests/staff-register', data, auth.token),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('guests')
        queryClient.invalidateQueries('bookings')
        setCreateDialog(false)
        setGuestForm({ name: '', email: '', phone: '', address: '', roomType: '', checkInDate: '', checkOutDate: '' })
        
        // If booking was created, open room assignment dialog
        if (response?.data?.booking) {
          setSelectedBooking(response.data.booking)
          setAssignmentDialog(true)
        }
        
        toast.success('Guest registered successfully. Please assign a room to complete the booking.')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to register guest')
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(guestForm)
  }

  const handleAssignRoom = (booking) => {
    setSelectedBooking(booking)
    setAssignmentDialog(true)
  }

  const handleEditGuest = (guest) => {
    setSelectedGuest(guest)
    setEditDialog(true)
  }

  const handleCreateBooking = (guest) => {
    setSelectedGuest(guest)
    setBookingForm({
      roomType: '',
      roomId: ''
    })
    setBookingDialog(true)
  }

  const createBookingMutation = useMutation(
    (data) => createGuest('/bookings', data, auth.token),
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('guests')
        queryClient.invalidateQueries('bookings')
        setBookingDialog(false)
        
        toast.success('Booking created and room assigned successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create booking')
      }
    }
  )

  const handleBookingSubmit = (e) => {
    e.preventDefault()
    const [roomTypeId, roomNumber] = bookingForm.roomId.split(':')
    createBookingMutation.mutate({
      guest: {
        name: selectedGuest.name,
        email: selectedGuest.email,
        phone: selectedGuest.phone
      },
      roomTypeId: roomTypeId,
      roomNumber: roomNumber,
      roomType: bookingForm.roomType,
      checkInDate: selectedGuest.checkInDate,
      checkOutDate: selectedGuest.checkOutDate,
      status: 'confirmed'
    })
  }

  const handleDeleteGuest = (guest) => {
    setSelectedGuest(guest)
    setDeleteDialog(true)
  }

  const roomTypeOptions = ['Standard Room', 'Deluxe Room', 'Suite', 'Executive Suite', 'Presidential Suite']

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E' }}>Guest Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
          Register Guest
        </Button>
      </Box>

      {/* Pending Room Assignments Alert */}
      {pendingBookings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
            {pendingBookings.length} booking(s) need room assignment
          </Typography>
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Name</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Email</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Phone</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Room</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Status</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Check-in</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Check-out</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Loading...</TableCell>
              </TableRow>
            ) : guests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>No guests found</TableCell>
              </TableRow>
            ) : (
              guests.map((guest) => {
                const guestBooking = bookings.find(b => b.guest?._id === guest._id || b.guest === guest._id)
                const needsRoomAssignment = guestBooking && guestBooking.status === 'pending' && !guestBooking.roomNumber
                
                return (
                  <TableRow key={guest._id} hover sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>{guest.name}</TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{guest.email}</TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{guest.phone}</TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      {guestBooking?.roomNumber || 'Not assigned'}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={guestBooking?.status || guest.status || 'inactive'} 
                        size="small" 
                        sx={{ 
                          bgcolor: needsRoomAssignment ? '#ff9800' : 
                                   guestBooking?.status === 'confirmed' ? '#4caf50' : 
                                   guestBooking?.status === 'completed' ? '#2196f3' : 
                                   guestBooking?.status === 'pending' ? '#ff9800' : '#9e9e9e',
                          color: 'white',
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }} 
                      />
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      {guestBooking?.checkInDate ? new Date(guestBooking.checkInDate).toLocaleDateString() : 
                       guest.checkInDate ? new Date(guest.checkInDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      {guestBooking?.checkOutDate ? new Date(guestBooking.checkOutDate).toLocaleDateString() : 
                       guest.checkOutDate ? new Date(guest.checkOutDate).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {needsRoomAssignment && (
                          <IconButton 
                            onClick={() => handleAssignRoom(guestBooking)} 
                            sx={{ color: '#C6A75E', '&:hover': { bgcolor: '#F8F6F2' } }}
                            title="Assign Room"
                          >
                            <Assignment />
                          </IconButton>
                        )}
                        {!guestBooking && (
                          <IconButton 
                            onClick={() => handleCreateBooking(guest)} 
                            sx={{ color: '#4caf50', '&:hover': { bgcolor: '#F8F6F2' } }}
                            title="Create Booking & Assign Room"
                          >
                            <Assignment />
                          </IconButton>
                        )}
                        <IconButton 
                          onClick={() => handleEditGuest(guest)} 
                          sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#F8F6F2' } }}
                          title="Edit Guest"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleDeleteGuest(guest)} 
                          sx={{ color: '#ef4444', '&:hover': { bgcolor: '#F8F6F2' } }}
                          title="Delete Guest"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Register Guest Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Register New Guest</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label="Full Name" 
              required 
              value={guestForm.name} 
              onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Email" 
              type="email" 
              required 
              value={guestForm.email} 
              onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Phone Number" 
              required 
              value={guestForm.phone} 
              onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value })} 
              sx={{ mb: 2 }} 
              helperText="Phone will be used as default password" 
            />
            <TextField 
              fullWidth 
              label="Address" 
              value={guestForm.address} 
              onChange={(e) => setGuestForm({ ...guestForm, address: e.target.value })} 
              sx={{ mb: 2 }} 
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Room Type *</InputLabel>
              <Select
                value={guestForm.roomType}
                onChange={(e) => setGuestForm({ ...guestForm, roomType: e.target.value })}
                label="Room Type *"
                required
              >
                {roomTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField 
              fullWidth 
              label="Check-in Date" 
              type="date" 
              required 
              value={guestForm.checkInDate} 
              onChange={(e) => setGuestForm({ ...guestForm, checkInDate: e.target.value })} 
              InputLabelProps={{ shrink: true }} 
              sx={{ mb: 2 }} 
            />
            <TextField 
              fullWidth 
              label="Check-out Date" 
              type="date" 
              required 
              value={guestForm.checkOutDate} 
              onChange={(e) => setGuestForm({ ...guestForm, checkOutDate: e.target.value })} 
              InputLabelProps={{ shrink: true }} 
              sx={{ mb: 2 }} 
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={createMutation.isLoading} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
            {createMutation.isLoading ? 'Registering...' : 'Register Guest'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Booking Dialog */}
      <Dialog open={bookingDialog} onClose={() => setBookingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Create Booking for {selectedGuest?.name}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleBookingSubmit} sx={{ pt: 2 }}>
            {/* Display guest dates */}
            <Box sx={{ mb: 3, p: 2, bgcolor: '#F8F6F2', borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 1 }}>
                Booking Period
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                Check-in: {selectedGuest?.checkInDate ? new Date(selectedGuest.checkInDate).toLocaleDateString() : 'Not set'}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                Check-out: {selectedGuest?.checkOutDate ? new Date(selectedGuest.checkOutDate).toLocaleDateString() : 'Not set'}
              </Typography>
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Room Type *</InputLabel>
              <Select
                value={bookingForm.roomType}
                onChange={(e) => setBookingForm({ ...bookingForm, roomType: e.target.value, roomId: '' })}
                label="Room Type *"
                required
              >
                {roomTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {bookingForm.roomType && (
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Room *</InputLabel>
                <Select
                  value={bookingForm.roomId}
                  onChange={(e) => setBookingForm({ ...bookingForm, roomId: e.target.value })}
                  label="Select Room *"
                  required
                >
                  {availableRoomNumbers.map((room) => (
                    <MenuItem key={room.number} value={`${selectedRoomType._id}:${room.number}`}>
                      Room {room.number} - ₦{selectedRoomType.pricePerNight}/night ({selectedRoomType.capacity} guests)
                    </MenuItem>
                  ))}
                </Select>
                {availableRoomNumbers.length === 0 && (
                  <Typography variant="caption" sx={{ color: '#ef4444', mt: 1 }}>
                    No available rooms of this type
                  </Typography>
                )}
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setBookingDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleBookingSubmit} disabled={createBookingMutation.isLoading || !bookingForm.roomId} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
            {createBookingMutation.isLoading ? 'Creating...' : 'Create Booking & Assign Room'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Room Assignment Dialog */}
      <RoomAssignmentDialog 
        open={assignmentDialog}
        onClose={() => setAssignmentDialog(false)}
        booking={selectedBooking}
        onAssignmentComplete={() => {
          queryClient.invalidateQueries('guests')
          queryClient.invalidateQueries('bookings')
        }}
      />

      {/* Edit Guest Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Edit Guest</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              label="Full Name" 
              value={selectedGuest?.name || ''} 
              sx={{ mb: 2 }} 
              disabled
            />
            <TextField 
              fullWidth 
              label="Email" 
              value={selectedGuest?.email || ''} 
              sx={{ mb: 2 }} 
              disabled
            />
            <TextField 
              fullWidth 
              label="Phone Number" 
              value={selectedGuest?.phone || ''} 
              sx={{ mb: 2 }} 
              disabled
            />
            <TextField 
              fullWidth 
              label="Address" 
              value={selectedGuest?.address || ''} 
              sx={{ mb: 2 }} 
              disabled
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Guest Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Delete Guest</DialogTitle>
        <DialogContent>
          <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', pt: 2 }}>
            Are you sure you want to delete guest <strong>{selectedGuest?.name}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#ef4444', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#dc2626' } }}>
            Delete Guest
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default GuestManagement
