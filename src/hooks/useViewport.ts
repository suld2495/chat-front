import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { MOBILE_BREAKPOINT } from '@/lib/const'

interface ViewportState {
  width: number
  height: number
  isMobile: boolean
}

/**
 * 뷰포트 상태를 추적하는 훅
 * 반응형 동작을 위해 화면 크기와 모바일 여부를 감지합니다.
 */
export function useViewport(): ViewportState {
  const [viewport, setViewport] = useState<ViewportState>(() => {
    if (typeof window === 'undefined') {
      return {
        width: 0,
        height: 0,
        isMobile: false,
      }
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < MOBILE_BREAKPOINT,
    }
  })

  const handleResize = useCallback(() => {
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: window.innerWidth < MOBILE_BREAKPOINT,
    })
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  return viewport
}
