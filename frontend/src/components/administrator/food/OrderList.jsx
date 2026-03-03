import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress, Typography, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material'
import { Payment, Edit } from '@mui/icons-material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function OrderList() {
  const [paymentDialog, setPaymentDialog] = useState(false)
  const [statusDialog, setStatusDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [paymentStatus, setPaymentStatus] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [orderStatus, setOrderStatus] = useState('')
  
  const fetchData = useFetch()
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery('orders', () => 
    fetchData('/orders', auth.token)
  )

  const updatePaymentMutation = useMutation(
    () => updateData(`/orders/${selectedOrder._id}`, { 
      paymentStatus, 
      paymentMethod 
    }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders')
        setPaymentDialog(false)
        toast.success('Payment status updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update payment')
      }
    }
  )

  const updateStatusMutation = useMutation(
    () => updateData(`/orders/${selectedOrder._id}`, { status: orderStatus }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders')
        setStatusDialog(false)
        toast.success('Order status updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update status')
      }
    }
  )

  const handlePaymentUpdate = (order) => {
    setSelectedOrder(order)
    setPaymentStatus(order.paymentStatus)
    setPaymentMethod(order.paymentMethod || '')
    setPaymentDialog(true)
  }

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order)
    setOrderStatus(order.status)
    setStatusDialog(true)
  }

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Typography color="error">Error loading orders</Typography>

  const orders = data?.data?.data || []

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#3b82f6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    }
    return colors[status] || '#6b7280'
  }

  const getPaymentColor = (status) => {
    return status === 'paid' ? '#10b981' : '#f59e0b'
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Orders
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Order Date</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Customer</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Total Amount</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Status</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>{order.customer?.name || 'N/A'}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>₦{order.totalAmount}</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: getStatusColor(order.status),
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
                      bgcolor: getPaymentColor(order.paymentStatus),
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
                      onClick={() => handleStatusUpdate(order)}
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Status Update Dialog */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Update Order Status</DialogTitle>
        <DialogContent>
          <TextField 
            fullWidth 
            select 
            label="Status" 
            value={orderStatus} 
            onChange={(e) => setOrderStatus(e.target.value)} 
            sx={{ mt: 2 }}
          >
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setStatusDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => updateStatusMutation.mutate()} 
            disabled={updateStatusMutation.isLoading}
            sx={{ 
              bgcolor: '#C6A75E', 
              color: '#3B2A1E', 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              '&:hover': { bgcolor: '#B89650' } 
            }}
          >
            {updateStatusMutation.isLoading ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default OrderList
