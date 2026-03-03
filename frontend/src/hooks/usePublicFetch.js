import axios from 'axios'

const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'multiservice_api_key_2024_secure'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const usePublicFetch = () => {
  const fetchData = async (url) => {
    try {
      const response = await axios.get(`${BASE_URL}${url}`, {
        headers: {
          'x-api-key': API_KEY
        }
      })
      return response.data
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  }

  return fetchData
}

export default usePublicFetch
