import { useMutation, useQueryClient } from 'react-query'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import useDelete from '../../../hooks/useDelete'
import useAuth from '../../../hooks/useAuth'

function DeleteRoom({ open, onClose, room }) {
  const deleteData = useDelete()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    () => deleteData(`/rooms/${room._id}`, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('rooms')
        onClose()
      }
    }
  )

  const handleDelete = () => {
    mutation.mutate()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Delete Room</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
          Are you sure you want to delete room <strong>"{room?.roomNumber}"</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
        <Button onClick={handleDelete} variant="contained" disabled={mutation.isLoading} sx={{ bgcolor: '#ef4444', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#dc2626' } }}>
          {mutation.isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteRoom
