<script setup lang="ts">
import { usePageTableHook } from '@/hooks/usePageTableHook'
import { getDictType } from '@/api/system/dict'

interface Query {
  dictName: string
  dictType: string
  status: string
  range: string[]
}

interface TableItem {
  createBy: string
  createTime: string
  updateBy: string | null
  updateTime: string | null
  remark: string
  dictId: number
  dictName: string
  dictType: string
  status: string
}

const { query, tableList, pagination } = usePageTableHook<Query, TableItem>(getDictType, {
  dictName: '',
  dictType: '',
  status: '',
  range: []
})
console.log('🚀 ~ pagination:', pagination)
console.log('🚀 ~ query:', query)
console.log('🚀 ~ tableList:', tableList)
</script>

<template>
  <div class="h-full p-4">
    <!-- 右侧主要内容 -->
    <n-card>
      <span>你好</span>
    </n-card>
  </div>
</template>

<style scoped></style>
