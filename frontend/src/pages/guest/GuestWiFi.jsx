import { useQuery } from 'react-query'
import { Box, Typography, Card, CardContent, Chip, Button, CircularProgress, Alert } from '@mui/material'
import { Wifi, ContentCopy, CheckCircle } from '@mui/icons-material'
import { useState } from 'react'
import { toast } from 'react-toastify'
import usePublicFetch from '../../hooks/usePublicFetch'

function GuestWiFi() {
  const [copiedField, setCopiedField] = useState('')
  const fetchData = usePublicFetch()

  const { data: wifiData, isLoading, error } = useQuery(
    'guest-wifi',
    () => fetchData('/settings/wifi')
  )

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success(`${field} copied to clipboard!`)
      setTimeout(() => setCopiedField(''), 2000)
    } catch (err) {
      toast.error('Failed to copy to clipboard')
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !wifiData?.data) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        WiFi information is not available at the moment. Please contact the front desk for assistance.
      </Alert>
    )
  }

  const wifi = wifiData.data

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 3 }}>
        Hotel WiFi Access
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', maxWidth: 500 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Wifi sx={{ color: '#C6A75E', mr: 2, fontSize: 32 }} />
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
              Free WiFi Access
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
              Network Name (SSID):
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={wifi.networkName} 
                sx={{ 
                  bgcolor: '#E3F2FD', 
                  color: '#1976d2', 
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              />
              <Button
                size="small"
                onClick={() => handleCopy(wifi.networkName, 'Network Name')}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                {copiedField === 'Network Name' ? <CheckCircle sx={{ color: '#4caf50' }} /> : <ContentCopy />}
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1 }}>
              Password:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip 
                label={wifi.password} 
                sx={{ 
                  bgcolor: '#FFF3E0', 
                  color: '#F57C00', 
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 600,
                  fontSize: '0.9rem'
                }}
              />
              <Button
                size="small"
                onClick={() => handleCopy(wifi.password, 'Password')}
                sx={{ minWidth: 'auto', p: 1 }}
              >
                {copiedField === 'Password' ? <CheckCircle sx={{ color: '#4caf50' }} /> : <ContentCopy />}
              </Button>
            </Box>
          </Box>

          {wifi.instructions && (
            <Box sx={{ p: 2, bgcolor: '#F8F6F2', borderRadius: 2, border: '1px solid #E0E0E0', mb: 3 }}>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 1, fontWeight: 600 }}>
                Connection Instructions:
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', lineHeight: 1.6 }}>
                {wifi.instructions}
              </Typography>
            </Box>
          )}

          <Box sx={{ p: 2, bgcolor: '#E8F5E8', borderRadius: 2 }}>
            <Typography variant="caption" sx={{ fontFamily: "'Poppins', sans-serif", color: '#2e7d32', display: 'block', textAlign: 'center' }}>
              💡 Tap the copy button to copy network details to your clipboard
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default GuestWiFi