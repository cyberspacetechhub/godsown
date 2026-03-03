import { useState } from 'react'
import { AppBar, Toolbar, Box, Button, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { Menu as MenuIcon, Close } from '@mui/icons-material'
import { Link } from 'react-router-dom'

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Hotel', path: '/hotel' },
    { label: 'Food & Baking', path: '/food' },
    { label: 'Real Estate', path: '/real-estate' },
    { label: 'Ministry', path: '/ministry' },
    { label: 'Contact', path: '/contact' }
  ]

  return (
    <>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          bgcolor: '#3B2A1E',
          borderBottom: '1px solid rgba(198, 167, 94, 0.1)'
        }}
      >
        <Toolbar sx={{ py: 1, px: { xs: 2, md: 6 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box 
              component={Link} 
              to="/" 
              sx={{ 
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '1.5rem', md: '2rem' },
                fontWeight: 700,
                color: '#C6A75E',
                textDecoration: 'none',
                letterSpacing: '0.5px'
              }}
            >
              Godsown Group
            </Box>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
            {navItems.map((item) => (
              <Box
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  color: '#F8F6F2',
                  textDecoration: 'none',
                  fontFamily: "'Poppins', sans-serif",
                  fontSize: '0.95rem',
                  fontWeight: 400,
                  position: 'relative',
                  transition: 'color 0.3s',
                  '&:hover': {
                    color: '#C6A75E'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: 0,
                    width: 0,
                    height: '2px',
                    bgcolor: '#C6A75E',
                    transition: 'width 0.3s'
                  },
                  '&:hover::after': {
                    width: '100%'
                  }
                }}
              >
                {item.label}
              </Box>
            ))}
            <Button
              variant="contained"
              sx={{
                bgcolor: '#C6A75E',
                color: '#3B2A1E',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#B89650',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(198, 167, 94, 0.3)'
                },
                transition: 'all 0.3s'
              }}
            >
              Book Now
            </Button>
          </Box>

          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, color: '#F8F6F2' }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: '#3B2A1E',
            color: '#F8F6F2'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#F8F6F2' }}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton 
                component={Link} 
                to={item.path}
                onClick={() => setMobileOpen(false)}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(198, 167, 94, 0.1)'
                  }
                }}
              >
                <ListItemText 
                  primary={item.label}
                  sx={{
                    '& .MuiTypography-root': {
                      fontFamily: "'Poppins', sans-serif"
                    }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#C6A75E',
                color: '#3B2A1E',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                '&:hover': {
                  bgcolor: '#B89650'
                }
              }}
            >
              Book Now
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}

export default Header
