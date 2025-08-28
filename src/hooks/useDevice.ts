/**
 * 设备检测 Hook：useDevice
 *
 * 用于检测当前设备类型（手机、平板或 PC），并根据窗口宽度动态更新设备类型。
 * 通过监听窗口大小变化事件，实时更新设备类型，以实现响应式设计。
 *
 * 功能：
 * - 根据窗口宽度判断当前设备类型（mobile、tablet 或 pc）。
 * - 自动监听窗口大小变化事件，实时更新设备类型。
 * - 提供一个响应式的 device 值，可在组件中直接使用。
 *
 * 使用方法：
 * 1. 在组件中引入 useDevice Hook。
 * 2. 调用 useDevice() 获取当前设备类型（device）。
 * 3. 根据 device 值进行响应式布局或逻辑处理。
 *
 * 注意事项：
 * - 该 Hook 依赖于 window 对象，因此只能在浏览器环境中使用。
 * - 如果需要调整断点配置，可直接修改 BREAKPOINTS 对象中的值。
 */
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
