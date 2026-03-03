import { useQuery } from 'react-query'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Box, Typography, Avatar } from '@mui/material'
import { Edit, Delete, Event } from '@mui/icons-material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function EventList({ onEdit, onDelete }) {
  const fetchData = useFetch()
  const { auth } = useAuth()

  const { data: events, isLoading } = useQuery('events', () =>
    fetchData('/events', auth.token)
  )

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>

  const eventsList = Array.isArray(events?.data?.data) ? events.data.data : Array.isArray(events?.data) ? events.data : []

  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Events
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Title</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Date</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Location</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Description</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {eventsList.map((event) => (
              <TableRow key={event._id} sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>{event.title}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{new Date(event.date).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{event.location}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{event.description?.substring(0, 50)}...</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(event)} sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#F8F6F2' } }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(event)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#F8F6F2' } }}>
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

export default EventList
