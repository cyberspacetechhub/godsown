import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Box } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import usePost from '../../../hooks/usePost'
import useAuth from '../../../hooks/useAuth'

function CreateProfile({ open, onClose }) {
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
        formData.append('folder', 'profiles')

        const uploadResponse = await fetch('/api/upload/single', {
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

      const profileData = {
        name: data.name,
        biography: data.biography,
        imageUrl,
        socialLinks: {
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter,
          youtube: data.youtube,
          website: data.website
        }
      }

      return postData('/profiles', profileData, auth.token)
    },
    {
      onSuccess: (response) => {
        // console.log('Profile created successfully:', response)
        queryClient.invalidateQueries('profiles')
        reset()
        setImageFile(null)
        onClose()
      },
      onError: (error) => {
        console.error('Profile creation failed:', error)
      }
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Add Profile</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent sx={{ pt: 2 }}>
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

          <TextField fullWidth label="Biography" multiline rows={4} margin="normal" {...register('biography')} />
          <TextField fullWidth label="Facebook" margin="normal" {...register('facebook')} />
          <TextField fullWidth label="Instagram" margin="normal" {...register('instagram')} />
          <TextField fullWidth label="Twitter" margin="normal" {...register('twitter')} />
          <TextField fullWidth label="YouTube" margin="normal" {...register('youtube')} />
          <TextField fullWidth label="Website" margin="normal" {...register('website')} />

          <Box className="mt-4">
            <Button variant="outlined" component="label" startIcon={<CloudUpload />} fullWidth>
              Upload Image
              <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </Button>
            {imageFile && <p className="text-sm mt-2">{imageFile.name}</p>}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={mutation.isLoading || uploading} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
            {uploading ? 'Uploading...' : mutation.isLoading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default CreateProfile
