import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Alert } from '@mui/material'
import { Assignment, CheckCircle, Cancel, Payment } from '@mui/icons-material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'
import RoomAssignmentDialog from './RoomAssignmentDialog'

function HotelBookings() {
  const [updateDialog, setUpdateDialog] = useState(false)
  const [assignmentDialog, setAssignmentDialog] = useState(false)
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const queryClient = useQueryClient()
  const fetchBookings = useFetch()
  const updateBooking = useUpdate()
  const { auth } = useAuth()

  const { data: bookingsData, isLoading } = useQuery('staff-bookings', () => fetchBookings('/bookings', auth.token))
  const bookings = Array.isArray(bookingsData?.data?.data) ? bookingsData.data.data : Array.isArray(bookingsData?.data) ? bookingsData.data : []

  // Filter bookings that need attention
  const pendingBookings = bookings.filter(booking => booking.status === 'pending' && !booking.roomNumber)
  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed')
  const completedBookings = bookings.filter(booking => booking.status === 'completed')

  const updateMutation = useMutation(
    () => updateBooking(`/bookings/${selectedBooking._id}`, { status }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staff-bookings')
        setUpdateDialog(false)
        toast.success('Booking updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update booking')
      }
    }
  )

  const updatePaymentMutation = useMutation(
    () => updateBooking(`/bookings/${selectedBooking._id}`, { 
      paymentStatus, 
      paymentMethod 
    }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staff-bookings')
        setPaymentDialog(false)
        toast.success('Payment status updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update payment')
      }
    }
  )

  const handleUpdate = (booking) => {
    setSelectedBooking(booking)
    setStatus(booking.status)
    setUpdateDialog(true)
  }

  const handlePaymentUpdate = (booking) => {
    setSelectedBooking(booking)
    setPaymentStatus(booking.paymentStatus)
    setPaymentMethod(booking.paymentMethod || '')
    setPaymentDialog(true)
  }

  const handleAssignRoom = (booking) => {
    setSelectedBooking(booking)
    setAssignmentDialog(true)
  }

  const handleCheckOut = (booking) => {
    setSelectedBooking(booking)
    setStatus('completed')
    updateMutation.mutate()
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      confirmed: '#4caf50', 
      cancelled: '#f44336',
      completed: '#2196f3'
    }
    return colors[status] || '#9e9e9e'
  }

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: '#4caf50',
      unpaid: '#ff9800',
      refunded: '#9e9e9e'
    }
    return colors[status] || '#9e9e9e'
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Hotel Bookings Management
      </Typography>

      {/* Alerts for pending actions */}
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
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Guest</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Room Type</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Room Number</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Check-in</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Check-out</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Status</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Payment</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Loading...</TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>No bookings found</TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => {
                const needsRoomAssignment = booking.status === 'pending' && !booking.roomNumber
                const canCheckOut = booking.status === 'confirmed' && booking.roomNumber
                
                return (
                  <TableRow key={booking._id} hover sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>
                      {booking.guest?.name || 'N/A'}
                      <br />
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        {booking.guest?.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', textTransform: 'capitalize' }}>
                      {booking.roomType}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#C6A75E' }}>
                      {booking.roomNumber || 'Not assigned'}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      {new Date(booking.checkInDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      {new Date(booking.checkOutDate).toLocaleDateString()}
                    </TableCell>
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
                          bgcolor: getPaymentStatusColor(booking.paymentStatus), 
                          color: 'white',
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {needsRoomAssignment && (
                          <IconButton 
                            onClick={() => handleAssignRoom(booking)}
                            sx={{ color: '#C6A75E', '&:hover': { bgcolor: '#F8F6F2' } }}
                            title="Assign Room"
                          >
                            <Assignment />
                          </IconButton>
                        )}
                        {canCheckOut && (
                          <IconButton 
                            onClick={() => handleCheckOut(booking)}
                            sx={{ color: '#4caf50', '&:hover': { bgcolor: '#F8F6F2' } }}
                            title="Check Out"
                          >
                            <CheckCircle />
                          </IconButton>
                        )}
                        <IconButton 
                          onClick={() => handlePaymentUpdate(booking)}
                          sx={{ color: '#C6A75E', '&:hover': { bgcolor: '#F8F6F2' } }}
                          title="Update Payment"
                        >
                          <Payment />
                        </IconButton>
                        <Button 
                          size="small" 
                          variant="outlined" 
                          onClick={() => handleUpdate(booking)} 
                          sx={{ 
                            borderColor: '#C6A75E', 
                            color: '#C6A75E',
                            fontFamily: "'Poppins', sans-serif",
                            '&:hover': { borderColor: '#B89650', bgcolor: '#F8F6F2' }
                          }}
                        >
                          Update
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Update Status Dialog */}
      <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Update Booking Status</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            select 
            label="Status" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUpdateDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => updateMutation.mutate()} 
            disabled={updateMutation.isLoading}
            sx={{ 
              bgcolor: '#C6A75E', 
              color: '#3B2A1E', 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              '&:hover': { bgcolor: '#B89650' } 
            }}
          >
            {updateMutation.isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Room Assignment Dialog */}
      <RoomAssignmentDialog 
        open={assignmentDialog}
        onClose={() => setAssignmentDialog(false)}
        booking={selectedBooking}
        onAssignmentComplete={() => {
          queryClient.invalidateQueries('staff-bookings')
        }}
      />

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

export default HotelBookings
