import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Alert, Box } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function UpdateProperty({ open, onClose, property }) {
  const [imageFiles, setImageFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      ...property,
      agentName: property?.agent?.name,
      agentEmail: property?.agent?.email,
      agentPhone: property?.agent?.phone
    }
  })
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (data) => {
      let imageUrls = property.imageUrls || []
      
      if (imageFiles.length > 0) {
        setUploading(true)
        for (const file of imageFiles) {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('folder', 'properties')

          const uploadResponse = await fetch('/api/upload/single', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${auth.token}`,
              'x-api-key': 'multiservice_api_key_2024_secure'
            },
            body: formData
          })

          const uploadData = await uploadResponse.json()
          imageUrls.push(uploadData.url)
        }
        setUploading(false)
      }

      const propertyData = {
        ...data,
        imageUrls,
        agent: {
          name: data.agentName,
          email: data.agentEmail,
          phone: data.agentPhone
        }
      }
      delete propertyData.agentName
      delete propertyData.agentEmail
      delete propertyData.agentPhone

      return updateData(`/properties/${property._id}`, propertyData, auth.token)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('properties')
        setImageFiles([])
        onClose()
      }
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  const propertyTypes = ['apartment', 'house', 'land', 'commercial']
  const statuses = ['available', 'sold', 'rented']

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Edit Property</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
          {mutation.isError && (
            <Alert severity="error" className="mb-4">
              {mutation.error?.message || 'Operation failed'}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Title"
            margin="normal"
            {...register('title', { required: 'Title is required' })}
            error={!!errors.title}
            helperText={errors.title?.message}
          />

          <TextField
            fullWidth
            label="Location"
            margin="normal"
            {...register('location', { required: 'Location is required' })}
            error={!!errors.location}
            helperText={errors.location?.message}
          />

          <TextField
            fullWidth
            select
            label="Property Type"
            margin="normal"
            defaultValue={property?.propertyType}
            {...register('propertyType', { required: 'Property type is required' })}
            error={!!errors.propertyType}
            helperText={errors.propertyType?.message}
          >
            {propertyTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
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
            select
            label="Status"
            margin="normal"
            defaultValue={property?.status}
            {...register('status')}
          >
            {statuses.map((status) => (
              <MenuItem key={status} value={status}>{status}</MenuItem>
            ))}
          </TextField>

          <TextField fullWidth label="Description" multiline rows={3} margin="normal" {...register('description')} />
          <TextField fullWidth label="Agent Name" margin="normal" {...register('agentName')} />
          <TextField fullWidth label="Agent Email" margin="normal" {...register('agentEmail')} />
          <TextField fullWidth label="Agent Phone" margin="normal" {...register('agentPhone')} />

          <Box className="mt-4">
            <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth>
              Add More Images
              <input type="file" hidden accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files))} />
            </Button>
            {imageFiles.length > 0 && <p className="text-sm mt-2">{imageFiles.length} new file(s) selected</p>}
            {imageFiles.length === 0 && property?.imageUrls?.length > 0 && (
              <p className="text-sm mt-2">{property.imageUrls.length} existing image(s)</p>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isLoading || uploading} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
            {uploading ? 'Uploading...' : mutation.isLoading ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default UpdateProperty
