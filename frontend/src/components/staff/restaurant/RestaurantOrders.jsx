import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, IconButton, Alert } from '@mui/material'
import { Payment, Edit, Add } from '@mui/icons-material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function RestaurantOrders() {
  const [updateDialog, setUpdateDialog] = useState(false)
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [status, setStatus] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')

  const queryClient = useQueryClient()
  const fetchOrders = useFetch()
  const updateOrder = useUpdate()
  const { auth } = useAuth()
  const navigate = useNavigate()

  const { data: ordersData, isLoading } = useQuery('staff-orders', () => 
    fetchOrders('/orders', auth.token)
  )
  const orders = ordersData?.data?.data || []

  const updateMutation = useMutation(
    () => updateOrder(`/orders/${selectedOrder._id}`, { status }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staff-orders')
        setUpdateDialog(false)
        toast.success('Order updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update order')
      }
    }
  )

  const updatePaymentMutation = useMutation(
    () => updateOrder(`/orders/${selectedOrder._id}`, { 
      paymentStatus, 
      paymentMethod 
    }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('staff-orders')
        setPaymentDialog(false)
        toast.success('Payment status updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update payment')
      }
    }
  )

  const handleUpdate = (order) => {
    setSelectedOrder(order)
    setStatus(order.status)
    setUpdateDialog(true)
  }

  const handlePaymentUpdate = (order) => {
    setSelectedOrder(order)
    setPaymentStatus(order.paymentStatus)
    setPaymentMethod(order.paymentMethod || '')
    setPaymentDialog(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E' }}>
          Restaurant Orders
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/staff/restaurant/create-order')}
          sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}
        >
          Create Order
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Order ID</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Customer</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Table</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Date</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Total</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Status</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Payment</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} align="center" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Loading...</TableCell></TableRow>
            ) : orders.length === 0 ? (
              <TableRow><TableCell colSpan={8} align="center" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>No orders found</TableCell></TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id} hover sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>
                    #{order._id.slice(-6)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                    {order.customer?.name || 'N/A'}
                    <br />
                    <Typography variant="caption" sx={{ color: '#999' }}>
                      {order.customer?.phone || 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                    {order.tableNumber || 'N/A'}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>
                    ₦{order.totalAmount?.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.status} 
                      size="small" 
                      sx={{ 
                        bgcolor: order.status === 'delivered' ? '#4caf50' : 
                                order.status === 'confirmed' ? '#2196f3' : 
                                order.status === 'pending' ? '#ff9800' : '#f44336', 
                        color: 'white', 
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={order.paymentStatus} 
                      size="small" 
                      sx={{ 
                        bgcolor: order.paymentStatus === 'paid' ? '#4caf50' : '#ff9800', 
                        color: 'white',
                        fontFamily: "'Poppins', sans-serif",
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }} 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        onClick={() => handleUpdate(order)}
                        sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#F8F6F2' } }}
                        title="Update Status"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => handlePaymentUpdate(order)}
                        sx={{ color: '#C6A75E', '&:hover': { bgcolor: '#F8F6F2' } }}
                        title="Update Payment"
                      >
                        <Payment />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={updateDialog} onClose={() => setUpdateDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Update Order Status</DialogTitle>
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
            <MenuItem value="delivered">Delivered</MenuItem>
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

      {/* Payment Update Dialog */}
      <Dialog open={paymentDialog} onClose={() => setPaymentDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
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

export default RestaurantOrders
