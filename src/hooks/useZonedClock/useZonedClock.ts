import { useEffect, useState } from 'react'

export const useZonedClock = (tz = 'America/Bogota') => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    let id: NodeJS.Timeout | null = null

    const updateTime = () => {
      setNow(new Date())
    }

    const startClock = () => {
      updateTime()
      id = setInterval(updateTime, 1000)
    }

    const stopClock = () => {
      if (id) {
        clearInterval(id)
        id = null
      }
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopClock()
      } else {
        startClock()
      }
    }

    // Start the clock initially
    startClock()

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      stopClock()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: tz,
  }).format(now)

  return time
}
