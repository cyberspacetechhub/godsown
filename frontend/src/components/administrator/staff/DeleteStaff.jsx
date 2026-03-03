import { useMutation, useQueryClient } from 'react-query'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material'
import { toast } from 'react-toastify'
import useDelete from '../../../hooks/useDelete'
import useAuth from '../../../hooks/useAuth'

function DeleteStaff({ open, onClose, staff }) {
  const queryClient = useQueryClient()
  const deleteStaff = useDelete()
  const { auth } = useAuth()

  const mutation = useMutation(
    () => deleteStaff(`/users/${staff._id}`, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staff')
        toast.success('Staff deleted successfully')
        onClose()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete staff')
      }
    }
  )

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>
        Delete Staff
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 2 }}>
          Are you sure you want to delete <strong>{staff?.name}</strong>? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
        <Button variant="contained" onClick={() => mutation.mutate()} disabled={mutation.isLoading} sx={{ bgcolor: '#ef4444', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#dc2626' } }}>
          {mutation.isLoading ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteStaff
