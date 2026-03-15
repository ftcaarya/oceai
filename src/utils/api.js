import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// First Mate Fish Prediction API
export const callFirstMate = async (message, lat, lon, waterTemp = null, history = []) => {
  try {
    const response = await apiClient.post('/firstmate', {
      message,
      lat,
      lon,
      water_temp_f: waterTemp,
      history,
    })
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('First Mate API error:', error)
    return {
      success: false,
      error: error.message || 'Failed to connect to First Mate',
    }
  }
}

// Health check
export const checkHealth = async () => {
  try {
    const response = await apiClient.get('/health')
    return {
      success: true,
      data: response.data,
    }
  } catch (error) {
    console.error('Health check error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

export default apiClient
