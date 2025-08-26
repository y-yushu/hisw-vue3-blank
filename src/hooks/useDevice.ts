// src/hooks/useDevice.ts
import { ref, onMounted, onUnmounted, computed } from 'vue'

// 断点配置，可以根据需要调整
const BREAKPOINTS = {
  mobile: 768, // < 768 视为手机
  tablet: 1024 // 768 - 1024 视为平板，>= 1024 视为 PC
}

type DeviceType = 'mobile' | 'tablet' | 'pc'

export function useDevice() {
  const width = ref(window.innerWidth)

  const device = computed<DeviceType>(() => {
    if (width.value < BREAKPOINTS.mobile) return 'mobile'
    if (width.value < BREAKPOINTS.tablet) return 'tablet'
    return 'pc'
  })

  const updateWidth = () => {
    width.value = window.innerWidth
  }

  onMounted(() => {
    window.addEventListener('resize', updateWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
  })

  // 只返回一个 device
  return device
}
