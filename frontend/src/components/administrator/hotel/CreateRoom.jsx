import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert } from '@mui/material'
import usePost from '../../../hooks/usePost'
import useAuth from '../../../hooks/useAuth'

function CreateRoom({ open, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const postData = usePost()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (data) => postData('/rooms', data, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('roomTypes')
        reset()
        onClose()
      }
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Add New Room Type</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {mutation.error?.message || 'Operation failed'}
            </Alert>
          )}

          <TextField
            fullWidth
            select
            label="Room Type"
            margin="normal"
            defaultValue=""
            {...register('roomType', { required: 'Room type is required' })}
            error={!!errors.roomType}
            helperText={errors.roomType?.message}
          >
            <MenuItem value="Standard Room">Standard Room</MenuItem>
            <MenuItem value="Deluxe Room">Deluxe Room</MenuItem>
            <MenuItem value="Suite">Suite</MenuItem>
            <MenuItem value="Executive Suite">Executive Suite</MenuItem>
            <MenuItem value="Presidential Suite">Presidential Suite</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Room Numbers"
            margin="normal"
            {...register('roomNumber', { required: 'Room numbers are required' })}
            error={!!errors.roomNumber}
            helperText={errors.roomNumber?.message || 'Enter comma-separated room numbers (e.g., 104, 108, 321)'}
          />

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
            helperText={errors.capacity?.message || 'Maximum number of guests'}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            margin="normal"
            {...register('description', { required: 'Description is required' })}
            error={!!errors.description}
            helperText={errors.description?.message || 'Describe the room features and amenities'}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isLoading} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
            {mutation.isLoading ? 'Creating...' : 'Create Room Type'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateRoom
