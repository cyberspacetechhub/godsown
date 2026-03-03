import { CircularProgress, Box } from '@mui/material'

function Loader() {
  return (
    <Box className="flex justify-center items-center h-screen">
      <CircularProgress />
    </Box>
  )
}

export default Loader
