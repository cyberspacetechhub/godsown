import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Box, Typography, Tabs, Tab, Card, CardContent, TextField, Button, Switch, FormControlLabel, Grid, Divider, Alert } from '@mui/material'
import { Save, Settings as SettingsIcon } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useUpdate from '../../../hooks/useUpdate'
import useAuth from '../../../hooks/useAuth'

function AdminSettings() {
  const [activeTab, setActiveTab] = useState(0)
  const [settings, setSettings] = useState({})
  
  const fetchData = useFetch()
  const updateData = useUpdate()
  const { auth } = useAuth()
  const queryClient = useQueryClient()

  const { data: settingsData, isLoading, error } = useQuery('admin-settings', () => 
    fetchData('/settings', auth.token)
  )

  // console.log('Settings data:', settingsData)
  // console.log('Settings loading:', isLoading)
  // console.log('Settings error:', error)

  const updateSettingsMutation = useMutation(
    (settingsData) => updateData('/settings', settingsData, auth.token),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-settings')
        toast.success('Settings updated successfully!')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update settings')
      }
    }
  )

  const allSettings = settingsData?.data?.data || []
  
  const categories = {
    general: Array.isArray(allSettings) ? allSettings.filter(s => s.category === 'general') : [],
    payment: Array.isArray(allSettings) ? allSettings.filter(s => s.category === 'payment') : [],
    notification: Array.isArray(allSettings) ? allSettings.filter(s => s.category === 'notification') : []
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    updateSettingsMutation.mutate(settings)
  }

  const renderSettingField = (setting) => {
    const currentValue = settings[setting.key] !== undefined ? settings[setting.key] : setting.value

    if (typeof setting.value === 'boolean') {
      return (
        <FormControlLabel
          control={
            <Switch
              checked={currentValue}
              onChange={(e) => handleSettingChange(setting.key, e.target.checked)}
            />
          }
          label={setting.description}
        />
      )
    }

    return (
      <TextField
        fullWidth
        label={setting.description}
        value={currentValue}
        onChange={(e) => handleSettingChange(setting.key, e.target.value)}
        type={typeof setting.value === 'number' ? 'number' : 'text'}
        size="small"
      />
    )
  }

  const tabLabels = ['General', 'Payment', 'Notifications']
  const tabKeys = ['general', 'payment', 'notification']

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        <SettingsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        System Settings
      </Typography>

      <Card sx={{ borderRadius: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
        >
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} />
          ))}
        </Tabs>

        <CardContent sx={{ p: 4 }}>
          {isLoading ? (
            <Typography>Loading settings...</Typography>
          ) : error ? (
            <Typography color="error">Error loading settings: {error.message}</Typography>
          ) : (
            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
                Total settings loaded: {Array.isArray(allSettings) ? allSettings.length : 0}
              </Typography>
              {(!Array.isArray(allSettings) || allSettings.length === 0) && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>No settings found</Typography>
                  <Button 
                    variant="outlined" 
                    onClick={() => fetch('/api/settings/seed', { method: 'POST' }).then(() => window.location.reload())}
                    sx={{ color: '#C6A75E', borderColor: '#C6A75E' }}
                  >
                    Initialize Settings
                  </Button>
                </Box>
              )}
              <Grid container spacing={3}>
                {categories[tabKeys[activeTab]]?.map((setting) => (
                  <Grid item xs={12} md={6} key={setting.key}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                        {setting.key.replace(/_/g, ' ').toUpperCase()}
                      </Typography>
                      {renderSettingField(setting)}
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  disabled={updateSettingsMutation.isLoading || Object.keys(settings).length === 0}
                  sx={{ 
                    bgcolor: '#C6A75E', 
                    color: '#3B2A1E', 
                    fontFamily: "'Poppins', sans-serif", 
                    fontWeight: 600, 
                    '&:hover': { bgcolor: '#B89650' }
                  }}
                >
                  {updateSettingsMutation.isLoading ? 'Saving...' : 'Save Settings'}
                </Button>
              </Box>

              {Object.keys(settings).length > 0 && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  You have unsaved changes. Click "Save Settings" to apply them.
                </Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminSettings