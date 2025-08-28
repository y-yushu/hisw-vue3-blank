/** 获取指定元素（默认全局）上的 CSS 变量的值 */
export function getCssVar(varName: string, element: HTMLElement = document.documentElement) {
  if (!varName?.startsWith('--')) {
    console.error("CSS 变量名应以 '--' 开头")
    return ''
  }
  // 没有拿到值时，会返回空串
  return getComputedStyle(element).getPropertyValue(varName)
}

/** 设置指定元素（默认全局）上的 CSS 变量的值 */
export function setCssVar(varName: string, value: string, element: HTMLElement = document.documentElement) {
  if (!varName?.startsWith('--')) {
    console.error("CSS 变量名应以 '--' 开头")
    return
  }
  element.style.setProperty(varName, value)
}

// 切换主题
export function setTheme({ clientX, clientY }: MouseEvent) {
  const maxRadius = Math.hypot(Math.max(clientX, window.innerWidth - clientX), Math.max(clientY, window.innerHeight - clientY))
  setCssVar('--v3-theme-x', `${clientX}px`)
  setCssVar('--v3-theme-y', `${clientY}px`)
  setCssVar('--v3-theme-r', `${maxRadius}px`)
  document.startViewTransition && document.startViewTransition()
}
