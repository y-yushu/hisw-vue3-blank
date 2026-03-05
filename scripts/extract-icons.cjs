// scripts/extract-icons.cjs
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const path = require('path')

// ============ 配置区域 ============
const CONFIG = {
  srcDir: 'src',
  outputPath: 'src/assets/icons-slim/icons.json',
  iconifyJsonDir: 'node_modules/@iconify/json/json',
  extensions: ['.vue', '.ts', '.tsx', '.js', '.jsx']
}

// Tailwind CSS 响应式/状态前缀黑名单
/* prettier-ignore */
const TAILWIND_PREFIXES = new Set([
  'sm', 'md', 'lg', 'xl', '2xl', // 响应式断点
  'hover', 'focus', 'active', 'disabled', 'visited', 'checked', 'indeterminate',  // 状态变体
  'focus-within', 'focus-visible', 'group-hover', 'group-focus', 'peer-hover', 'peer-focus',
  'before', 'after', 'first-letter', 'first-line', 'marker', 'selection', 'file', 'placeholder', // 伪元素
  'first', 'last', 'only', 'odd', 'even', 'first-of-type', 'last-of-type', 'only-of-type',  // 伪类
  'empty', 'enabled', 'default', 'required', 'valid', 'invalid', 'in-range', 'out-of-range',
  'read-only', 'read-write', 'open',
  'dark', 'light',  // 深色模式
  'ltr', 'rtl',  // 方向
  'print',  // 打印
  'motion-safe', 'motion-reduce',  // 运动
  'contrast-more', 'contrast-less',  // 对比度
  'not', 'has', 'is', 'where', 'supports', 'aria', 'data'  // 其他常见
])

// 其他需要排除的前缀
/* prettier-ignore */
const EXCLUDED_PREFIXES = new Set([
  'http', 'https', 'ftp', 'mailto', 'tel', 'data', 'file', 'ws', 'wss', // 协议
  'v-bind', 'v-on', 'v-if', 'v-else', 'v-for', 'v-show', 'v-model', 'v-slot', // Vue 指令
  'nth-child', 'nth-of-type', 'nth-last-child', 'nth-last-of-type', // CSS 相关
  'type', 'lang', 'scoped', 'module', 'setup', 'name', 'key', 'ref', 'class', 'style' // 常见误匹配
])

// ============ 工具函数 ============
function scanFiles(dir, fileList = []) {
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory()) {
      if (!['node_modules', '.git', 'dist', '.nuxt', '.output'].includes(file)) {
        scanFiles(filePath, fileList)
      }
    } else if (CONFIG.extensions.includes(path.extname(file))) {
      fileList.push(filePath)
    }
  }
  return fileList
}

function preprocessContent(content, filePath) {
  if (filePath.endsWith('.vue')) {
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  }
  return content
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
}

function isValidIcon(prefix, name) {
  const lowerPrefix = prefix.toLowerCase()
  if (TAILWIND_PREFIXES.has(lowerPrefix) || EXCLUDED_PREFIXES.has(lowerPrefix)) return false
  if (/^\d/.test(prefix) || prefix.length < 2) return false
  if (name.includes('$') || name.includes('{') || name.length < 2) return false
  if (/^\d+$/.test(name)) return false

  const cssValues = ['none', 'auto', 'inherit', 'initial', 'unset', 'block', 'inline', 'flex', 'grid', 'hidden', 'visible']
  return !cssValues.includes(name.toLowerCase())
}

// ============ 主逻辑 ============
function extractIcons() {
  console.log('🔍 开始扫描项目中使用的图标...\n')

  const files = scanFiles(path.resolve(process.cwd(), CONFIG.srcDir))
  console.log(`📁 找到 ${files.length} 个文件需要扫描`)

  const iconPatterns = [
    /\bicon\s*=\s*["'`]([a-z][a-z0-9-]*):([a-z][a-z0-9-]+)["'`]/gi,
    /:icon\s*=\s*["'`]['"`]([a-z][a-z0-9-]*):([a-z][a-z0-9-]+)['"`]["'`]/gi,
    /\bicon\s*:\s*["'`]([a-z][a-z0-9-]*):([a-z][a-z0-9-]+)["'`]/gi,
    /(?:addIcon|getIcon|loadIcon)\s*\(\s*["'`]([a-z][a-z0-9-]*):([a-z][a-z0-9-]+)["'`]/gi,
    /\bname\s*=\s*["'`]([a-z][a-z0-9-]*):([a-z][a-z0-9-]+)["'`]/gi
  ]

  // 扫描收集图标
  const iconsByPrefix = new Map()

  for (const file of files) {
    const content = preprocessContent(fs.readFileSync(file, 'utf-8'), file)

    for (const pattern of iconPatterns) {
      pattern.lastIndex = 0
      let match
      while ((match = pattern.exec(content)) !== null) {
        const [, prefix, iconName] = match
        if (isValidIcon(prefix, iconName)) {
          if (!iconsByPrefix.has(prefix.toLowerCase())) {
            iconsByPrefix.set(prefix.toLowerCase(), new Set())
          }
          iconsByPrefix.get(prefix.toLowerCase()).add(iconName.toLowerCase())
        }
      }
    }
  }

  // 验证并提取图标
  const iconifyJsonDir = path.resolve(process.cwd(), CONFIG.iconifyJsonDir)
  const outputCollections = []
  const collectionStats = [] // 记录每个图标集的统计信息
  const missingIcons = []
  let totalFound = 0

  for (const [prefix, iconNames] of iconsByPrefix) {
    const jsonPath = path.join(iconifyJsonDir, `${prefix}.json`)
    if (!fs.existsSync(jsonPath)) continue

    const fullCollection = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
    const slimCollection = {
      prefix: fullCollection.prefix,
      icons: {},
      ...(fullCollection.width && { width: fullCollection.width }),
      ...(fullCollection.height && { height: fullCollection.height })
    }

    let foundInCollection = 0

    for (const iconName of iconNames) {
      if (fullCollection.icons[iconName]) {
        slimCollection.icons[iconName] = fullCollection.icons[iconName]
        totalFound++
        foundInCollection++
      } else if (fullCollection.aliases?.[iconName]) {
        slimCollection.aliases = slimCollection.aliases || {}
        slimCollection.aliases[iconName] = fullCollection.aliases[iconName]
        const parentName = fullCollection.aliases[iconName].parent
        if (fullCollection.icons[parentName]) {
          slimCollection.icons[parentName] = fullCollection.icons[parentName]
        }
        totalFound++
        foundInCollection++
      } else {
        missingIcons.push(`${prefix}:${iconName}`)
      }
    }

    if (Object.keys(slimCollection.icons).length > 0) {
      outputCollections.push(slimCollection)
      collectionStats.push({ prefix, count: foundInCollection })
    }
  }

  // 写入文件
  const outputPath = path.resolve(process.cwd(), CONFIG.outputPath)
  fs.mkdirSync(path.dirname(outputPath), { recursive: true })
  fs.writeFileSync(outputPath, JSON.stringify(outputCollections, null, 2))

  // 输出报告
  const slimSize = fs.statSync(outputPath).size
  console.log('\n' + '='.repeat(50))
  console.log('📊 提取报告')
  console.log('='.repeat(50))
  console.log(`✅ 成功提取: ${totalFound} 个图标，来自 ${outputCollections.length} 个图标集\n`)

  // 打印图标集详情
  console.log('📦 图标集详情:')
  collectionStats
    .sort((a, b) => b.count - a.count)
    .forEach(({ prefix, count }) => {
      console.log(`   - ${prefix}: ${count} 个图标`)
    })

  if (missingIcons.length > 0) {
    console.log(`\n⚠️  未找到的图标: ${missingIcons.length} 个`)
    missingIcons.slice(0, 10).forEach(name => console.log(`   - ${name}`))
    if (missingIcons.length > 10) console.log(`   ... 还有 ${missingIcons.length - 10} 个`)
  }

  console.log(`\n📦 精简图标集大小: ${(slimSize / 1024).toFixed(2)} KB`)
  console.log(`✅ 已生成: ${CONFIG.outputPath}`)
}

extractIcons()
