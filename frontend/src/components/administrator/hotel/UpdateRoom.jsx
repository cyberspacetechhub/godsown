import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert, Box, Typography, Chip } from '@mui/material'
import { Hotel, Person } from '@mui/icons-material'
import useUpdate from '../../../hooks/useUpdate'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function UpdateRoom({ open, onClose, room }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: room
  })
  const updateData = useUpdate()
  const fetchData = useFetch()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  // Fetch current booking for this room
  const { data: bookingData } = useQuery(
    ['room-booking', room?._id],
    () => fetchData(`/bookings?room=${room._id}&status=confirmed`, auth.token),
    { enabled: !!room?._id && open }
  )

  const currentBooking = bookingData?.data?.data?.[0]

  const mutation = useMutation(
    (data) => updateData(`/rooms/${room._id}`, data, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rooms')
        queryClient.invalidateQueries('rooms-status')
        onClose()
      }
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  const roomTypes = ['single', 'double', 'suite']
  const statuses = ['available', 'occupied', 'maintenance']

  const getStatusColor = (status) => {
    const colors = { available: '#10b981', occupied: '#ef4444', maintenance: '#f59e0b' }
    return colors[status] || '#6b7280'
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Edit Room</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error?.message || 'Operation failed'}
            </Alert>
          )}

          {/* Current Room Status Info */}
          {room && (
            <Box sx={{ mb: 3, p: 2, bgcolor: '#F8F6F2', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Hotel sx={{ color: '#C6A75E', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
                    Room {room.roomNumber}
                  </Typography>
                </Box>
                <Chip 
                  label={room.status} 
                  size="small" 
                  sx={{ 
                    bgcolor: getStatusColor(room.status),
                    color: 'white',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    textTransform: 'capitalize'
                  }} 
                />
              </Box>
              
              {currentBooking && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Person sx={{ color: '#666', mr: 1, fontSize: 16 }} />
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                    Current Guest: <strong>{currentBooking.guest?.name}</strong> 
                    ({new Date(currentBooking.checkInDate).toLocaleDateString()} - {new Date(currentBooking.checkOutDate).toLocaleDateString()})
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          <TextField
            fullWidth
            label="Room Number"
            margin="normal"
            {...register('roomNumber', { required: 'Room number is required' })}
            error={!!errors.roomNumber}
            helperText={errors.roomNumber?.message}
          />

          <TextField
            fullWidth
            select
            label="Room Type"
            margin="normal"
            defaultValue={room?.roomType}
            {...register('roomType', { required: 'Room type is required' })}
            error={!!errors.roomType}
            helperText={errors.roomType?.message}
          >
            {roomTypes.map((type) => (
              <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>{type}</MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Price Per Night"
            type="number"
            margin="normal"
            {...register('pricePerNight', { required: 'Price is required', min: 0 })}
            error={!!errors.pricePerNight}
            helperText={errors.pricePerNight?.message}
          />

          <TextField
            fullWidth
            label="Capacity"
            type="number"
            margin="normal"
            {...register('capacity', { required: 'Capacity is required', min: 1 })}
            error={!!errors.capacity}
            helperText={errors.capacity?.message}
          />

          <TextField
            fullWidth
            select
            label="Status"
            margin="normal"
            defaultValue={room?.status}
            {...register('status')}
            helperText={currentBooking && room?.status === 'occupied' ? 'Room is currently occupied by a guest' : 'Change status to manage room availability'}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status} sx={{ textTransform: 'capitalize' }}>{status}</MenuItem>
            ))}
          </TextField>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isLoading} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
            {mutation.isLoading ? 'Updating...' : 'Update Room'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UpdateRoom
