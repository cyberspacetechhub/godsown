import { useState } from 'react'
import { useQuery } from 'react-query'
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, TextField, MenuItem, Chip, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { LocationOn, Bed, Bathtub, SquareFoot, WhatsApp } from '@mui/icons-material'
import usePublicFetch from '../../hooks/usePublicFetch'

function RealEstatePage() {
  const [filters, setFilters] = useState({ location: '', priceRange: '', propertyType: '' })
  const [inquiryDialog, setInquiryDialog] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [inquiryForm, setInquiryForm] = useState({ name: '', phone: '', email: '', interestedIn: 'buy', message: '', contactMethod: 'whatsapp' })

  const fetchProperties = usePublicFetch()
  const { data: propertiesData, isLoading } = useQuery('properties', () => fetchProperties('/properties'))

  const properties = propertiesData?.data || []
  const availableProperties = properties.filter(p => p.status === 'available')

  const handleInquiryClick = (property) => {
    setSelectedProperty(property)
    setInquiryDialog(true)
  }

  const handleInquirySubmit = () => {
    if (!inquiryForm.name || !inquiryForm.phone || !inquiryForm.email) {
      alert('Please fill in all required fields')
      return
    }

    if (inquiryForm.contactMethod === 'whatsapp') {
      const whatsappMessage = `Hello! I'm interested in:\n\nProperty: ${selectedProperty.title}\nLocation: ${selectedProperty.location}\nPrice: ₦${selectedProperty.price.toLocaleString()}\n\nName: ${inquiryForm.name}\nPhone: ${inquiryForm.phone}\nEmail: ${inquiryForm.email}\nInterested In: ${inquiryForm.interestedIn}\nMessage: ${inquiryForm.message || 'N/A'}`
      window.open(`https://wa.me/2348001234567?text=${encodeURIComponent(whatsappMessage)}`, '_blank')
    } else {
      alert('Form submission coming soon!')
    }
    
    setInquiryDialog(false)
    setInquiryForm({ name: '', phone: '', email: '', interestedIn: 'buy', message: '', contactMethod: 'whatsapp' })
  }

  return (
    <Box>
      <Box sx={{ height: { xs: '60vh', md: '70vh' }, backgroundImage: 'linear-gradient(rgba(59, 42, 30, 0.5), rgba(59, 42, 30, 0.5)), url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, color: '#F8F6F2', mb: 2 }}>
            Trusted Property Solutions
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", color: '#C6A75E', mb: 4, fontSize: { xs: '1rem', md: '1.3rem' } }}>
            Buy, Sell & Lease Premium Properties
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 5, py: 2, borderRadius: 2, fontSize: '1.1rem', '&:hover': { bgcolor: '#B89650', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(198, 167, 94, 0.4)' } }}>
            View Listings
          </Button>
        </Container>
      </Box>

      <Box sx={{ py: 4, bgcolor: '#F8F6F2' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth select label="Location" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} sx={{ bgcolor: 'white' }}>
                <MenuItem value="">All Locations</MenuItem>
                <MenuItem value="lekki">Lekki</MenuItem>
                <MenuItem value="vi">Victoria Island</MenuItem>
                <MenuItem value="ikoyi">Ikoyi</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth select label="Price Range" value={filters.priceRange} onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })} sx={{ bgcolor: 'white' }}>
                <MenuItem value="">All Prices</MenuItem>
                <MenuItem value="low">Under ₦50M</MenuItem>
                <MenuItem value="mid">₦50M - ₦150M</MenuItem>
                <MenuItem value="high">Above ₦150M</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField fullWidth select label="Property Type" value={filters.propertyType} onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })} sx={{ bgcolor: 'white' }}>
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="apartment">Apartment</MenuItem>
                <MenuItem value="duplex">Duplex</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" fullWidth sx={{ height: '56px', bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
                Search
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Featured Properties
          </Typography>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#C6A75E' }} />
            </Box>
          ) : availableProperties.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 8, fontFamily: "'Poppins', sans-serif", color: '#666' }}>
              No properties available at the moment
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {availableProperties.map((property) => (
                <Grid item xs={12} sm={6} md={4} key={property._id}>
                  <Card sx={{ borderRadius: 3, height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 32px rgba(198, 167, 94, 0.2)' } }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia component="img" height="220" image={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'} alt={property.title} />
                      <Chip label={property.propertyType} sx={{ position: 'absolute', top: 16, right: 16, bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, textTransform: 'capitalize' }} />
                    </Box>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 1 }}>
                        {property.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                        <LocationOn sx={{ fontSize: 18, color: '#666' }} />
                        <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                          {property.location}
                        </Typography>
                      </Box>
                      <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E', mb: 2 }}>
                        ₦{property.price.toLocaleString()}
                      </Typography>
                      <Button variant="contained" fullWidth onClick={() => handleInquiryClick(property)} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8F6F2' }}>
        <Container maxWidth="md">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 3 }}>
            Property Inquiry
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', textAlign: 'center', mb: 6 }}>
            Select a property above to make an inquiry
          </Typography>
        </Container>
      </Box>

      <Dialog open={inquiryDialog} onClose={() => setInquiryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>
          Property Inquiry
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 1 }}>
              {selectedProperty?.title}
            </Typography>
            <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
              {selectedProperty?.location}
            </Typography>
            <Typography variant="h5" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E', mb: 3 }}>
              ₦{selectedProperty?.price.toLocaleString()}
            </Typography>
            <TextField fullWidth label="Full Name" required value={inquiryForm.name} onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Phone Number" required value={inquiryForm.phone} onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Email" required type="email" value={inquiryForm.email} onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth select label="Interested In" value={inquiryForm.interestedIn} onChange={(e) => setInquiryForm({ ...inquiryForm, interestedIn: e.target.value })} sx={{ mb: 2 }}>
              <MenuItem value="buy">Buying</MenuItem>
              <MenuItem value="rent">Renting</MenuItem>
              <MenuItem value="sell">Selling</MenuItem>
            </TextField>
            <TextField fullWidth label="Message" value={inquiryForm.message} onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })} multiline rows={4} sx={{ mb: 2 }} />
            <TextField fullWidth select label="Contact Method" value={inquiryForm.contactMethod} onChange={(e) => setInquiryForm({ ...inquiryForm, contactMethod: e.target.value })} sx={{ mb: 2 }}>
              <MenuItem value="whatsapp">WhatsApp</MenuItem>
              <MenuItem value="form">Submit Form</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setInquiryDialog(false)} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
            Cancel
          </Button>
          {inquiryForm.contactMethod === 'whatsapp' ? (
            <Button variant="contained" onClick={handleInquirySubmit} startIcon={<WhatsApp />} sx={{ bgcolor: '#25D366', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#20BA5A' } }}>
              Contact via WhatsApp
            </Button>
          ) : (
            <Button variant="contained" onClick={handleInquirySubmit} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
              Submit Inquiry
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RealEstatePage
