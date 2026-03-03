import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Box, Typography, Card, CardContent, TextField, Button, Alert, Grid, Chip } from '@mui/material'
import { Wifi, Save, Visibility, VisibilityOff } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function WiFiManagement() {
  const [showPassword, setShowPassword] = useState(false)
  const [wifiForm, setWifiForm] = useState({
    networkName: '',
    password: '',
    instructions: ''
  })

  const fetchData = useFetch()
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const { data: wifiData, isLoading } = useQuery(
    'wifi-settings',
    () => fetchData('/settings/wifi', auth.token),
    {
      onSuccess: (data) => {
        if (data?.data) {
          setWifiForm({
            networkName: data.data.networkName || '',
            password: data.data.password || '',
            instructions: data.data.instructions || ''
          })
        }
      }
    }
  )

  const updateMutation = useMutation(
    (data) => updateData('/settings/wifi', data, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('wifi-settings')
        toast.success('WiFi settings updated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update WiFi settings')
      }
    }
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    updateMutation.mutate(wifiForm)
  }

  const handleInputChange = (field, value) => {
    setWifiForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 3 }}>
        WiFi Management
      </Typography>

      <Grid container spacing={3}>
        {/* WiFi Settings Form */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Wifi sx={{ color: '#C6A75E', mr: 2 }} />
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
                  Hotel WiFi Settings
                </Typography>
              </Box>

              {updateMutation.isError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {updateMutation.error?.message || 'Failed to update WiFi settings'}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Network Name (SSID)"
                  value={wifiForm.networkName}
                  onChange={(e) => handleInputChange('networkName', e.target.value)}
                  sx={{ mb: 3 }}
                  helperText="The WiFi network name that guests will see"
                />

                <TextField
                  fullWidth
                  label="WiFi Password"
                  type={showPassword ? 'text' : 'password'}
                  value={wifiForm.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  sx={{ mb: 3 }}
                  helperText="The password guests will use to connect"
                  InputProps={{
                    endAdornment: (
                      <Button
                        onClick={() => setShowPassword(!showPassword)}
                        sx={{ minWidth: 'auto', p: 1 }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </Button>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Connection Instructions"
                  multiline
                  rows={4}
                  value={wifiForm.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  sx={{ mb: 3 }}
                  helperText="Additional instructions for guests (optional)"
                  placeholder="e.g., Connect to the network and enter the password. If you have issues, please contact the front desk."
                />

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Save />}
                  disabled={updateMutation.isLoading}
                  sx={{
                    bgcolor: '#C6A75E',
                    color: '#3B2A1E',
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#B89650' }
                  }}
                >
                  {updateMutation.isLoading ? 'Updating...' : 'Update WiFi Settings'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Preview Card */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', bgcolor: '#F8F6F2' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 2 }}>
                Guest View Preview
              </Typography>
              
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #E0E0E0' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Wifi sx={{ color: '#C6A75E', mr: 1 }} />
                  <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
                    Hotel WiFi
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
                    Network Name:
                  </Typography>
                  <Chip 
                    label={wifiForm.networkName || 'Not set'} 
                    sx={{ bgcolor: '#E3F2FD', color: '#1976d2', fontFamily: "'Poppins', sans-serif" }}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
                    Password:
                  </Typography>
                  <Chip 
                    label={wifiForm.password || 'Not set'} 
                    sx={{ bgcolor: '#FFF3E0', color: '#F57C00', fontFamily: "'Poppins', sans-serif" }}
                  />
                </Box>
                
                {wifiForm.instructions && (
                  <Box>
                    <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
                      Instructions:
                    </Typography>
                    <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', fontStyle: 'italic' }}>
                      {wifiForm.instructions}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default WiFiManagement