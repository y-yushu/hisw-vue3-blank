import { defineStore } from 'pinia'
import { pinia } from './index'

// 定义状态的类型
interface CounterState {
  count: number
  name: string
}

export const useCounterStore = defineStore('counter', {
  // 使用泛型为 state 提供类型
  state: (): CounterState => ({ count: 0, name: 'Eduardo' }),
  getters: {
    // 为 getter 提供返回值类型
    doubleCount: (state: CounterState): number => state.count * 2
  },
  actions: {
    // 为 action 提供类型
    increment(): void {
      this.count++
    },
    setCount(num: number) {
      this.count = num
    }
  }
})

/**
 * @description 在 SPA 应用中可用于在 pinia 实例被激活前使用 store
 * @description 在 SSR 应用中可用于在 setup 外使用 store
 */
export const useCounterStoreOutside = () => {
  return useCounterStore(pinia)
}
