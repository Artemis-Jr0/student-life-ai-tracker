import { useEffect, useRef, useState } from 'react'

type Status = 'idle' | 'pending' | 'success' | 'error'

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [status, setStatus] = useState<Status>('idle')
  const [value, setValue] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)

  // Use useCallback so function can be used as a dependency, because it will always be the same
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const execute = useRef(async () => {
    setStatus('pending')
    setValue(null)
    setError(null)
    try {
      const response = await asyncFunction()
      setValue(response)
      setStatus('success')
      return response
    } catch (error) {
      setError(error as Error)
      setStatus('error')
    }
  }).current

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [])

  return { execute, status, value, error }
}
