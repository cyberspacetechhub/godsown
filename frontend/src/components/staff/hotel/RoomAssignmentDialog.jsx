import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Typography, Box, Chip, Alert, Grid, Card, CardContent } from '@mui/material'
import { Hotel, CheckCircle } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function RoomAssignmentDialog({ open, onClose, booking, onAssignmentComplete }) {
  const [selectedRoom, setSelectedRoom] = useState('')
  const [availableRooms, setAvailableRooms] = useState([])
  
  const fetchData = useFetch()
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  // Fetch available rooms of the requested type
  const { data: roomsData, isLoading } = useQuery(
    ['available-rooms', booking?.roomType],
    () => fetchData('/rooms', auth.token),
    { enabled: !!booking?.roomType && open }
  )

  useEffect(() => {
    if (roomsData?.data?.data && booking?.roomType) {
      const roomType = roomsData.data.data.find(rt => rt.roomType === booking.roomType)
      if (roomType) {
        const available = roomType.roomNumbers
          .filter(room => room.isAvailable)
          .map(room => ({
            _id: `${roomType._id}-${room.number}`,
            roomTypeId: roomType._id,
            roomNumber: room.number,
            pricePerNight: roomType.pricePerNight,
            capacity: roomType.capacity
          }))
        setAvailableRooms(available)
      } else {
        setAvailableRooms([])
      }
    }
  }, [roomsData, booking?.roomType])

  const assignRoomMutation = useMutation(
    ({ bookingId, roomTypeId, roomNumber }) => updateData(`/bookings/${bookingId}/assign-room`, { roomTypeId, roomNumber }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings'])
        queryClient.invalidateQueries(['available-rooms'])
        queryClient.invalidateQueries(['rooms'])
        toast.success('Room assigned successfully! Confirmation email sent to guest.')
        onAssignmentComplete?.()
        onClose()
        setSelectedRoom('')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to assign room')
      }
    }
  )

  const handleAssignRoom = () => {
    if (!selectedRoom || !booking?._id) return
    const room = availableRooms.find(r => r._id === selectedRoom)
    if (!room) return
    assignRoomMutation.mutate({ 
      bookingId: booking._id, 
      roomTypeId: room.roomTypeId, 
      roomNumber: room.roomNumber 
    })
  }

  const calculateTotalPrice = () => {
    if (!booking || !selectedRoom) return 0
    const room = availableRooms.find(r => r._id === selectedRoom)
    if (!room) return 0
    
    const checkIn = new Date(booking.checkInDate)
    const checkOut = new Date(booking.checkOutDate)
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
    
    return room.pricePerNight * nights
  }

  const selectedRoomDetails = availableRooms.find(r => r._id === selectedRoom)

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>
        Assign Room to Guest
      </DialogTitle>
      
      <DialogContent sx={{ pt: 2 }}>
        {booking && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2 }}>
              Booking Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                  <strong>Guest:</strong> {booking.guest?.name || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                  <strong>Email:</strong> {booking.guest?.email || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                  <strong>Room Type:</strong> 
                  <Chip 
                    label={booking.roomType} 
                    size="small" 
                    sx={{ ml: 1, bgcolor: '#C6A75E', color: 'white', textTransform: 'capitalize' }} 
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                  <strong>Duration:</strong> {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {isLoading ? (
          <Typography>Loading available rooms...</Typography>
        ) : availableRooms.length === 0 ? (
          <Alert severity="warning" sx={{ mb: 2 }}>
            No available rooms of type "{booking?.roomType}" found. Please check room availability or contact admin.
          </Alert>
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Select Available Room</InputLabel>
              <Select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                label="Select Available Room"
              >
                {availableRooms.map((room) => (
                  <MenuItem key={room._id} value={room._id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Hotel sx={{ mr: 1, color: '#C6A75E' }} />
                        <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                          Room {room.roomNumber}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                          {room.capacity} guests
                        </Typography>
                        <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>
                          ₦{room.pricePerNight}/night
                        </Typography>
                        <Chip 
                          icon={<CheckCircle />}
                          label="Available" 
                          size="small" 
                          sx={{ bgcolor: '#10b981', color: 'white' }} 
                        />
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedRoomDetails && (
              <Card sx={{ bgcolor: '#F8F6F2', borderRadius: 2, mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2 }}>
                    Selected Room Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                        <strong>Room Number:</strong> {selectedRoomDetails.roomNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                        <strong>Capacity:</strong> {selectedRoomDetails.capacity} guests
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                        <strong>Price per Night:</strong> ₦{selectedRoomDetails.pricePerNight}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>
                        <strong>Total Cost:</strong> ₦{calculateTotalPrice()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleAssignRoom}
          disabled={!selectedRoom || assignRoomMutation.isLoading || availableRooms.length === 0}
          sx={{ 
            bgcolor: '#C6A75E', 
            color: '#3B2A1E', 
            fontFamily: "'Poppins', sans-serif", 
            fontWeight: 600, 
            '&:hover': { bgcolor: '#B89650' } 
          }}
        >
          {assignRoomMutation.isLoading ? 'Assigning...' : 'Assign Room'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default RoomAssignmentDialog