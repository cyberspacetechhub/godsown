import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import RoomList from './RoomList'
import CreateRoom from './CreateRoom'
import UpdateRoom from './UpdateRoom'
import DeleteRoom from './DeleteRoom'
import RoomStatusDashboard from './RoomStatusDashboard'
import WiFiManagement from './WiFiManagement'

function RoomManagement() {
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [tabValue, setTabValue] = useState(0)

  const handleCreate = () => {
    setCreateOpen(true)
  }

  const handleEdit = (room) => {
    setSelectedRoom(room)
    setUpdateOpen(true)
  }

  const handleDelete = (room) => {
    setSelectedRoom(room)
    setDeleteOpen(true)
  }

  return (
    <Box>
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tab label="All Rooms" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
        <Tab label="Room Status Dashboard" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
        <Tab label="WiFi Management" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }} />
      </Tabs>
      
      {tabValue === 0 && (
        <RoomList onEdit={handleEdit} onCreate={handleCreate} onDelete={handleDelete} />
      )}
      {tabValue === 1 && (
        <RoomStatusDashboard />
      )}
      {tabValue === 2 && (
        <WiFiManagement />
      )}
      
      <CreateRoom open={createOpen} onClose={() => setCreateOpen(false)} />
      <UpdateRoom open={updateOpen} onClose={() => setUpdateOpen(false)} room={selectedRoom} />
      <DeleteRoom open={deleteOpen} onClose={() => setDeleteOpen(false)} room={selectedRoom} />
    </Box>
  )
}

export default RoomManagement
