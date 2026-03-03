import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, Chip, Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, TextField, IconButton } from '@mui/material'
import { Payment, Edit } from '@mui/icons-material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function BookingList() {
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  
  const fetchData = useFetch()
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery('bookings', () => 
    fetchData('/bookings', auth.token)
  )

  const updatePaymentMutation = useMutation(
    () => updateData(`/bookings/${selectedBooking._id}`, { 
      paymentStatus, 
      paymentMethod 
    }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('bookings')
        setPaymentDialog(false)
        toast.success('Payment status updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update payment')
      }
    }
  )

  const handlePaymentUpdate = (booking) => {
    setSelectedBooking(booking)
    setPaymentStatus(booking.paymentStatus)
    setPaymentMethod(booking.paymentMethod || '')
    setPaymentDialog(true)
  }

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Typography color="error">Error loading bookings</Typography>

  const bookings = data?.data?.data || []

  const getStatusColor = (status) => {
    const colors = { pending: '#f59e0b', confirmed: '#3b82f6', completed: '#10b981', cancelled: '#ef4444' }
    return colors[status] || '#6b7280'
  }

  const getPaymentColor = (status) => {
    return status === 'paid' ? '#10b981' : '#f59e0b'
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Bookings
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Guest</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Room</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Check-in</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Check-out</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Status</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>{booking.guest?.name || 'N/A'}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{booking.roomNumber || 'Not assigned'}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={booking.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: getStatusColor(booking.status),
                      color: 'white',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={booking.paymentStatus} 
                    size="small" 
                    sx={{ 
                      bgcolor: getPaymentColor(booking.paymentStatus),
                      color: 'white',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }} 
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    onClick={() => handlePaymentUpdate(booking)}
                    sx={{ color: '#C6A75E', '&:hover': { bgcolor: '#F8F6F2' } }}
                    title="Update Payment"
                  >
                    <Payment />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Payment Update Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Update Payment Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField 
              fullWidth 
              select 
              label="Payment Status" 
              value={paymentStatus} 
              onChange={(e) => setPaymentStatus(e.target.value)} 
              sx={{ mb: 2 }}
            >
              <MenuItem value="unpaid">Unpaid</MenuItem>
              <MenuItem value="paid">Paid</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
            </TextField>
            
            <TextField 
              fullWidth 
              select 
              label="Payment Method" 
              value={paymentMethod} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
              sx={{ mb: 2 }}
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="transfer">Bank Transfer</MenuItem>
              <MenuItem value="pos">POS</MenuItem>
              <MenuItem value="paystack">Paystack (Online)</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setPaymentDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => updatePaymentMutation.mutate()} 
            disabled={updatePaymentMutation.isLoading}
            sx={{ 
              bgcolor: '#C6A75E', 
              color: '#3B2A1E', 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              '&:hover': { bgcolor: '#B89650' } 
            }}
          >
            {updatePaymentMutation.isLoading ? 'Updating...' : 'Update Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BookingList
