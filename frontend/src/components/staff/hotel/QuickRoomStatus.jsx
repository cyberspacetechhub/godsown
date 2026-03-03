import { useQuery } from 'react-query'
import { Box, Typography, Grid, Card, CardContent, Chip, CircularProgress } from '@mui/material'
import { Hotel, CheckCircle, Cancel, Build } from '@mui/icons-material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function QuickRoomStatus() {
  const fetchData = useFetch()
  const { auth } = useAuth()

  const { data, isLoading, error } = useQuery('quick-room-status', () => 
    fetchData('/rooms', auth.token)
  )

  if (isLoading) return <CircularProgress size={24} />
  if (error) return <Typography color="error" variant="caption">Error loading rooms</Typography>

  const roomTypes = data?.data?.data || []

  // Group rooms by type and status
  const roomStats = roomTypes.reduce((acc, roomType) => {
    if (!acc[roomType.roomType]) {
      acc[roomType.roomType] = { available: 0, occupied: 0, total: 0 }
    }
    
    roomType.roomNumbers?.forEach(room => {
      if (room.isAvailable) {
        acc[roomType.roomType].available++
      } else {
        acc[roomType.roomType].occupied++
      }
      acc[roomType.roomType].total++
    })
    
    return acc
  }, {})

  const totalStats = roomTypes.reduce((acc, roomType) => {
    roomType.roomNumbers?.forEach(room => {
      if (room.isAvailable) {
        acc.available++
      } else {
        acc.occupied++
      }
      acc.total++
    })
    return acc
  }, { available: 0, occupied: 0, total: 0 })

  const getStatusIcon = (status) => {
    const icons = {
      available: <CheckCircle sx={{ color: '#10b981', fontSize: 16 }} />,
      occupied: <Cancel sx={{ color: '#ef4444', fontSize: 16 }} />
    }
    return icons[status]
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2 }}>
        Room Status Overview
      </Typography>

      {/* Overall Stats */}
      <Card sx={{ mb: 2, borderRadius: 2, border: '1px solid #F0F0F0' }}>
        <CardContent sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Hotel sx={{ color: '#C6A75E', mr: 1 }} />
              <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
                Total Rooms: {totalStats.total}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip 
                icon={getStatusIcon('available')}
                label={totalStats.available || 0}
                size="small" 
                sx={{ bgcolor: '#10b981', color: 'white', fontFamily: "'Poppins', sans-serif", fontSize: '0.75rem' }} 
              />
              <Chip 
                icon={getStatusIcon('occupied')}
                label={totalStats.occupied || 0}
                size="small" 
                sx={{ bgcolor: '#ef4444', color: 'white', fontFamily: "'Poppins', sans-serif", fontSize: '0.75rem' }} 
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* By Room Type */}
      <Grid container spacing={1}>
        {Object.entries(roomStats).map(([roomType, stats]) => (
          <Grid item xs={12} key={roomType}>
            <Card sx={{ borderRadius: 2, border: '1px solid #F0F0F0' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle2" sx={{ 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 600, 
                    color: '#3B2A1E',
                    textTransform: 'capitalize'
                  }}>
                    {roomType} ({stats.total})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Chip 
                      label={stats.available}
                      size="small" 
                      sx={{ 
                        bgcolor: '#10b981', 
                        color: 'white', 
                        fontFamily: "'Poppins', sans-serif", 
                        fontSize: '0.7rem',
                        height: 20,
                        minWidth: 24
                      }} 
                    />
                    <Chip 
                      label={stats.occupied}
                      size="small" 
                      sx={{ 
                        bgcolor: '#ef4444', 
                        color: 'white', 
                        fontFamily: "'Poppins', sans-serif", 
                        fontSize: '0.7rem',
                        height: 20,
                        minWidth: 24
                      }} 
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {getStatusIcon('available')}
          <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Available</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {getStatusIcon('occupied')}
          <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Occupied</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default QuickRoomStatus