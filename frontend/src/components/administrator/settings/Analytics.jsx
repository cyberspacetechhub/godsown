import { useState } from 'react'
import { useQuery } from 'react-query'
import { Box, Typography, Card, CardContent, Grid, Button, TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material'
import { Analytics as AnalyticsIcon, Download, DateRange } from '@mui/icons-material'
import { toast } from 'react-toastify'
import useFetch from '../../../hooks/useFetch'
import useAuth from '../../../hooks/useAuth'

function Analytics() {
  const [reportType, setReportType] = useState('orders')
  const [dateRange, setDateRange] = useState('30')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  const fetchData = useFetch()
  const { auth } = useAuth()

  const { data: analyticsData, isLoading } = useQuery(
    ['analytics', reportType, dateRange, startDate, endDate], 
    () => Promise.all([
      fetchData('/orders', auth.token),
      fetchData('/bookings', auth.token),
      fetchData('/rooms', auth.token),
      fetchData('/users', auth.token)
    ]).then(([orders, bookings, rooms, users]) => ({
      orders: orders?.data?.data || [],
      bookings: bookings?.data?.data || [],
      rooms: rooms?.data?.data || [],
      users: users?.data?.data || []
    }))
  )

  const getFilteredData = () => {
    if (!analyticsData) return []
    
    const now = new Date()
    let filterDate = new Date()
    
    if (startDate && endDate) {
      filterDate = new Date(startDate)
    } else {
      filterDate.setDate(now.getDate() - parseInt(dateRange))
    }

    const data = analyticsData[reportType] || []
    
    return data.filter(item => {
      const itemDate = new Date(item.createdAt || item.orderDate || item.checkInDate)
      if (startDate && endDate) {
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate)
      }
      return itemDate >= filterDate
    })
  }

  const exportToCSV = () => {
    const data = getFilteredData()
    if (data.length === 0) {
      toast.error('No data to export')
      return
    }

    let headers = []
    let rows = []

    switch (reportType) {
      case 'orders':
        headers = ['Order ID', 'Customer Name', 'Customer Phone', 'Total Amount', 'Status', 'Payment Status', 'Date']
        rows = data.map(order => [
          order._id,
          order.customer?.name || 'N/A',
          order.customer?.phone || 'N/A',
          order.totalAmount || 0,
          order.status,
          order.paymentStatus,
          new Date(order.createdAt).toLocaleDateString()
        ])
        break
      case 'bookings':
        headers = ['Booking ID', 'Guest Name', 'Room Type', 'Check In', 'Check Out', 'Total Amount', 'Status', 'Date']
        rows = data.map(booking => [
          booking._id,
          booking.guest?.name || 'N/A',
          booking.roomType?.name || 'N/A',
          new Date(booking.checkInDate).toLocaleDateString(),
          new Date(booking.checkOutDate).toLocaleDateString(),
          booking.totalAmount || 0,
          booking.status,
          new Date(booking.createdAt).toLocaleDateString()
        ])
        break
      case 'users':
        headers = ['User ID', 'Name', 'Email', 'Role', 'Registration Date']
        rows = data.map(user => [
          user._id,
          user.name,
          user.email,
          user.roles,
          new Date(user.createdAt).toLocaleDateString()
        ])
        break
      default:
        return
    }

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Report exported successfully!')
  }

  const getReportSummary = () => {
    const data = getFilteredData()
    
    switch (reportType) {
      case 'orders':
        const totalRevenue = data.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
        const avgOrderValue = data.length > 0 ? totalRevenue / data.length : 0
        return {
          total: data.length,
          revenue: totalRevenue,
          average: avgOrderValue,
          pending: data.filter(o => o.status === 'pending').length,
          completed: data.filter(o => o.status === 'delivered').length
        }
      case 'bookings':
        const bookingRevenue = data.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
        const avgBookingValue = data.length > 0 ? bookingRevenue / data.length : 0
        return {
          total: data.length,
          revenue: bookingRevenue,
          average: avgBookingValue,
          confirmed: data.filter(b => b.status === 'confirmed').length,
          cancelled: data.filter(b => b.status === 'cancelled').length
        }
      case 'users':
        return {
          total: data.length,
          admins: data.filter(u => u.roles === 'admin').length,
          staff: data.filter(u => u.roles === 'staff').length,
          recent: data.filter(u => {
            const userDate = new Date(u.createdAt)
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return userDate >= weekAgo
          }).length
        }
      default:
        return {}
    }
  }

  const summary = getReportSummary()
  const filteredData = getFilteredData()

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 4 }}>
        <AnalyticsIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
        Advanced Analytics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <MenuItem value="orders">Orders Report</MenuItem>
            <MenuItem value="bookings">Bookings Report</MenuItem>
            <MenuItem value="users">Users Report</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            select
            label="Date Range"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
            <MenuItem value="365">Last year</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            type="date"
            label="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            type="date"
            label="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<Download />}
            onClick={exportToCSV}
            sx={{ 
              height: '56px',
              bgcolor: '#C6A75E', 
              color: '#3B2A1E', 
              fontFamily: "'Poppins', sans-serif", 
              fontWeight: 600, 
              '&:hover': { bgcolor: '#B89650' }
            }}
          >
            Export CSV
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#3B2A1E', mb: 1 }}>
                {summary.total || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Total {reportType}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {summary.revenue !== undefined && (
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#C6A75E', mb: 1 }}>
                  ₦{summary.revenue.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Total Revenue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        {summary.average !== undefined && (
          <Grid item xs={12} md={3}>
            <Card sx={{ borderRadius: 3 }}>
              <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#4caf50', mb: 1 }}>
                  ₦{Math.round(summary.average).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Average Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        )}
        <Grid item xs={12} md={3}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800', mb: 1 }}>
                {summary.pending || summary.confirmed || summary.recent || 0}
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                {reportType === 'orders' ? 'Pending' : reportType === 'bookings' ? 'Confirmed' : 'Recent (7 days)'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
            <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E' }}>
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Data ({filteredData.length} records)
            </Typography>
          </Box>
          
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportType === 'orders' && (
                    <>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Date</TableCell>
                    </>
                  )}
                  {reportType === 'bookings' && (
                    <>
                      <TableCell>Booking ID</TableCell>
                      <TableCell>Guest</TableCell>
                      <TableCell>Room Type</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </>
                  )}
                  {reportType === 'users' && (
                    <>
                      <TableCell>User ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Registration</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">Loading...</TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">No data found</TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item._id} hover>
                      {reportType === 'orders' && (
                        <>
                          <TableCell>#{item._id.slice(-6)}</TableCell>
                          <TableCell>{item.customer?.name || 'N/A'}</TableCell>
                          <TableCell>₦{item.totalAmount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.status} 
                              size="small" 
                              sx={{ 
                                bgcolor: item.status === 'delivered' ? '#4caf50' : '#ff9800',
                                color: 'white',
                                textTransform: 'capitalize'
                              }} 
                            />
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={item.paymentStatus} 
                              size="small" 
                              sx={{ 
                                bgcolor: item.paymentStatus === 'paid' ? '#4caf50' : '#f44336',
                                color: 'white',
                                textTransform: 'capitalize'
                              }} 
                            />
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                        </>
                      )}
                      {reportType === 'bookings' && (
                        <>
                          <TableCell>#{item._id.slice(-6)}</TableCell>
                          <TableCell>{item.guest?.name || 'N/A'}</TableCell>
                          <TableCell>{item.roomType?.name || 'N/A'}</TableCell>
                          <TableCell>₦{(item.totalAmount || 0).toLocaleString()}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.status} 
                              size="small" 
                              sx={{ 
                                bgcolor: item.status === 'confirmed' ? '#4caf50' : '#ff9800',
                                color: 'white',
                                textTransform: 'capitalize'
                              }} 
                            />
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                        </>
                      )}
                      {reportType === 'users' && (
                        <>
                          <TableCell>#{item._id.slice(-6)}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.email}</TableCell>
                          <TableCell>
                            <Chip 
                              label={item.roles} 
                              size="small" 
                              sx={{ 
                                bgcolor: item.roles === 'admin' ? '#f44336' : '#2196f3',
                                color: 'white',
                                textTransform: 'capitalize'
                              }} 
                            />
                          </TableCell>
                          <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default Analytics