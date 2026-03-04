import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert, Box, FormControlLabel, Switch } from '@mui/material'
import { CloudUpload, Star } from '@mui/icons-material'
import usePost from '../../../hooks/usePost'
import useAuth from '../../../hooks/useAuth'

function CreateFood({ open, onClose }) {
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const postData = usePost()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (data) => {
      let imageUrl = ''
      
      if (imageFile) {
        setUploading(true)
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('folder', 'food')

        const uploadResponse = await fetch('/upload/single', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'x-api-key': 'multiservice_api_key_2024_secure'
          },
          body: formData
        })

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
        setUploading(false)
      }

      return postData('/foods', { ...data, image: imageUrl }, auth.token)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('foods')
        reset()
        setImageFile(null)
        onClose()
      }
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  const categories = ['combo deals', 'soft drink', 'protein', 'rice', 'soup']

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Add Food Item</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {mutation.isError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            select
            label="Category"
            margin="normal"
            defaultValue=""
            {...register('category', { required: 'Category is required' })}
            error={!!errors.category}
            helperText={errors.category?.message}
            sx={{ mb: 2 }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat} sx={{ textTransform: 'capitalize' }}>{cat}</MenuItem>
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
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            margin="normal"
            {...register('description')}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                {...register('isFeatured')}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#C6A75E',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#C6A75E',
                  },
                }}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Star sx={{ color: '#C6A75E' }} />
                <span>Featured Dish</span>
              </Box>
            }
            sx={{ mb: 2 }}
          />

          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{ 
                py: 1.5,
                borderRadius: 2,
                borderColor: '#e2e8f0',
                color: '#4a5568',
                '&:hover': { borderColor: '#cbd5e0', bgcolor: '#f7fafc' }
              }}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </Button>
            {imageFile && <Box sx={{ mt: 1, p: 1, bgcolor: '#f0fdf4', borderRadius: 1, color: '#15803d', fontSize: '0.875rem' }}>{imageFile.name}</Box>}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={mutation.isLoading || uploading}
            sx={{ 
              bgcolor: '#C6A75E',
              color: '#3B2A1E',
              fontFamily: "'Poppins', sans-serif",
              fontWeight: 600,
              px: 3,
              '&:hover': { bgcolor: '#B89650' }
            }}
          >
            {uploading ? 'Uploading...' : mutation.isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateFood
