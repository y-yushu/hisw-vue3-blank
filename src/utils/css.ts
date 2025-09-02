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
  document.startViewTransition?.()
}

/**
 * 向body元素添加class
 * @param className 要添加的class名称
 * @returns 是否成功添加
 */
export function addClassToBody(className: string): boolean {
  try {
    if (document.body) {
      // 使用classList.add添加class
      document.body.classList.add(className)

      // 检查class是否成功添加
      const hasClass = document.body.classList.contains(className)
      if (!hasClass) {
        console.warn(`Failed to add class "${className}" to body.`)
      }

      return hasClass
    } else {
      console.error('document.body is not available yet.')
      return false
    }
  } catch (error) {
    console.error(`Error adding class "${className}" to body:`, error)
    return false
  }
}

/**
 * 从body元素移除class
 * @param className 要移除的class名称
 * @returns 是否成功移除
 */
export function removeClassFromBody(className: string): boolean {
  try {
    if (document.body) {
      // 检查class是否存在
      const hasClass = document.body.classList.contains(className)
      if (!hasClass) {
        // class不存在也算成功移除
        return true
      }

      // 使用classList.remove移除class
      document.body.classList.remove(className)

      // 检查class是否成功移除
      const stillHasClass = document.body.classList.contains(className)
      if (stillHasClass) {
        console.warn(`Failed to remove class "${className}" from body.`)
      }

      return !stillHasClass
    } else {
      console.error('document.body is not available yet.')
      return false
    }
  } catch (error) {
    console.error(`Error removing class "${className}" from body:`, error)
    return false
  }
}
