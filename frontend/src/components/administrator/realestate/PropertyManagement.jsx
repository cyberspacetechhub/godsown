import { useState } from 'react'
import { Button, Box, Paper } from '@mui/material'
import { Add } from '@mui/icons-material'
import PropertyList from './PropertyList'
import CreateProperty from './CreateProperty'
import UpdateProperty from './UpdateProperty'
import DeleteProperty from './DeleteProperty'

function PropertyManagement() {
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)

  const handleEdit = (property) => {
    setSelectedProperty(property)
    setUpdateOpen(true)
  }

  const handleDelete = (property) => {
    setSelectedProperty(property)
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
          Add Property
        </Button>
      </Box>

      <PropertyList onEdit={handleEdit} onDelete={handleDelete} />

      <CreateProperty open={createOpen} onClose={() => setCreateOpen(false)} />
      {selectedProperty && (
        <>
          <UpdateProperty open={updateOpen} onClose={() => setUpdateOpen(false)} property={selectedProperty} />
          <DeleteProperty open={deleteOpen} onClose={() => setDeleteOpen(false)} property={selectedProperty} />
        </>
      )}
    </Box>
  )
}

export default PropertyManagement
