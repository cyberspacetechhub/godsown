import { useQuery } from 'react-query'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Box, Typography, Avatar } from '@mui/material'
import { Edit, Delete, Person } from '@mui/icons-material'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function ProfileList({ onEdit, onDelete }) {
  const fetchData = useFetch()
  const { auth } = useAuth()

  const { data: profiles, isLoading, error } = useQuery('profiles', () =>
    fetchData('/profiles', auth.token)
  )

  console.log('Profiles data:', profiles)
  console.log('Profiles loading:', isLoading)
  console.log('Profiles error:', error)

  if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
  if (error) return <Typography color="error">Error loading profiles: {error.message}</Typography>

  const profilesList = Array.isArray(profiles?.data?.data) ? profiles.data.data : []
  
  console.log('Processed profiles list:', profilesList)
  console.log('Is profilesList an array?', Array.isArray(profilesList))

  return (
    <Box>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        Profiles
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <Table>
          <TableHead sx={{ bgcolor: '#F8F6F2' }}>
            <TableRow>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Name</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Biography</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }}>Social Links</TableCell>
              <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, color: '#3B2A1E' }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(profilesList) && profilesList.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <Person sx={{ fontSize: 48, color: '#ccc' }} />
                    <Typography variant="h6" sx={{ color: '#666' }}>No profiles found</Typography>
                    <Typography variant="body2" sx={{ color: '#999' }}>Create your first profile to get started</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : Array.isArray(profilesList) ? (
              profilesList.map((profile) => (
                <TableRow key={profile._id} sx={{ '&:hover': { bgcolor: '#F8F6F2' } }}>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#222222' }}>{profile.name}</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>{profile.biography?.substring(0, 50)}...</TableCell>
                  <TableCell sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                    {Object.values(profile.socialLinks || {}).filter(Boolean).length} links
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => onEdit(profile)} sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#F8F6F2' } }}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => onDelete(profile)} sx={{ color: '#ef4444', '&:hover': { bgcolor: '#F8F6F2' } }}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                  <Typography variant="h6" sx={{ color: '#666' }}>Invalid data format</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ProfileList
