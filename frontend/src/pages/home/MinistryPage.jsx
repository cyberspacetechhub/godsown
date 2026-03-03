import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, CircularProgress } from '@mui/material'
import { PlayCircle, Event, CalendarMonth, LocationOn } from '@mui/icons-material'
import { useQuery } from 'react-query'
import usePublicFetch from '../../hooks/usePublicFetch'

function MinistryPage() {
  const fetchProfiles = usePublicFetch()
  const fetchEvents = usePublicFetch()
  
  const { data: profilesData, isLoading: profilesLoading } = useQuery('profiles', () => fetchProfiles('/api/profiles'))
  const { data: eventsData, isLoading: eventsLoading } = useQuery('events', () => fetchEvents('/api/events'))

  const profiles = profilesData?.data || []
  const eventsFromAPI = eventsData?.data || []
  const minister = profiles[0]
  const videos = [
    { title: 'Worship Medley 2024', thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=80', views: '125K' },
    { title: 'Holy Spirit Come', thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', views: '89K' },
    { title: 'Praise & Worship Live', thumbnail: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80', views: '210K' },
    { title: 'Testimony Session', thumbnail: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80', views: '67K' }
  ]

  const gallery = [
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
    'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80'
  ]

  return (
    <Box>
      <Box sx={{ height: { xs: '60vh', md: '70vh' }, backgroundImage: 'linear-gradient(rgba(59, 42, 30, 0.6), rgba(59, 42, 30, 0.6)), url(https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h1" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2.5rem', md: '4rem' }, fontWeight: 700, color: '#F8F6F2', mb: 2 }}>
            Music Ministry
          </Typography>
          <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", color: '#C6A75E', mb: 4, fontSize: { xs: '1rem', md: '1.3rem' } }}>
            Spreading the Gospel through Music
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button variant="contained" size="large" startIcon={<PlayCircle />} sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 4, py: 2, borderRadius: 2, '&:hover': { bgcolor: '#B89650', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(198, 167, 94, 0.4)' } }}>
              Watch Videos
            </Button>
            <Button variant="outlined" size="large" sx={{ borderColor: '#C6A75E', color: '#F8F6F2', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 4, py: 2, borderRadius: 2, '&:hover': { borderColor: '#B89650', bgcolor: 'rgba(198, 167, 94, 0.1)' } }}>
              Listen Now
            </Button>
          </Box>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8F6F2' }}>
        <Container maxWidth="lg">
          {profilesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#C6A75E' }} />
            </Box>
          ) : minister ? (
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={5}>
                <Box sx={{ height: 500, borderRadius: 3, overflow: 'hidden', backgroundImage: `url(${minister.imageUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
              </Grid>
              <Grid item xs={12} md={7}>
                <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', mb: 3 }}>
                  About {minister.name}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                  {minister.biography || 'A dedicated minister spreading the gospel through music and worship.'}
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Typography sx={{ textAlign: 'center', py: 8, fontFamily: "'Poppins', sans-serif", color: '#666' }}>
              Minister profile coming soon
            </Typography>
          )}
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Latest Music & Videos
          </Typography>
          <Grid container spacing={4}>
            {videos.map((video, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ borderRadius: 3, cursor: 'pointer', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 32px rgba(198, 167, 94, 0.2)' } }}>
                  <Box sx={{ position: 'relative', height: 200, backgroundImage: `url(${video.thumbnail})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PlayCircle sx={{ fontSize: 64, color: '#C6A75E' }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600, color: '#3B2A1E', mb: 1 }}>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666' }}>
                      {video.views} views
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#F8F6F2' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Upcoming Events
          </Typography>
          {eventsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: '#C6A75E' }} />
            </Box>
          ) : eventsFromAPI.length === 0 ? (
            <Typography sx={{ textAlign: 'center', py: 8, fontFamily: "'Poppins', sans-serif", color: '#666' }}>
              No upcoming events at the moment
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {eventsFromAPI.slice(0, 3).map((event) => (
                <Grid item xs={12} md={4} key={event._id}>
                  <Card sx={{ borderRadius: 3, p: 3, height: '100%', transition: 'all 0.3s', '&:hover': { boxShadow: '0 12px 32px rgba(198, 167, 94, 0.2)' } }}>
                    <Chip label="Upcoming" sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, mb: 2 }} />
                    <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: '#3B2A1E', mb: 2 }}>
                      {event.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CalendarMonth sx={{ fontSize: 20, color: '#666' }} />
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>
                        {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <LocationOn sx={{ fontSize: 20, color: '#666' }} />
                      <Typography sx={{ fontFamily: "'Poppins', sans-serif", color: '#222222' }}>
                        {event.location}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontFamily: "'Poppins', sans-serif", color: '#666', mb: 3 }}>
                      {event.description}
                    </Typography>
                    <Button variant="contained" fullWidth sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, '&:hover': { bgcolor: '#B89650' } }}>
                      Get Tickets
                    </Button>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h2" sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: '2rem', md: '3rem' }, fontWeight: 700, color: '#3B2A1E', textAlign: 'center', mb: 6 }}>
            Ministry Gallery
          </Typography>
          <Grid container spacing={3}>
            {gallery.map((img, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Box sx={{ height: 280, borderRadius: 3, overflow: 'hidden', backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'transform 0.3s', cursor: 'pointer', '&:hover': { transform: 'scale(1.05)' } }} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#3B2A1E', color: '#F8F6F2', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
            Book for Your Event
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: "'Poppins', sans-serif", fontSize: '1.1rem', mb: 4, opacity: 0.9 }}>
            Invite Pastor Godsown to minister at your church, conference, or special event
          </Typography>
          <Button variant="contained" size="large" sx={{ bgcolor: '#C6A75E', color: '#3B2A1E', fontFamily: "'Poppins', sans-serif", fontWeight: 600, px: 5, py: 2, fontSize: '1.1rem', '&:hover': { bgcolor: '#B89650', transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(198, 167, 94, 0.4)' } }}>
            Contact for Booking
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default MinistryPage
