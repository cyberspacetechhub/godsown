import { AppBar, Toolbar, Typography, IconButton, Box, Avatar } from '@mui/material'
import { Menu as MenuIcon, Logout, ChevronLeft } from '@mui/icons-material'
import useAuth from '../../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function AdminHeader({ onMenuClick, sidebarCollapsed }) {
  const { auth, setAuth, setPersist } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setAuth({ user: null, token: '' })
    setPersist(false)
    localStorage.removeItem('user')
    localStorage.removeItem('persist')
    navigate('/admin/login')
  }

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: '#3B2A1E',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar>
        <IconButton 
          edge="start" 
          color="inherit" 
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          {sidebarCollapsed ? <MenuIcon /> : <ChevronLeft />}
        </IconButton>
        
        <Typography variant="h6" sx={{ flexGrow: 1, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#F8F6F2' }}>
          Godsown Group Admin
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#C6A75E', color: '#3B2A1E', fontWeight: 600 }}>
              {auth?.user?.name?.charAt(0)}
            </Avatar>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500, color: '#F8F6F2' }}>{auth?.user?.name}</Typography>
          </Box>
          <IconButton color="inherit" onClick={handleLogout} sx={{ '&:hover': { bgcolor: 'rgba(198,167,94,0.2)' } }}>
            <Logout />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default AdminHeader
