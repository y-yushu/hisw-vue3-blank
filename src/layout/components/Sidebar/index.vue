<script setup lang="ts">
import Logo from './logo.vue'
import { useAppStoreOutside } from '@/store/app'
import Svg1 from '@/assets/svg/t1.svg'
console.log('🚀 ~ Svg1:', Svg1)

defineOptions({
  name: 'Sidebar'
})

const useAppStore = useAppStoreOutside()
function tttt() {
  useAppStore.toggleOpened()
  inverted.value = !inverted.value
}

const inverted = ref(false)

const menuOptions = [
  {
    label: '且听风吟',
    key: 'hear-the-wind-sing',
    icon: () => h(Svg1)
    // icon: renderIcon(BookIcon)
  },
  {
    label: '1973年的弹珠玩具',
    key: 'pinball-1973',
    // icon: renderIcon(BookIcon),
    disabled: true,
    children: [
      {
        label: '鼠',
        key: 'rat'
      }
    ]
  },
  {
    label: '寻羊冒险记',
    key: 'a-wild-sheep-chase',
    disabled: true
    // icon: renderIcon(BookIcon)
  },
  {
    label: '舞，舞，舞',
    key: 'dance-dance-dance',
    // icon: renderIcon(BookIcon),
    children: [
      {
        type: 'group',
        label: '人物',
        key: 'people',
        children: [
          {
            label: '叙事者',
            key: 'narrator'
            // icon: renderIcon(PersonIcon)
          },
          {
            label: '羊男',
            key: 'sheep-man'
            // icon: renderIcon(PersonIcon)
          }
        ]
      },
      {
        label: '饮品',
        key: 'beverage',
        // icon: renderIcon(WineIcon),
        children: [
          {
            label: '威士忌',
            key: 'whisky'
          }
        ]
      },
      {
        label: '食物',
        key: 'food',
        children: [
          {
            label: '三明治',
            key: 'sandwich'
          }
        ]
      },
      {
        label: '过去增多，未来减少',
        key: 'the-past-increases-the-future-recedes'
      }
    ]
  }
]
</script>

<template>
  <n-scrollbar class="h-full">
    <n-button @click="tttt">123</n-button>
    <Logo />
    <n-menu :collapsed="inverted" :collapsed-width="64" :collapsed-icon-size="24" :options="menuOptions" />
  </n-scrollbar>
</template>
