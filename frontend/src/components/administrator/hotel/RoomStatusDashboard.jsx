import { useQuery } from 'react-query'
import { Box, Typography, Grid, Card, CardContent, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material'
import { Hotel, CheckCircle, Cancel, Build } from '@mui/icons-material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function RoomStatusDashboard() {
  const fetchData = useFetch()
  const { auth } = useAuth()

  const { data, isLoading, error } = useQuery('rooms-status', () => 
    fetchData('/rooms', auth.token)
  )

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Typography color="error">Error loading room status</Typography>

  const roomTypes = data?.data?.data || []

  // Group rooms by type and status
  const roomsByType = roomTypes.reduce((acc, roomType) => {
    if (!acc[roomType.roomType]) {
      acc[roomType.roomType] = { available: [], occupied: [], maintenance: [] }
    }
    
    roomType.roomNumbers?.forEach(room => {
      const status = room.isAvailable ? 'available' : 'occupied'
      if (!acc[roomType.roomType][status]) {
        acc[roomType.roomType][status] = []
      }
      acc[roomType.roomType][status].push({
        _id: `${roomType._id}-${room.number}`,
        roomNumber: room.number,
        pricePerNight: roomType.pricePerNight,
        capacity: roomType.capacity,
        status: status,
        updatedAt: roomType.updatedAt
      })
    })
    
    return acc
  }, {})

  const getStatusIcon = (status) => {
    const icons = {
      available: <CheckCircle sx={{ color: '#10b981' }} />,
      occupied: <Cancel sx={{ color: '#ef4444' }} />
    }
    return icons[status]
  }

  const getStatusColor = (status) => {
    const colors = { available: '#10b981', occupied: '#ef4444' }
    return colors[status] || '#6b7280'
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Room Status Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {Object.entries(roomsByType).map(([roomType, statusGroups]) => {
          const total = Object.values(statusGroups).flat().length
          const available = statusGroups.available?.length || 0
          const occupied = statusGroups.occupied?.length || 0

          return (
            <Grid item xs={12} md={4} key={roomType}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', border: '1px solid #F0F0F0' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Hotel sx={{ color: '#C6A75E', mr: 1 }} />
                    <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E', textTransform: 'capitalize' }}>
                      {roomType} Rooms
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E', mb: 2 }}>
                    {total}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<CheckCircle />} 
                      label={`${available} Available`} 
                      size="small" 
                      sx={{ bgcolor: '#10b981', color: 'white', fontFamily: "'Poppins', sans-serif" }} 
                    />
                    <Chip 
                      icon={<Cancel />} 
                      label={`${occupied} Occupied`} 
                      size="small" 
                      sx={{ bgcolor: '#ef4444', color: 'white', fontFamily: "'Poppins', sans-serif" }} 
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          )
        })}
      </Grid>

      {/* Detailed Room List by Type */}
      {Object.entries(roomsByType).map(([roomType, statusGroups]) => (
        <Box key={roomType} sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 600, color: '#3B2A1E', mb: 2, textTransform: 'capitalize' }}>
            {roomType} Rooms
          </Typography>
          <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <Table>
              <TableHead sx={{ bgcolor: '#F8F6F2' }}>
                <TableRow>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Room Number</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Price/Night</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Capacity</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Status</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(statusGroups).flat().map((room) => (
                  <TableRow key={room._id} sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>
                      {room.roomNumber}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>
                      ₦{room.pricePerNight}
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      {room.capacity} guests
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(room.status)}
                        <Chip 
                          label={room.status} 
                          size="small" 
                          sx={{ 
                            bgcolor: getStatusColor(room.status),
                            color: 'white',
                            fontFamily: "'Poppins', sans-serif",
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }} 
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      {new Date(room.updatedAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Box>
  )
}

export default RoomStatusDashboard