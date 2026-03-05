import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import AdminHeader from './AdminHeader'
import AdminAside from './AdminAside'

function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F6F2', position: 'relative' }}>
      <AdminHeader 
        onMenuClick={() => isMobile ? setDrawerOpen(true) : setSidebarCollapsed(!sidebarCollapsed)} 
        sidebarCollapsed={sidebarCollapsed}
      />
      <AdminAside 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)} 
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
      />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          mt: 8,
          ml: isMobile ? 0 : (sidebarCollapsed ? 0 : 0),
          transition: 'margin-left 0.3s ease',
          maxWidth: '100%',
          px: 0,
          pt: 2.5,
          pb: 5,
          overflow: 'hidden'
        }}
      >
        <Box sx={{ mx: 'auto', maxWidth: '1280px' }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AdminLayout
