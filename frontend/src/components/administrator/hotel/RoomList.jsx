import { useQuery } from 'react-query'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, CircularProgress, Typography, Chip, Box, Avatar } from '@mui/material'
import { Edit, Delete, Add, Hotel } from '@mui/icons-material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function RoomList({ onEdit, onCreate, onDelete }) {
  const fetchData = useFetch()
  const { auth } = useAuth()

  const { data, isLoading, error } = useQuery('roomTypes', () => 
    fetchData('/rooms', auth.token)
  )

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Typography color="error">Error loading room types</Typography>

  const roomTypes = data?.data?.data || []

  const getAvailableRooms = (roomNumbers) => {
    return roomNumbers.filter(room => room.isAvailable).length
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E' }}>
          Room Types
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={onCreate}
          sx={{ 
            bgcolor: '#C6A75E',
            color: '#3B2A1E',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            '&:hover': { bgcolor: '#B89650' }
          }}
        >
          Add Room
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Room Type</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Room Numbers</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Price/Night</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Capacity</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Available</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {roomTypes.map((roomType) => (
              <TableRow key={roomType._id} sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>{roomType.roomType}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                  {roomType.roomNumbers.map(room => room.number).join(', ')}
                </TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>₦{roomType.pricePerNight}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{roomType.capacity} guests</TableCell>
                <TableCell>
                  <Chip 
                    label={`${getAvailableRooms(roomType.roomNumbers)}/${roomType.roomNumbers.length} available`}
                    size="small" 
                    sx={{ 
                      bgcolor: getAvailableRooms(roomType.roomNumbers) > 0 ? '#10b981' : '#ef4444',
                      color: 'white',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600
                    }} 
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(roomType)} sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#F8F6F2' } }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(roomType)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#F8F6F2' } }}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default RoomList
