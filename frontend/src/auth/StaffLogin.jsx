import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material'
import { Work } from '@mui/icons-material'
import { toast } from 'react-toastify'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'multiservice_api_key_2024_secure'

function StaffLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, form, {
        headers: { 'x-api-key': API_KEY }
      })
      
      const { user, accessToken } = response.data.data
      
      if (user.role !== 'Staff') {
        toast.error('Access denied. Staff accounts only.')
        return
      }

      if (!user.shift) {
        toast.error('No shift assigned. Contact administrator.')
        return
      }

      const currentHour = new Date().getHours()
      let allowedShift = null

      if (currentHour >= 6 && currentHour < 14) {
        allowedShift = 'morning'
      } else if (currentHour >= 14 && currentHour < 22) {
        allowedShift = 'afternoon'
      } else {
        allowedShift = 'night'
      }

      if (user.shift !== allowedShift) {
        toast.error(`Access denied. You are on ${user.shift} shift. Current shift is ${allowedShift}.`)
        return
      }

      localStorage.setItem('staffToken', accessToken)
      localStorage.setItem('staffData', JSON.stringify(user))
      
      toast.success('Login successful')
      
      if (user.department === 'hotel') {
        navigate('/staff/hotel')
      } else {
        navigate('/staff/restaurant')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#F8F6F2', py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Work sx={{ fontSize: 64, color: '#667eea', mb: 2 }} />
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 1 }}>
              Staff Portal
            </Typography>
            <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
              Login to access your dashboard
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleLogin}>
            <TextField fullWidth label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} sx={{ mb: 3 }} />
            <Button type="submit" variant="contained" fullWidth size="large" sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontFamily: "'Poppins', sans-serif", fontWeight: 600, py: 1.5 }}>
              Login
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

export default StaffLogin
