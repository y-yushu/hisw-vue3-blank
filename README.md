# hisw-admin-vue3

框架：
Vue 3 + TypeScript + Vite + tailwindcss + naive-ui + pinia

## 开发规范

### naiveui使用

1. 组件已全局引入，可在vue文件中直接使用
2. `useMessage`等方法在`setup`可直接使用
3. `useMessage`在`setup`外部需通过`src\utils\message.ts`引入使用
4. 每个路由页需要有一个根div标签，不要以`n-scrollbar`等多节点标签作为根标签

### icon使用

1. 通过`@iconify/vue`引入图标

已通过全局注册`Icon`组件，示例：

```html
<n-icon size="24">
  <Icon icon="material-symbols:search-rounded" />
</n-icon>
```

2. 通过`svg-icon`组件引入图标

已通过全局注册`SvgIcon`组件，示例：

```html
<svg-icon name="icon-name" color="red" size="24" />
```

3. 通过阿里图标库引入

## 代码规范

### 错误检查

- 错误检查

```shell
pnpm run lint
```

- 错误修复

```shell
pnpm run lint:fix
```
