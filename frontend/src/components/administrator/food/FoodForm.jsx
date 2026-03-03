import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert } from '@mui/material'
import usePost from '../../../hooks/usePost'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function FoodForm({ open, onClose, food }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: food || {}
  })
  const postData = usePost()
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    (data) => food 
      ? updateData(`/foods/${food._id}`, data, auth.token)
      : postData('/foods', data, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('foods')
        reset()
        onClose()
      }
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  const categories = ['combo deals', 'soft drink', 'protein', 'rice', 'soup']

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{food ? 'Edit Food' : 'Add Food'}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          {mutation.isError && (
            <Alert severity="error" className="mb-4">
              {mutation.error?.message || 'Operation failed'}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Name"
            margin="normal"
            {...register('name', { required: 'Name is required' })}
            error={!!errors.name}
            helperText={errors.name?.message}
          />

          <TextField
            fullWidth
            select
            label="Category"
            margin="normal"
            defaultValue={food?.category || ''}
            {...register('category', { required: 'Category is required' })}
            error={!!errors.category}
            helperText={errors.category?.message}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Price"
            type="number"
            margin="normal"
            {...register('price', { required: 'Price is required', min: 0 })}
            error={!!errors.price}
            helperText={errors.price?.message}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            margin="normal"
            {...register('description')}
          />

          <TextField
            fullWidth
            label="Image URL"
            margin="normal"
            {...register('imageUrl')}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default FoodForm
