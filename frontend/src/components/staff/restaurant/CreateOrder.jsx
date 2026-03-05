import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Box, Typography, Grid, Card, CardContent, CardMedia, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Chip, Divider, Alert } from '@mui/material'
import { Add, Remove, ShoppingCart, Payment } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import usePost from '../../../hooks/usePost'
import useAuth from '../../../hooks/useAuth'

function CreateOrder() {
  const [cart, setCart] = useState([])
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '', tableNumber: '' })
  const [orderDialog, setOrderDialog] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  
  const fetchData = useFetch()
  const postData = usePost()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const { data: foodData, isLoading } = useQuery('menu-items', () => 
    fetchData('/foods', auth.token)
  )

  const createOrderMutation = useMutation(
    (orderData) => postData('/orders', orderData, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('orders')
        setCart([])
        setCustomerInfo({ name: '', phone: '', email: '', tableNumber: '' })
        setOrderDialog(false)
        toast.success('Order created successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create order')
      }
    }
  )

  const foods = foodData?.data?.data || foodData?.data || []
  const availableFoods = foods.filter(food => food.isAvailable !== false) // Show only available foods

  const addToCart = (food) => {
    const existingItem = cart.find(item => item._id === food._id)
    if (existingItem) {
      setCart(cart.map(item => 
        item._id === food._id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { ...food, quantity: 1 }])
    }
  }

  const removeFromCart = (foodId) => {
    setCart(cart.map(item => 
      item._id === foodId 
        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
        : item
    ).filter(item => item.quantity > 0))
  }

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleCreateOrder = () => {
    if (cart.length === 0) {
      toast.error('Please add items to cart')
      return
    }
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill customer name and phone')
      return
    }
    setOrderDialog(true)
  }

  const confirmOrder = () => {
    const orderData = {
      totalAmount: getTotalAmount(),
      paymentMethod,
      paymentStatus: paymentMethod === 'cash' ? 'paid' : 'unpaid',
      status: 'pending'
    }
    
    const customer = {
      name: customerInfo.name,
      email: customerInfo.email || `${customerInfo.phone}@restaurant.local`,
      phone: customerInfo.phone
    }
    
    const items = cart.map(item => ({
      food: item._id,
      quantity: item.quantity,
      price: item.price
    }))
    
    const requestData = {
      ...orderData,
      customer,
      items
    }
    
    createOrderMutation.mutate(requestData)
  }

  const foodCategories = [...new Set(availableFoods.map(food => food.category))]

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Create New Order
      </Typography>

      <Grid container spacing={3}>
        {/* Menu Items */}
        <Grid item xs={12} md={8}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <Typography>Loading menu items...</Typography>
            </Box>
          ) : availableFoods.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 2 }}>
                No food items available
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#999' }}>
                Total foods loaded: {foods.length}
              </Typography>
            </Box>
          ) : (
            foodCategories.map(category => (
            <Box key={category} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2, textTransform: 'capitalize' }}>
                {category}
              </Typography>
              <Grid container spacing={2}>
                {availableFoods.filter(food => food.category === category).map(food => (
                  <Grid item xs={12} sm={6} md={4} key={food._id}>
                    <Card sx={{ borderRadius: 2, height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' } }}>
                      <CardMedia
                        component="img"
                        height="120"
                        image={food.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80`}
                        alt={food.name}
                        onError={(e) => {
                          e.target.src = `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80`
                        }}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 1 }}>
                          {food.name}
                        </Typography>
                        <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
                          {food.description || 'No description available'}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>
                            ₦{food.price}
                          </Typography>
                          <Chip 
                            label={`${food.totalSold || 0} sold`} 
                            size="small" 
                            sx={{ bgcolor: '#E8F5E8', color: '#2e7d32' }} 
                          />
                        </Box>
                        <Button
                          fullWidth
                          variant="contained"
                          onClick={() => addToCart(food)}
                          sx={{ 
                            bgcolor: '#C6A75E', 
                            color: '#3B2A1E', 
                            fontFamily: "'Poppins', sans-serif", 
                            fontWeight: 600, 
                            '&:hover': { bgcolor: '#B89650' }
                          }}
                        >
                          Add to Cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))
          )}
        </Grid>

        {/* Cart & Customer Info */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, position: 'sticky', top: 20 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2 }}>
                Order Details
              </Typography>

              {/* Customer Info */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 1 }}>
                  Customer Information
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  label="Customer Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Phone Number *"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Email (Optional)"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                  sx={{ mb: 1 }}
                />
                <TextField
                  fullWidth
                  size="small"
                  label="Table Number (Optional)"
                  value={customerInfo.tableNumber}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Cart Items */}
              <Typography variant="subtitle2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 1 }}>
                Cart Items ({cart.length})
              </Typography>
              
              {cart.length === 0 ? (
                <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', textAlign: 'center', py: 2 }}>
                  No items in cart
                </Typography>
              ) : (
                <Box sx={{ maxHeight: 200, overflowY: 'auto', mb: 2 }}>
                  {cart.map(item => (
                    <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1, borderBottom: '1px solid #f0f0f0' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
                          {item.name}
                        </Typography>
                        <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                          ₦{item.price} each
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <IconButton size="small" onClick={() => removeFromCart(item._id)}>
                          <Remove />
                        </IconButton>
                        <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, minWidth: 20, textAlign: 'center' }}>
                          {item.quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => addToCart(item)}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              <Divider sx={{ mb: 2 }} />

              {/* Total */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>
                  ₦{getTotalAmount()}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={handleCreateOrder}
                disabled={cart.length === 0}
                sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}
              >
                Create Order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Confirmation Dialog */}
      <Dialog open={orderDialog} onClose={() => setOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>
          Confirm Order
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2 }}>
              Customer: {customerInfo.name}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 1 }}>
              Order Items:
            </Typography>
            {cart.map(item => (
              <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif" }}>
                  {item.name} x {item.quantity}
                </Typography>
                <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}>
                  ₦{item.price * item.quantity}
                </Typography>
              </Box>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                Total: ₦{getTotalAmount()}
              </Typography>
            </Box>

            <TextField
              fullWidth
              select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              SelectProps={{ native: true }}
              sx={{ mb: 2 }}
            >
              <option value="cash">Cash</option>
              <option value="transfer">Bank Transfer</option>
              <option value="pos">POS</option>
              <option value="paystack">Paystack (Online)</option>
            </TextField>

            {paymentMethod === 'cash' && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Cash payment will be marked as paid immediately
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOrderDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmOrder}
            disabled={createOrderMutation.isLoading}
            sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}
          >
            {createOrderMutation.isLoading ? 'Creating...' : 'Confirm Order'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default CreateOrder