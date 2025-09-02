/**
 * 将颜色字符串解析为 r,g,b 对象
 */
function parseColor(color: string): { r: number; g: number; b: number; a?: number } | null {
  color = color.trim()

  // rgb/rgba
  const rgbMatch = color.match(/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s]+([01]?\.?\d*))?\s*\)$/i)
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? Number(rgbMatch[4]) : undefined
    }
  }

  // #RRGGBB or #RGB
  const hexMatch = color.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(x => x + x)
        .join('')
    }
    const num = parseInt(hex, 16)
    return {
      r: (num >> 16) & 0xff,
      g: (num >> 8) & 0xff,
      b: num & 0xff
    }
  }

  return null // 不支持的格式
}

/**
 * rgb 转 hsl
 */
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return [h * 360, s, l]
}

/**
 * hsl 转 rgb
 */
function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h /= 360
  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
}

/**
 * 将 rgb 对象转为颜色字符串（保持输入格式）
 */
function rgbToString(rgb: { r: number; g: number; b: number; a?: number }, original: string): string {
  if (original.startsWith('rgb')) {
    if (rgb.a !== undefined) return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
  } else {
    // hex 输出
    const hex = ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
    return `#${hex}`
  }
}

/**
 * 生成 hover/active 颜色
 */
export function generateColorVariants(color: string): { hover: string; active: string } {
  const rgb = parseColor(color)
  if (!rgb) throw new Error('不支持的颜色格式')

  const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b)

  // 生成 hover/active
  const hoverRgbArr = hslToRgb(h, s, Math.min(1, l + 0.2))
  const activeRgbArr = hslToRgb(h, s, Math.max(0, l - 0.2))

  const hover = rgbToString({ r: hoverRgbArr[0], g: hoverRgbArr[1], b: hoverRgbArr[2], a: rgb.a }, color)
  const active = rgbToString({ r: activeRgbArr[0], g: activeRgbArr[1], b: activeRgbArr[2], a: rgb.a }, color)

  return { hover, active }
}

// // 测试
// console.log(generateColorVariants('#409EFF'))
// console.log(generateColorVariants('#3af'))
// console.log(generateColorVariants('rgb(64,158,255)'))
// console.log(generateColorVariants('rgba(64,158,255,0.5)'))
