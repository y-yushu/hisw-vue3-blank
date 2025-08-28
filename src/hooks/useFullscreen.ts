/**
 * 自定义 Vue 3 Hook：useFullscreen
 *
 * 用于控制和检测全屏状态，支持指定目标元素进入或退出全屏。
 * 提供了进入全屏、退出全屏、切换全屏状态以及检测当前是否全屏的功能。
 *
 * 功能：
 * - 支持指定目标元素进入全屏状态。
 * - 支持退出全屏状态。
 * - 提供切换全屏状态的功能。
 * - 实时检测当前是否处于全屏状态，并更新响应式的 isFullscreen 值。
 * - 兼容主流浏览器的全屏 API。
 *
 * 使用方法：
 * 1. 在组件中引入 useFullscreen Hook。
 * 2. 调用 useFullscreen() 或 useFullscreen(target) 获取全屏控制功能。
 * 3. 使用返回的 enter、exit 和 toggle 方法控制全屏状态。
 * 4. 使用 isFullscreen 值检测当前是否处于全屏状态。
 *
 * 注意事项：
 * - 该 Hook 依赖于浏览器的全屏 API，因此只能在浏览器环境中使用。
 * - 如果需要指定目标元素，可以将目标元素或其 Ref 作为参数传递给 useFullscreen。
 * - 兼容性：支持主流浏览器的全屏 API，但某些旧浏览器可能不支持。
 */
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
