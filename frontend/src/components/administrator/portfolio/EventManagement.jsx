import { useState } from 'react'
import { Button, Box } from '@mui/material'
import { Add } from '@mui/icons-material'
import EventList from './EventList'
import CreateEvent from './CreateEvent'
import UpdateEvent from './UpdateEvent'
import DeleteEvent from './DeleteEvent'

function EventManagement() {
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleEdit = (event) => {
    setSelectedEvent(event)
    setUpdateOpen(true)
  }

  const handleDelete = (event) => {
    setSelectedEvent(event)
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
          Add Event
        </Button>
      </Box>

      <EventList onEdit={handleEdit} onDelete={handleDelete} />

      <CreateEvent open={createOpen} onClose={() => setCreateOpen(false)} />
      {selectedEvent && (
        <>
          <UpdateEvent open={updateOpen} onClose={() => setUpdateOpen(false)} event={selectedEvent} />
          <DeleteEvent open={deleteOpen} onClose={() => setDeleteOpen(false)} event={selectedEvent} />
        </>
      )}
    </Box>
  )
}

export default EventManagement
