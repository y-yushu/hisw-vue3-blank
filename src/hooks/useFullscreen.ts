// src/hooks/useFullscreen.ts
import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export function useFullscreen(target?: HTMLElement | Ref<HTMLElement | null>) {
  const isFullscreen = ref(false)

  // 获取目标元素，如果没传就默认 document.documentElement
  const getTarget = (): HTMLElement => {
    if (!target) return document.documentElement
    return target instanceof HTMLElement ? target : target.value || document.documentElement
  }

  // 判断当前是否全屏（并且是我们指定的元素）
  const checkFullscreen = () => {
    const fsEl =
      document.fullscreenElement ||
      // 兼容老浏览器
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement

    isFullscreen.value = !!fsEl && fsEl === getTarget()
  }

  const enter = async () => {
    const el = getTarget()
    if (el.requestFullscreen) {
      await el.requestFullscreen()
    } else if ((el as any).webkitRequestFullscreen) {
      await (el as any).webkitRequestFullscreen()
    } else if ((el as any).mozRequestFullScreen) {
      await (el as any).mozRequestFullScreen()
    } else if ((el as any).msRequestFullscreen) {
      await (el as any).msRequestFullscreen()
    }
  }

  const exit = async () => {
    if (document.exitFullscreen) {
      await document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      await (document as any).webkitExitFullscreen()
    } else if ((document as any).mozCancelFullScreen) {
      await (document as any).mozCancelFullScreen()
    } else if ((document as any).msExitFullscreen) {
      await (document as any).msExitFullscreen()
    }
  }

  const toggle = async () => {
    if (isFullscreen.value) {
      await exit()
    } else {
      await enter()
    }
  }

  onMounted(() => {
    document.addEventListener('fullscreenchange', checkFullscreen)
    document.addEventListener('webkitfullscreenchange', checkFullscreen as any)
    document.addEventListener('mozfullscreenchange', checkFullscreen as any)
    document.addEventListener('MSFullscreenChange', checkFullscreen as any)
    checkFullscreen()
  })

  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', checkFullscreen)
    document.removeEventListener('webkitfullscreenchange', checkFullscreen as any)
    document.removeEventListener('mozfullscreenchange', checkFullscreen as any)
    document.removeEventListener('MSFullscreenChange', checkFullscreen as any)
  })

  return {
    isFullscreen,
    enter,
    exit,
    toggle
  }
}
