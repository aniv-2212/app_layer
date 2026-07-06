import { useCallback, useEffect, useState } from 'react'
import { api } from '../services/api'

/** Generic loader for backend intel endpoints with loading/error state. */
export function useApiData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setData(await fetcher())
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => {
    void load()
  }, [load])

  return { data, loading, error, refresh: load }
}

export const useCisaKev = (limit = 10, search?: string) =>
  useApiData(() => api.cisaKev(limit, search), [limit, search])

export const useHibpBreaches = (limit = 10) => useApiData(() => api.hibpBreaches(limit), [limit])

export const useOtxPulses = (limit = 10) => useApiData(() => api.otxPulses(limit), [limit])

export const useIntelStatus = () => useApiData(() => api.intelStatus(), [])

export const useStatisticsSummary = () => useApiData(() => api.statisticsSummary(), [])
