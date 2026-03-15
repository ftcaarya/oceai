import { useState, useCallback } from 'react'
import { callFirstMate } from '../utils/api'

export const useFirstMate = () => {
  const [response, setResponse] = useState(null)
  const [conditions, setConditions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchFirstMate = useCallback(async (message, lat, lon, waterTemp = null, history = []) => {
    setLoading(true)
    setError(null)
    try {
      const data = {
        message,
        lat,
        lon,
        water_temp_f: waterTemp,
        history
      }
      const result = await callFirstMate(data)
      setResponse(result.data.response)
      setConditions(result.data.conditions)
      return result.data
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to fetch FirstMate response'
      setError(errorMsg)
      console.error('FirstMate Error:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { response, conditions, loading, error, fetchFirstMate }
}
