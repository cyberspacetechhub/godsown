import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Box, Container, Typography, TextField, Button, Paper, Tab, Tabs } from '@mui/material'
import { Hotel } from '@mui/icons-material'
import { toast } from 'react-toastify'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'multiservice_api_key_2024_secure'

function GuestAuth() {
  const [tab, setTab] = useState(0)
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', phone: '', password: '', address: '' })
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/api/guests/login`, loginForm, {
        headers: { 'x-api-key': API_KEY }
      })
      localStorage.setItem('guestToken', response.data.data.token)
      localStorage.setItem('guestData', JSON.stringify(response.data.data.guest))
      toast.success('Login successful')
      navigate('/guest/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/api/guests/register`, registerForm, {
        headers: { 'x-api-key': API_KEY }
      })
      localStorage.setItem('guestToken', response.data.data.token)
      localStorage.setItem('guestData', JSON.stringify(response.data.data.guest))
      toast.success('Registration successful')
      navigate('/guest/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#F8F6F2', py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Hotel sx={{ fontSize: 64, color: '#C6A75E', mb: 2 }} />
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 1 }}>
              Guest Portal
            </Typography>
            <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
              Access your hotel account
            </Typography>
          </Box>

          <Tabs value={tab} onChange={(e, val) => setTab(val)} centered sx={{ mb: 4, '& .MuiTab-root': { fontFamily: "'Poppins', sans-serif", fontWeight: 600 }, '& .MuiTabs-indicator': { bgcolor: '#C6A75E' } }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {tab === 0 ? (
            <Box component="form" onSubmit={handleLogin}>
              <TextField fullWidth label="Email" type="email" required value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Password" type="password" required value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} sx={{ mb: 3 }} />
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, py: 1.5, '&:hover': { bgcolor: '#B89650' } }}>
                Login
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister}>
              <TextField fullWidth label="Full Name" required value={registerForm.name} onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Email" type="email" required value={registerForm.email} onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Phone" required value={registerForm.phone} onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Address" value={registerForm.address} onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })} sx={{ mb: 2 }} />
              <TextField fullWidth label="Password" type="password" required value={registerForm.password} onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })} sx={{ mb: 3 }} />
              <Button type="submit" variant="contained" fullWidth size="large" sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, py: 1.5, '&:hover': { bgcolor: '#B89650' } }}>
                Register
              </Button>
            </Box>
          )}

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Link to="/" style={{ fontFamily: "'Poppins', sans-serif", color: '#C6A75E', textDecoration: 'none' }}>
              Back to Home
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default GuestAuth
