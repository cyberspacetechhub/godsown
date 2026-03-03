import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, Button, Grid } from '@mui/material'
import { Hotel, Restaurant, Home, MusicNote } from '@mui/icons-material'

function Hero() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80',
      title: 'Luxury Hotel Experience',
      subtitle: 'Where comfort meets elegance'
    },
    {
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1920&q=80',
      title: 'Gourmet Dining & Baking',
      subtitle: 'Culinary excellence in every bite'
    },
    {
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
      title: 'Premium Real Estate',
      subtitle: 'Your dream property awaits'
    },
    {
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80',
      title: 'Gospel Music Ministry',
      subtitle: 'Worship in spirit and truth'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const services = [
    { icon: <Hotel sx={{ fontSize: 40 }} />, label: 'Book Room', path: '/hotel' },
    { icon: <Restaurant sx={{ fontSize: 40 }} />, label: 'Order Food', path: '/food' },
    { icon: <Home sx={{ fontSize: 40 }} />, label: 'View Properties', path: '/real-estate' },
    { icon: <MusicNote sx={{ fontSize: 40 }} />, label: 'Listen to Music', path: '/ministry' }
  ]

  return (
    <Box sx={{ position: 'relative', height: { xs: '80vh', md: '90vh' }, overflow: 'hidden' }}>
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `linear-gradient(rgba(59, 42, 30, 0.6), rgba(59, 42, 30, 0.6)), url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1.5s ease-in-out'
          }}
        />
      ))}

      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          zIndex: 1
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: { xs: '2.5rem', md: '4.5rem' },
            fontWeight: 700,
            color: '#F8F6F2',
            mb: 2,
            textShadow: '2px 2px 8px rgba(0,0,0,0.3)',
            animation: 'fadeInUp 1s ease-out'
          }}
        >
          {slides[currentSlide].title}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: { xs: '1.1rem', md: '1.5rem' },
            color: '#C6A75E',
            mb: 6,
            fontWeight: 300,
            letterSpacing: '1px',
            animation: 'fadeInUp 1s ease-out 0.2s both'
          }}
        >
          {slides[currentSlide].subtitle}
        </Typography>

        <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 800 }}>
          {services.map((service, index) => (
            <Grid item xs={6} sm={3} key={index}>
              <Button
                variant="contained"
                startIcon={service.icon}
                onClick={() => navigate(service.path)}
                sx={{
                  bgcolor: '#C6A75E',
                  color: '#3B2A1E',
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  px: { xs: 2, md: 3 },
                  py: { xs: 1.5, md: 2 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: { xs: '0.85rem', md: '1rem' },
                  width: '100%',
                  '&:hover': {
                    bgcolor: '#B89650',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(198, 167, 94, 0.4)'
                  },
                  transition: 'all 0.3s',
                  animation: `fadeInUp 1s ease-out ${0.4 + index * 0.1}s both`
                }}
              >
                {service.label}
              </Button>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ position: 'absolute', bottom: 40, display: 'flex', gap: 1 }}>
          {slides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: currentSlide === index ? 40 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor: currentSlide === index ? '#C6A75E' : 'rgba(248, 246, 242, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </Box>
      </Container>

      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </Box>
  )
}

export default Hero
