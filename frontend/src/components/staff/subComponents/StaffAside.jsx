import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Box } from '@mui/material'
import { Dashboard, Restaurant, Hotel, ShoppingCart, Event, PersonAdd } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

function StaffAside({ open, onClose, department }) {
  const navigate = useNavigate()
  const location = useLocation()

  const hotelMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/staff/hotel' },
    { text: 'Bookings', icon: <Event />, path: '/staff/hotel/bookings' },
    { text: 'Register Guest', icon: <PersonAdd />, path: '/staff/hotel/register-guest' },
  ]

  const restaurantMenuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/staff/restaurant' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/staff/restaurant/orders' },
    { text: 'Create Order', icon: <Restaurant />, path: '/staff/restaurant/create-order' },
  ]

  const menuItems = department === 'hotel' ? hotelMenuItems : restaurantMenuItems

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  const drawerContent = (
    <Box sx={{ pt: 8 }}>
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                onClick={() => handleNavigation(item.path)}
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  bgcolor: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
                  borderRight: isActive ? '4px solid #667eea' : 'none',
                  '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#667eea' : '#718096' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    color: isActive ? '#667eea' : '#2d3748',
                    '& .MuiTypography-root': { fontWeight: isActive ? 600 : 400 }
                  }} 
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Box>
  )

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': { 
          width: 240,
          boxSizing: 'border-box',
          borderRight: '1px solid #e2e8f0'
        }
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default StaffAside
