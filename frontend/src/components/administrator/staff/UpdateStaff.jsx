import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from '@mui/material'
import { toast } from 'react-toastify'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function UpdateStaff({ open, onClose, staff }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const queryClient = useQueryClient()
  const updateStaff = useUpdate()
  const { auth } = useAuth()

  useEffect(() => {
    if (staff && open) {
      reset({
        name: staff.name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        position: staff.position || '',
        department: staff.department || '',
        shift: staff.shift || '',
        status: staff.status || 'active'
      })
    }
  }, [staff, open, reset])

  const mutation = useMutation(
    (data) => {
      return updateStaff(`/users/${staff._id}`, data, auth.token)
    },
    {
      onSuccess: (response) => {
        queryClient.invalidateQueries('staff')
        queryClient.refetchQueries('staff')
        toast.success('Staff updated successfully. Staff member should log out and log back in for shift changes to take effect.')
        onClose()
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update staff')
      }
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>
        Update Staff
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField fullWidth label="Full Name" {...register('name', { required: 'Name is required' })} error={!!errors.name} helperText={errors.name?.message} sx={{ mt: 2, mb: 2 }} />
          <TextField fullWidth label="Email" type="email" {...register('email', { required: 'Email is required' })} error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 2 }} />
          <TextField fullWidth label="Phone Number" {...register('phone')} sx={{ mb: 2 }} />
          <TextField fullWidth label="Position" {...register('position', { required: 'Position is required' })} error={!!errors.position} helperText={errors.position?.message} sx={{ mb: 2 }} />
          <TextField fullWidth select label="Department" {...register('department', { required: 'Department is required' })} error={!!errors.department} helperText={errors.department?.message} defaultValue={staff?.department || ''} sx={{ mb: 2 }}>
            <MenuItem value="hotel">Hotel</MenuItem>
            <MenuItem value="restaurant">Restaurant</MenuItem>
          </TextField>
          <TextField fullWidth select label="Shift" {...register('shift')} defaultValue={staff?.shift || ''} sx={{ mb: 2 }}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="morning">Morning</MenuItem>
            <MenuItem value="afternoon">Afternoon</MenuItem>
            <MenuItem value="night">Night</MenuItem>
          </TextField>
          <TextField fullWidth select label="Status" {...register('status')} defaultValue={staff?.status || 'active'} sx={{ mb: 2 }}>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit(onSubmit)} disabled={mutation.isLoading} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
          {mutation.isLoading ? 'Updating...' : 'Update'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpdateStaff
