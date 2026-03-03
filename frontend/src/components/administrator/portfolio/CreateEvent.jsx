import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert } from '@mui/material'
import usePost from '../../../hooks/usePost'
import useAuth from '../../../hooks/useAuth'

function CreateEvent({ open, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const postData = usePost()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (data) => postData('/events', data, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('events')
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
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Add Event</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {mutation.isError && (
            <Alert severity="error" className="mb-4">
              {mutation.error?.message || 'Operation failed'}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            fullWidth
            label="Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register('date', { required: 'Date is required' })}
            error={!!errors.date}
            helperText={errors.date?.message}
          />

          <TextField
            fullWidth
            label="Location"
            margin="normal"
            {...register('location', { required: 'Location is required' })}
            error={!!errors.location}
            helperText={errors.location?.message}
          />

          <TextField fullWidth label="Description" multiline rows={3} margin="normal" {...register('description')} />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isLoading} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
            {mutation.isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateEvent
