import { Box, Container, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ErrorOutline } from '@mui/icons-material'

function NotFound() {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8F6F2' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <ErrorOutline sx={{ fontSize: 120, color: '#C6A75E', mb: 3 }} />
        <Typography variant="h1" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 700, color: '#3B2A1E', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 600, color: '#222222', mb: 3 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', fontSize: '1.1rem', mb: 4 }}>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button variant="contained" size="large" onClick={() => navigate('/')} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 5, py: 2, borderRadius: 2, '&:hover': { bgcolor: '#B89650' } }}>
          Go Home
        </Button>
      </Container>
    </Box>
  )
}

export default NotFound
