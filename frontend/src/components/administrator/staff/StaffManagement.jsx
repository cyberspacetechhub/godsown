import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, MenuItem, IconButton } from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import useAuth from '../../../hooks/useAuth'
import UpdateStaff from './UpdateStaff'
import DeleteStaff from './DeleteStaff'

function StaffManagement() {
  const [createDialog, setCreateDialog] = useState(false)
  const [updateDialog, setUpdateDialog] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState(null)
  const [staffForm, setStaffForm] = useState({ name: '', email: '', password: '', phone: '', position: '', department: '', shift: '' })
  
  const queryClient = useQueryClient()
  const fetchStaff = useFetch()
  const createStaff = usePost()
  const { auth } = useAuth()

  const { data: staffData, isLoading } = useQuery('staff', () => fetchStaff('/users?role=Staff', auth.token))
  const staff = Array.isArray(staffData?.data?.data) ? staffData.data.data : Array.isArray(staffData?.data) ? staffData.data : []

  const createMutation = useMutation(
    (data) => createStaff('/users', { ...data, role: 'Staff' }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staff')
        setCreateDialog(false)
        setStaffForm({ name: '', email: '', password: '', phone: '', position: '', department: '', shift: '' })
        toast.success('Staff created successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create staff')
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    createMutation.mutate(staffForm)
  }

  const handleEdit = (staff) => {
    setSelectedStaff(staff)
    setUpdateDialog(true)
  }

  const handleDelete = (staff) => {
    setSelectedStaff(staff)
    setDeleteDialog(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E' }}>
          Staff Management
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
          Add Staff
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Name</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Email</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Phone</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Position</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Department</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Shift</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Status</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} align="center" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Loading...</TableCell></TableRow>
            ) : staff.length === 0 ? (
              <TableRow><TableCell colSpan={8} align="center" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>No staff found</TableCell></TableRow>
            ) : (
              staff.map((member) => (
                <TableRow key={member._id} hover sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>{member.name}</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>{member.email}</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>{member.phone || 'N/A'}</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>{member.position}</TableCell>
                  <TableCell>
                    <Chip label={member.department} size="small" sx={{ bgcolor: member.department === 'hotel' ? '#3b82f6' : '#f59e0b', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222', textTransform: 'capitalize' }}>{member.shift || 'N/A'}</TableCell>
                  <TableCell>
                    <Chip label={member.status} size="small" sx={{ bgcolor: member.status === 'active' ? '#4caf50' : '#9e9e9e', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, textTransform: 'capitalize' }} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(member)} sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#F8F6F2' } }}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(member)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#F8F6F2' } }}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Add New Staff</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField fullWidth label="Full Name" required value={staffForm.name} onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" type="email" required value={staffForm.email} onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" required value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone Number" value={staffForm.phone} onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Position" required value={staffForm.position} onChange={(e) => setStaffForm({ ...staffForm, position: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth select label="Department" required value={staffForm.department} onChange={(e) => setStaffForm({ ...staffForm, department: e.target.value })} sx={{ mb: 2 }}>
              <MenuItem value="hotel">Hotel</MenuItem>
              <MenuItem value="restaurant">Restaurant</MenuItem>
            </TextField>
            <TextField fullWidth select label="Shift" value={staffForm.shift} onChange={(e) => setStaffForm({ ...staffForm, shift: e.target.value })} sx={{ mb: 2 }}>
              <MenuItem value="morning">Morning</MenuItem>
              <MenuItem value="afternoon">Afternoon</MenuItem>
              <MenuItem value="night">Night</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={createMutation.isLoading} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
            {createMutation.isLoading ? 'Creating...' : 'Create Staff'}
          </Button>
        </DialogActions>
      </Dialog>

      {selectedStaff && (
        <>
          <UpdateStaff open={updateDialog} onClose={() => setUpdateDialog(false)} staff={selectedStaff} />
          <DeleteStaff open={deleteDialog} onClose={() => setDeleteDialog(false)} staff={selectedStaff} />
        </>
      )}
    </Box>
  )
}

export default StaffManagement
