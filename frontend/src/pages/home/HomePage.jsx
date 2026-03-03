import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Avatar, Paper } from '@mui/material'
import { Hotel, Restaurant, Business, MusicNote, Star, WhatsApp } from '@mui/icons-material'
import Hero from './Hero'

function HomePage() {
  const services = [
    {
      icon: <Hotel sx={{ fontSize: 48, color: '#C6A75E' }} />,
      title: 'Luxury Hotel',
      description: 'Experience world-class hospitality with premium rooms, exceptional service, and unforgettable comfort.',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80'
    },
    {
      icon: <Restaurant sx={{ fontSize: 48, color: '#C6A75E' }} />,
      title: 'Food & Baking',
      description: 'Savor gourmet dishes and artisan baked goods crafted with passion and the finest ingredients.',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80'
    },
    {
      icon: <Business sx={{ fontSize: 48, color: '#C6A75E' }} />,
      title: 'Real Estate',
      description: 'Discover premium properties and investment opportunities with expert guidance and support.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'
    },
    {
      icon: <MusicNote sx={{ fontSize: 48, color: '#C6A75E' }} />,
      title: 'Gospel Ministry',
      description: 'Uplifting worship music and spiritual content that inspires faith and transforms lives.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80'
    }
  ]

  const testimonials = [
    {
      name: 'Mrs. Adebayo',
      role: 'Hotel Guest',
      text: 'The hospitality was exceptional. Every detail was perfect, from the room to the service. Truly a five-star experience.',
      rating: 5
    },
    {
      name: 'Mr. Okonkwo',
      role: 'Real Estate Client',
      text: 'Godsown Group helped me find my dream property. Professional, trustworthy, and efficient throughout the process.',
      rating: 5
    },
    {
      name: 'Pastor Williams',
      role: 'Ministry Partner',
      text: 'The gospel music ministry has been a blessing to our church. Anointed worship that touches hearts.',
      rating: 5
    }
  ]

  return (
    <Box>
      <Hero />

      {/* About Section */}
      <Box sx={{ bgcolor: '#F8F6F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#3B2A1E',
              textAlign: 'center',
              mb: 3
            }}
          >
            Welcome to Godsown Group
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: { xs: '1rem', md: '1.1rem' },
              color: '#222222',
              textAlign: 'center',
              lineHeight: 1.8,
              maxWidth: 700,
              mx: 'auto'
            }}
          >
            A multi-service organization committed to excellence in hospitality, culinary arts, real estate, and gospel ministry. 
            We blend luxury with faith, creating experiences that enrich lives and glorify God. Our mission is to serve with 
            integrity, passion, and unwavering commitment to quality.
          </Typography>
        </Container>
      </Box>

      {/* Services Section */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#3B2A1E',
              textAlign: 'center',
              mb: 8
            }}
          >
            Our Services
          </Typography>
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 32px rgba(198, 167, 94, 0.2)',
                      '& .service-icon': {
                        transform: 'scale(1.1)'
                      }
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={service.image}
                    alt={service.title}
                  />
                  <CardContent sx={{ textAlign: 'center', p: 3 }}>
                    <Box className="service-icon" sx={{ transition: 'transform 0.3s', mb: 2 }}>
                      {service.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        color: '#3B2A1E',
                        mb: 1
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontFamily: "'Poppins', sans-serif",
                        color: '#666',
                        lineHeight: 1.6
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Highlights */}
      <Box sx={{ bgcolor: '#F8F6F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#3B2A1E',
              textAlign: 'center',
              mb: 8
            }}
          >
            Featured Highlights
          </Typography>
          <Grid container spacing={3}>
            {[
              'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
              'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
            ].map((img, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Box
                  sx={{
                    height: 300,
                    borderRadius: 3,
                    overflow: 'hidden',
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#3B2A1E',
              textAlign: 'center',
              mb: 8
            }}
          >
            What Our Clients Say
          </Typography>
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    borderRadius: 3,
                    border: '1px solid #E0E0E0',
                    height: '100%',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: '#C6A75E',
                      boxShadow: '0 8px 24px rgba(198, 167, 94, 0.15)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} sx={{ color: '#C6A75E', fontSize: 20 }} />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: "'Poppins', sans-serif",
                      color: '#222222',
                      fontStyle: 'italic',
                      mb: 3,
                      lineHeight: 1.7
                    }}
                  >
                    "{testimonial.text}"
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: '#C6A75E', width: 48, height: 48 }}>
                      {testimonial.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 600,
                          color: '#3B2A1E'
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          color: '#666'
                        }}
                      >
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box sx={{ bgcolor: '#F8F6F2', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '2rem', md: '3rem' },
              fontWeight: 700,
              color: '#3B2A1E',
              textAlign: 'center',
              mb: 4
            }}
          >
            Get In Touch
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', sans-serif",
              color: '#222222',
              textAlign: 'center',
              mb: 4
            }}
          >
            Have questions? We're here to help. Reach out via WhatsApp or visit us.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Box
              component="a"
              href="https://wa.me/2348001234567"
              target="_blank"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#25D366',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: 2,
                textDecoration: 'none',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: '#20BA5A',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(37, 211, 102, 0.3)'
                }
              }}
            >
              <WhatsApp /> Chat on WhatsApp
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
