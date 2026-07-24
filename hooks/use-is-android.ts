'use client'

import { useEffect, useState } from 'react'

export function useIsAndroid() {
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    setIsAndroid(/Android/i.test(navigator.userAgent))
  }, [])

  return isAndroid
}
