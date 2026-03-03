import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { TextField, Button, Box, Typography, Container, Alert, Paper, Checkbox, FormControlLabel } from '@mui/material'
import { LockOutlined } from '@mui/icons-material'
import usePost from '../hooks/usePost'
import useAuth from '../hooks/useAuth'

function AdminLogin() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const postData = usePost()
  const { setAuth, persist, setPersist } = useAuth()

  const loginMutation = useMutation({
    mutationFn: (data) => postData('/auth/login', data),
    onSuccess: (response) => {
      const { user, accessToken } = response.data.data
      if (user.role !== 'Admin') {
        throw new Error('Unauthorized: Admin access only')
      }
      setAuth({ user, token: accessToken })
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/admin')
    },
    onError: (error) => {
      console.error('Login failed:', error)
    }
  })

  const onSubmit = (data) => {
    loginMutation.mutate(data)
  }

  const handlePersistChange = (e) => {
    const checked = e.target.checked
    setPersist(checked)
    localStorage.setItem('persist', checked.toString())
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#F8F6F2'
    }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{ 
              width: 64, 
              height: 64, 
              borderRadius: '50%', 
              bgcolor: '#C6A75E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2
            }}>
              <LockOutlined sx={{ fontSize: 32, color: '#3B2A1E' }} />
            </Box>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E' }}>
              Admin Login
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mt: 1 }}>
              Sign in to access your dashboard
            </Typography>
          </Box>
          
          {loginMutation.isError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {loginMutation.error?.response?.data?.message || 'Login failed. Please check your credentials.'}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              margin="normal"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox 
                  checked={persist} 
                  onChange={handlePersistChange}
                  sx={{ color: '#C6A75E', '&.Mui-checked': { color: '#C6A75E' } }}
                />
              }
              label="Keep me signed in"
              sx={{ mb: 2, '& .MuiFormControlLabel-label': { fontFamily: "'Poppins', sans-serif" } }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loginMutation.isPending}
              sx={{ 
                mt: 2,
                py: 1.5,
                bgcolor: '#C6A75E',
                color: '#3B2A1E',
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#B89650'
                }
              }}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}

export default AdminLogin
