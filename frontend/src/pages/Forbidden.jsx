import { Box, Container, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Block } from '@mui/icons-material'

function Forbidden() {
  const navigate = useNavigate()

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8F6F2' }}>
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Block sx={{ fontSize: 120, color: '#ef4444', mb: 3 }} />
        <Typography variant="h1" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '4rem', md: '6rem' }, fontWeight: 700, color: '#3B2A1E', mb: 2 }}>
          403
        </Typography>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 600, color: '#222222', mb: 3 }}>
          Access Forbidden
        </Typography>
        <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', fontSize: '1.1rem', mb: 4 }}>
          You don't have permission to access this resource.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button variant="contained" size="large" onClick={() => navigate('/')} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 4, py: 2, borderRadius: 2, '&:hover': { bgcolor: '#B89650' } }}>
            Go Home
          </Button>
          <Button variant="outlined" size="large" onClick={() => navigate(-1)} sx={{ borderColor: '#C6A75E', color: '#C6A75E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 4, py: 2, borderRadius: 2, '&:hover': { borderColor: '#B89650', bgcolor: 'rgba(198, 167, 94, 0.1)' } }}>
            Go Back
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default Forbidden
