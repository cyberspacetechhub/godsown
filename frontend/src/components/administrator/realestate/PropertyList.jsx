import { useQuery } from 'react-query'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Chip, CircularProgress, Box, Typography, Avatar } from '@mui/material'
import { Edit, Delete, Business } from '@mui/icons-material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function PropertyList({ onEdit, onDelete }) {
  const fetchData = useFetch()
  const { auth } = useAuth()

  const { data: properties, isLoading } = useQuery('properties', () =>
    fetchData('/properties', auth.token)
  )

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>

  const propertiesList = properties?.data?.data || properties || []

  const getStatusColor = (status) => {
    const colors = { available: '#10b981', sold: '#ef4444', rented: '#f59e0b' }
    return colors[status] || '#6b7280'
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Properties
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Title</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Location</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Type</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Price</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Status</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Agent</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {propertiesList.map((property) => (
              <TableRow key={property._id} sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>{property.title}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{property.location}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', textTransform: 'capitalize' }}>{property.propertyType}</TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>₦{property.price.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={property.status} 
                    size="small" 
                    sx={{ 
                      bgcolor: getStatusColor(property.status),
                      color: 'white',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{property.agent?.name || 'N/A'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(property)} sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#F8F6F2' } }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(property)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#F8F6F2' } }}>
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

export default PropertyList
