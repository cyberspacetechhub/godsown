import { useState } from 'react'
import { Button, Box } from '@mui/material'
import { Add } from '@mui/icons-material'
import ProfileList from './ProfileList'
import CreateProfile from './CreateProfile'
import UpdateProfile from './UpdateProfile'
import DeleteProfile from './DeleteProfile'

function ProfileManagement() {
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState(null)

  const handleEdit = (profile) => {
    setSelectedProfile(profile)
    setUpdateOpen(true)
  }

  const handleDelete = (profile) => {
    setSelectedProfile(profile)
    setDeleteOpen(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setCreateOpen(true)}
          sx={{ 
            bgcolor: '#C6A75E',
            color: '#3B2A1E',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600,
            '&:hover': { bgcolor: '#B89650' }
          }}
        >
          Add Profile
        </Button>
      </Box>

      <ProfileList onEdit={handleEdit} onDelete={handleDelete} />

      <CreateProfile open={createOpen} onClose={() => setCreateOpen(false)} />
      {selectedProfile && (
        <>
          <UpdateProfile open={updateOpen} onClose={() => setUpdateOpen(false)} profile={selectedProfile} />
          <DeleteProfile open={deleteOpen} onClose={() => setDeleteOpen(false)} profile={selectedProfile} />
        </>
      )}
    </Box>
  )
}

export default ProfileManagement
