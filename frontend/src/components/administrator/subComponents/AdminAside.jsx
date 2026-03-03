import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton, Box, Tooltip } from '@mui/material'
import { Dashboard, Restaurant, Hotel, Business, Person, Event, ShoppingCart, People, Settings, Analytics } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

function AdminAside({ open, onClose, collapsed, isMobile }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { text: 'Food Items', icon: <Restaurant />, path: '/admin/food' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
    { text: 'Rooms', icon: <Hotel />, path: '/admin/rooms' },
    { text: 'Bookings', icon: <Event />, path: '/admin/bookings' },
    { text: 'Guests', icon: <People />, path: '/admin/guests' },
    { text: 'Staff', icon: <Person />, path: '/admin/staff' },
    { text: 'Properties', icon: <Business />, path: '/admin/properties' },
    { text: 'Profiles', icon: <Person />, path: '/admin/profiles' },
    { text: 'Events', icon: <Event />, path: '/admin/events' },
    { text: 'Analytics', icon: <Analytics />, path: '/admin/analytics' },
    { text: 'System Settings', icon: <Settings />, path: '/admin/settings' },
  ]

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) onClose()
  }

  const drawerContent = (
    <Box sx={{ pt: 8 }}>
      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Tooltip key={item.text} title={collapsed && !isMobile ? item.text : ''} placement="right">
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: collapsed && !isMobile ? 'center' : 'initial',
                    px: 2.5,
                    bgcolor: isActive ? 'rgba(198,167,94,0.1)' : 'transparent',
                    borderRight: isActive ? '4px solid #C6A75E' : 'none',
                    '&:hover': {
                      bgcolor: 'rgba(198,167,94,0.05)',
                    }
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: collapsed && !isMobile ? 'auto' : 3,
                      justifyContent: 'center',
                      color: isActive ? '#C6A75E' : '#718096'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {(!collapsed || isMobile) && (
                    <ListItemText 
                      primary={item.text} 
                      sx={{ 
                        opacity: collapsed && !isMobile ? 0 : 1,
                        color: isActive ? '#C6A75E' : '#2d3748',
                        '& .MuiTypography-root': { fontWeight: isActive ? 600 : 400, fontFamily: "'Poppins', sans-serif" }
                      }} 
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          )
        })}
      </List>
    </Box>
  )

  if (isMobile) {
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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 72 : 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 72 : 240,
          boxSizing: 'border-box',
          borderRight: '1px solid #e2e8f0',
          transition: 'width 0.3s ease',
          overflowX: 'hidden'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default AdminAside
