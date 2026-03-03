import { useState } from 'react'
import { Box } from '@mui/material'
import FoodList from './FoodList'
import CreateFood from './CreateFood'
import UpdateFood from './UpdateFood'
import DeleteFood from './DeleteFood'

function FoodManagement() {
  const [createOpen, setCreateOpen] = useState(false)
  const [updateOpen, setUpdateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedFood, setSelectedFood] = useState(null)

  const handleCreate = () => {
    setCreateOpen(true)
  }

  const handleEdit = (food) => {
    setSelectedFood(food)
    setUpdateOpen(true)
  }

  const handleDelete = (food) => {
    setSelectedFood(food)
    setDeleteOpen(true)
  }

  return (
    <Box>
      <FoodList onEdit={handleEdit} onCreate={handleCreate} onDelete={handleDelete} />
      <CreateFood open={createOpen} onClose={() => setCreateOpen(false)} />
      <UpdateFood open={updateOpen} onClose={() => setUpdateOpen(false)} food={selectedFood} />
      <DeleteFood open={deleteOpen} onClose={() => setDeleteOpen(false)} food={selectedFood} />
    </Box>
  )
}

export default FoodManagement
