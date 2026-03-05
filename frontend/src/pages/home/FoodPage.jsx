import { useState } from 'react'
import { useQuery } from 'react-query'
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Tabs, Tab, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress, MenuItem, useMediaQuery, useTheme } from '@mui/material'
import { WhatsApp, AccessTime, Phone, LocationOn } from '@mui/icons-material'
import { toast } from 'react-toastify'
import usePublicFetch from '../../hooks/usePublicFetch'

function FoodPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [orderDialog, setOrderDialog] = useState(false)
  const [cart, setCart] = useState([])
  const [orderForm, setOrderForm] = useState({ customerName: '', phone: '', address: '', paymentMethod: 'whatsapp' })
  const [showCartButton, setShowCartButton] = useState(false)

  const fetchFoods = usePublicFetch()
  const createOrder = usePublicFetch()

  const { data: foodsData, isLoading } = useQuery('foods', () => fetchFoods('/foods'))

  const foods = foodsData?.data || []

  const categories = [
    { name: 'Soups', key: 'soup' },
    { name: 'Rice', key: 'rice' },
    { name: 'Proteins', key: 'protein' },
    { name: 'Soft Drinks', key: 'soft drink' },
    { name: 'Combo Deals', key: 'combo deals' }
  ]

  const filteredFoods = foods.filter(food => food.category === categories[activeTab].key)

  const handleOrderClick = (food) => {
    const existing = cart.find(item => item._id === food._id)
    if (existing) {
      setCart(cart.map(item => item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { ...food, quantity: 1 }])
    }
    setShowCartButton(true)
  }

  const openCart = () => {
    if (cart.length === 0) {
      toast.warning('Your cart is empty. Please add items first.')
      return
    }
    setOrderDialog(true)
  }

  const addToCart = (food) => {
    const existing = cart.find(item => item._id === food._id)
    if (existing) {
      setCart(cart.map(item => item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      setCart([...cart, { ...food, quantity: 1 }])
    }
    setShowCartButton(true)
  }

  const updateQuantity = (foodId, quantity) => {
    if (quantity < 1) {
      setCart(cart.filter(item => item._id !== foodId))
    } else {
      setCart(cart.map(item => item._id === foodId ? { ...item, quantity } : item))
    }
  }

  const getTotalAmount = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleOrderSubmit = async () => {
    if (!orderForm.customerName || !orderForm.phone || cart.length === 0) {
      toast.error('Please fill in all required fields and add items to cart')
      return
    }

    if (orderForm.paymentMethod === 'whatsapp') {
      const itemsList = cart.map(item => `${item.name} x${item.quantity} - ₦${(item.price * item.quantity).toLocaleString()}`).join('\n')
      const whatsappMessage = `Hello! I'd like to order:\n\n${itemsList}\n\nTotal: ₦${getTotalAmount().toLocaleString()}\n\nName: ${orderForm.customerName}\nPhone: ${orderForm.phone}\nAddress: ${orderForm.address}`
      window.open(`https://wa.me/2347067659889?text=${encodeURIComponent(whatsappMessage)}`, '_blank')
      setOrderDialog(false)
      setCart([])
      setShowCartButton(false)
      setOrderForm({ customerName: '', phone: '', address: '', paymentMethod: 'whatsapp' })
    } else {
      toast.info('Payment integration coming soon!')
    }
  }

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box>
      {/* Floating Cart Button */}
      {showCartButton && cart.length > 0 && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
          <Button variant="contained" size="large" onClick={openCart} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 4, py: 2, borderRadius: 3, boxShadow: '0 8px 24px rgba(198, 167, 94, 0.4)', '&:hover': { bgcolor: '#B89650', transform: 'translateY(-2px)' } }}>
            View Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'}) - ₦{getTotalAmount().toLocaleString()}
          </Button>
        </Box>
      )}

      <Box sx={{ height: { xs: '60vh', md: '70vh' }, backgroundImage: 'linear-gradient(rgba(59, 42, 30, 0.5), rgba(59, 42, 30, 0.5)), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, color: '#F8F6F2', mb: 2 }}>
            Authentic Nigerian Cuisine & Baked Delights
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", color: '#C6A75E', mb: 4, fontSize: { xs: '1rem', md: '1.3rem' } }}>
            Experience the rich flavors of home-cooked meals and artisan baked goods
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 5, py: 2, borderRadius: 2, fontSize: '1.1rem', '&:hover': { bgcolor: '#B89650', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(198, 167, 94, 0.4)' } }}>
            Order Now
          </Button>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8F6F2' }}>        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Our Menu
          </Typography>
          <Tabs 
            value={activeTab} 
            onChange={(e, val) => setActiveTab(val)}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            centered={!isMobile}
            allowScrollButtonsMobile
            sx={{ mb: 6, '& .MuiTab-root': { fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#222222', '&.Mui-selected': { color: '#C6A75E' } }, '& .MuiTabs-indicator': { bgcolor: '#C6A75E', height: 3 } }}

          >
            {categories.map((cat, idx) => (
              <Tab key={idx} label={cat.name} />
            ))}
          </Tabs>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#C6A75E' }} />
            </Box>
          ) : filteredFoods.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 8, fontFamily: "'Poppins', sans-serif", color: '#666' }}>
              No items available in this category
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {filteredFoods.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item._id}>
                  <Card sx={{ borderRadius: 3, transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 32px rgba(198, 167, 94, 0.2)' } }}>
                    <CardMedia component="img" height="220" image={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'} alt={item.name} />
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 1 }}>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 2 }}>
                        {item.description || 'Delicious meal prepared with care'}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>
                          ₦{item.price.toLocaleString()}
                        </Typography>
                        <Button variant="outlined" size="small" onClick={() => handleOrderClick(item)} sx={{ borderColor: '#C6A75E', color: '#C6A75E', fontFamily: "'Poppins', sans-serif", '&:hover': { borderColor: '#B89650', bgcolor: '#C6A75E', color: '#3B2A1E' } }}>
                          Order
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Featured Dishes
          </Typography>
          <Grid container spacing={4}>
            {foods.filter(f => f?.isFeatured === true).slice(0, 3).map((dish) => (
              <Grid item xs={12} md={4} key={dish._id}>
                <Card sx={{ borderRadius: 3, position: 'relative', overflow: 'hidden', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.03)', boxShadow: '0 16px 40px rgba(198, 167, 94, 0.25)' } }}>
                  <Chip label="Featured" sx={{ position: 'absolute', top: 16, right: 16, bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, zIndex: 1 }} />
                  <CardMedia component="img" height="300" image={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80'} alt={dish.name} />
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 2 }}>
                      {dish.name}
                    </Typography>
                    <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E', mb: 3 }}>
                      ₦{dish.price.toLocaleString()}
                    </Typography>
                    <Button variant="contained" fullWidth onClick={() => handleOrderClick(dish)} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, py: 1.5, '&:hover': { bgcolor: '#B89650' } }}>
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#3B2A1E', color: '#F8F6F2', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
            Ready to Order?
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', mb: 4, opacity: 0.9 }}>
            Place your order via WhatsApp for quick delivery or pickup
          </Typography>
          <Button variant="contained" size="large" startIcon={<WhatsApp />} sx={{ bgcolor: '#25D366', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 5, py: 2, fontSize: '1.1rem', '&:hover': { bgcolor: '#20BA5A', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)' } }} href="https://wa.me/2348001234567" target="_blank">
            Order on WhatsApp
          </Button>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8F6F2' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <AccessTime sx={{ fontSize: 48, color: '#C6A75E', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 2 }}>
                  Opening Hours
                </Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>Mon - Sat: 8:00 AM - 10:00 PM</Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>Sunday: 10:00 AM - 8:00 PM</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Phone sx={{ fontSize: 48, color: '#C6A75E', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 2 }}>
                  Contact Us
                </Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>+234 9167071094</Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>food@godsowngroup.com</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <LocationOn sx={{ fontSize: 48, color: '#C6A75E', mb: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 2 }}>
                  Location
                </Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>123 Gourmet Street</Typography>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>Victoria Island, Lagos</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Dialog open={orderDialog} onClose={() => setOrderDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>
          Your Order
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2 }}>
              Cart Items
            </Typography>
            {cart.map((item) => (
              <Box key={item._id} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, p: 2, bgcolor: '#F8F6F2', borderRadius: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
                    {item.name}
                  </Typography>
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#C6A75E' }}>
                    ₦{item.price.toLocaleString()} each
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button size="small" onClick={() => updateQuantity(item._id, item.quantity - 1)} sx={{ minWidth: 32, color: '#C6A75E' }}>-</Button>
                  <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, minWidth: 32, textAlign: 'center' }}>{item.quantity}</Typography>
                  <Button size="small" onClick={() => updateQuantity(item._id, item.quantity + 1)} sx={{ minWidth: 32, color: '#C6A75E' }}>+</Button>
                </Box>
                <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E', minWidth: 100, textAlign: 'right' }}>
                  ₦{(item.price * item.quantity).toLocaleString()}
                </Typography>
              </Box>
            ))}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button variant="outlined" size="small" onClick={() => setOrderDialog(false)} sx={{ borderColor: '#C6A75E', color: '#C6A75E' }}>
                Add More Items
              </Button>
            </Box>
            <Box sx={{ bgcolor: '#F8F6F2', p: 2, borderRadius: 2, mb: 3 }}>
              <Typography sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#3B2A1E' }}>
                Total: ₦{getTotalAmount().toLocaleString()}
              </Typography>
            </Box>
            <TextField fullWidth label="Your Name" required value={orderForm.customerName} onChange={(e) => setOrderForm({ ...orderForm, customerName: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone Number" required value={orderForm.phone} onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Delivery Address" required value={orderForm.address} onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth select label="Payment Method" value={orderForm.paymentMethod} onChange={(e) => setOrderForm({ ...orderForm, paymentMethod: e.target.value })} sx={{ mb: 2 }}>
              <MenuItem value="whatsapp">Order via WhatsApp</MenuItem>
              <MenuItem value="online">Pay Online Now</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOrderDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
            Cancel
          </Button>
          {orderForm.paymentMethod === 'whatsapp' ? (
            <Button variant="contained" onClick={handleOrderSubmit} startIcon={<WhatsApp />} sx={{ bgcolor: '#25D366', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#20BA5A' } }}>
              Order via WhatsApp
            </Button>
          ) : (
            <Button variant="contained" onClick={handleOrderSubmit} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
              Proceed to Payment
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FoodPage
