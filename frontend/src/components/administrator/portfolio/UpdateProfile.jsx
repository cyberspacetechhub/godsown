import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Alert, Box } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function UpdateProfile({ open, onClose, profile }) {
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: profile?.name,
      biography: profile?.biography,
      facebook: profile?.socialLinks?.facebook,
      instagram: profile?.socialLinks?.instagram,
      twitter: profile?.socialLinks?.twitter,
      youtube: profile?.socialLinks?.youtube,
      website: profile?.socialLinks?.website
    }
  })
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation(
    async (data) => {
      let imageUrl = profile.imageUrl
      
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

      return updateData(`/profiles/${profile._id}`, profileData, auth.token)
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profiles')
        setImageFile(null)
        onClose()
      }
    }
  )

  const onSubmit = (data) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, color: '#3B2A1E' }}>Edit Profile</DialogTitle>
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
              Change Image
              <input type="file" hidden accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </Button>
            {imageFile && <p className="text-sm mt-2">{imageFile.name}</p>}
            {!imageFile && profile?.imageUrl && <p className="text-sm mt-2">Current image uploaded</p>}
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

export default UpdateProfile
