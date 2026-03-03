import { Box, Container, Grid, Typography, IconButton, Divider } from '@mui/material'
import { Facebook, Instagram, YouTube, WhatsApp, KeyboardArrowUp } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Box sx={{ bgcolor: '#222222', color: '#F8F6F2', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                color: '#C6A75E',
                mb: 2,
                fontWeight: 700
              }}
            >
              Godsown Group
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                lineHeight: 1.8,
                color: '#B0B0B0'
              }}
            >
              Excellence in hospitality, culinary arts, real estate solutions, and gospel ministry. Serving with integrity and faith.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2
              }}
            >
              Quick Links
            </Typography>
            {['Home', 'Hotel', 'Food & Baking', 'Real Estate', 'Ministry', 'Contact'].map((item) => (
              <Box
                key={item}
                component={Link}
                to={`/${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                sx={{
                  display: 'block',
                  color: '#B0B0B0',
                  textDecoration: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.875rem',
                  mb: 1,
                  transition: 'color 0.3s',
                  '&:hover': {
                    color: '#C6A75E'
                  }
                }}
              >
                {item}
              </Box>
            ))}
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2
              }}
            >
              Contact Info
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#B0B0B0', mb: 1 }}>
              123 Excellence Boulevard, Lagos, Nigeria
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#B0B0B0', mb: 1 }}>
              Phone: +234 800 123 4567
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#B0B0B0', mb: 1 }}>
              Email: info@godsowngroup.com
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#B0B0B0' }}>
              Mon - Sun: 24/7 Service
            </Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Poppins', sans-serif",
                fontSize: '1rem',
                fontWeight: 600,
                mb: 2
              }}
            >
              Follow Us
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: <Instagram />, link: '#' },
                { icon: <Facebook />, link: '#' },
                { icon: <YouTube />, link: '#' },
                { icon: <WhatsApp />, link: '#' }
              ].map((social, index) => (
                <IconButton
                  key={index}
                  href={social.link}
                  sx={{
                    color: '#B0B0B0',
                    border: '1px solid #444',
                    borderRadius: 1,
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: '#C6A75E',
                      borderColor: '#C6A75E',
                      transform: 'translateY(-3px)'
                    }
                  }}
                >
                  {social.icon}
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: '#C6A75E', opacity: 0.3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontFamily: "'Poppins', sans-serif",
              color: '#B0B0B0',
              fontSize: '0.875rem'
            }}
          >
            © {new Date().getFullYear()} Godsown Group. All rights reserved.
          </Typography>
          <IconButton
            onClick={scrollToTop}
            sx={{
              bgcolor: '#C6A75E',
              color: '#222222',
              '&:hover': {
                bgcolor: '#B89650',
                transform: 'translateY(-3px)'
              },
              transition: 'all 0.3s'
            }}
          >
            <KeyboardArrowUp />
          </IconButton>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer
