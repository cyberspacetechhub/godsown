import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Box, AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem } from '@mui/material'
import { Menu as MenuIcon, Logout } from '@mui/icons-material'
import StaffAside from './StaffAside'

function StaffLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const navigate = useNavigate()

  const staffData = JSON.parse(localStorage.getItem('staffData') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('staffToken')
    localStorage.removeItem('staffData')
    navigate('/staff/login')
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: 1201, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setDrawerOpen(!drawerOpen)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
            Staff Portal - {staffData.department === 'hotel' ? 'Hotel' : 'Restaurant'}
          </Typography>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Avatar sx={{ bgcolor: '#C6A75E' }}>{staffData.name?.charAt(0)}</Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <StaffAside open={drawerOpen} onClose={() => setDrawerOpen(false)} department={staffData.department} />

      <Box component="main" sx={{ flexGrow: 1, mt: 8, p: 3, bgcolor: '#F8F6F2', minHeight: 'calc(100vh - 64px)' }}>
        <Outlet />
      </Box>
    </Box>
  )
}

export default StaffLayout
