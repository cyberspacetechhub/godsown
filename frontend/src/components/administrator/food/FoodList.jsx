import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, CircularProgress, Typography, Box, Chip, Avatar, Switch } from '@mui/material'
import { Edit, Delete, Add, Restaurant } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function FoodList({ onEdit, onCreate, onDelete }) {
  const fetchData = useFetch()
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery('foods', () => 
    fetchData('/foods', auth.token)
  )

  const toggleAvailabilityMutation = useMutation(
    ({ foodId, isAvailable }) => updateData(`/foods/${foodId}`, { isAvailable }, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('foods')
        toast.success('Food availability updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update availability')
      }
    }
  )

  const handleAvailabilityToggle = (food) => {
    toggleAvailabilityMutation.mutate({
      foodId: food._id,
      isAvailable: !food.isAvailable
    })
  }

  const foods = data?.data?.data || []

  const getCategoryColor = (category) => {
    const colors = {
      'combo deals': '#f59e0b',
      'soft drink': '#3b82f6',
      'protein': '#ef4444',
      'rice': '#10b981',
      'soup': '#8b5cf6'
    }
    return colors[category] || '#6b7280'
  }

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Typography color="error">Error loading foods</Typography>

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E' }}>
          Food Items
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
          Add Food Item
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Name</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Category</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Price</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Available</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Sales</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foods.map((food) => (
              <TableRow key={food._id} sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>{food.name}</TableCell>
                <TableCell>
                  <Chip 
                    label={food.category} 
                    size="small" 
                    sx={{ 
                      bgcolor: getCategoryColor(food.category),
                      color: 'white',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }} 
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#C6A75E' }}>₦{food.price}</TableCell>
                <TableCell>
                  <Switch
                    checked={food.isAvailable !== false}
                    onChange={() => handleAvailabilityToggle(food)}
                    disabled={toggleAvailabilityMutation.isLoading}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4caf50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4caf50',
                      },
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                  {food.totalSold || 0} sold
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => onEdit(food)} sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#F8F6F2' } }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => onDelete(food)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#F8F6F2' } }}>
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

export default FoodList
