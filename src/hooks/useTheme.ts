import { setCssVar } from '@/utils/css'

function setTheme({ clientX, clientY }: MouseEvent) {
  const maxRadius = Math.hypot(Math.max(clientX, window.innerWidth - clientX), Math.max(clientY, window.innerHeight - clientY))
  setCssVar('--v3-theme-x', `${clientX}px`)
  setCssVar('--v3-theme-y', `${clientY}px`)
  setCssVar('--v3-theme-r', `${maxRadius}px`)
  document.startViewTransition && document.startViewTransition()
}

/** 主题 Composable */
export function useTheme() {
  return {
    setTheme
  }
}
