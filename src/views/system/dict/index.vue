<script setup lang="ts">
import { usePageTableHook } from '@/hooks/usePageTableHook'
import { getDictType } from '@/api/system/dict'
import { NTag, NButton, NSpace, NIcon, type DataTableColumns, useMessage } from 'naive-ui'
import { Icon } from '@iconify/vue'
import { h, ref, computed } from 'vue'

interface Query {
  dictName: string
  dictType: string
  status: string
  range: [string, string] | null
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

// 状态选项
const statusOptions = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
]

// 使用消息提示
const message = useMessage()

// 使用hook获取表格数据
const { query, handleReset, tableList, getList, pagination, handlePageChange, handlePageSizeChange } = usePageTableHook<Query, TableItem>(getDictType, {
  dictName: '',
  dictType: '',
  status: '',
  range: null
})

// 选中行管理
const checkedRowKeys = ref<(string | number)[]>([])
const singleCheckedRow = ref<TableItem | null>(null)

// 计算按钮状态
const canEdit = computed(() => singleCheckedRow.value !== null)
const canDelete = computed(() => checkedRowKeys.value.length > 0)

// 行选择处理
const handleCheck = (rowKeys: (string | number)[], rows: TableItem[]) => {
  checkedRowKeys.value = rowKeys
  singleCheckedRow.value = rows.length === 1 ? rows[0] : null
}
console.log('🚀 ~ handleCheck ~ handleCheck:', handleCheck)

// 定义表格列
const columns: DataTableColumns<TableItem> = [
  { type: 'selection' },
  {
    title: '字典编号',
    key: 'dictId',
    width: 100,
    sorter: 'default'
  },
  {
    title: '字典名称',
    key: 'dictName'
  },
  {
    title: '字典类型',
    key: 'dictType'
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    render(row) {
      return h(
        NTag,
        {
          type: row.status === '0' ? 'success' : 'error',
          size: 'small',
          round: true,
          bordered: false
        },
        { default: () => (row.status === '0' ? '正常' : '停用') }
      )
    }
  },
  {
    title: '备注',
    key: 'remark',
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: '创建者',
    key: 'createBy'
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160
  },
  {
    title: '操作',
    key: 'actions',
    width: 140,
    fixed: 'right',
    render(row) {
      return h(
        NSpace,
        { size: 'small', justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                type: 'primary',
                onClick: () => handleEdit(row)
              },
              {
                default: () => '修改'
              }
            ),
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                type: 'error',
                onClick: () => handleDelete(row)
              },
              {
                default: () => '删除'
              }
            )
          ]
        }
      )
    }
  }
]

// 处理查询
const handleQuery = () => {
  pagination.page = 1
  getList()
}

// 处理新增
const handleAdd = () => {
  message.success('新增字典')
  // 这里可以添加新增字典的逻辑
}

// 处理编辑
const handleEdit = (row: TableItem) => {
  message.info(`编辑字典: ${row.dictName}`)
  // 这里可以添加编辑字典的逻辑
}

// 处理编辑
const handleEdit2 = (row: TableItem | null) => {
  console.log('🚀 ~ handleEdit2 ~ row:', row)
  // 这里可以添加编辑字典的逻辑
}

// 处理删除
const handleDelete = (row: TableItem) => {
  message.warning(`删除字典: ${row.dictName}`)
  // 这里可以添加删除字典的逻辑
}
// 处理删除
const handleDelete2 = (e: MouseEvent) => {
  console.log('🚀 ~ handleDelete2 ~ e:', e)
  // message.warning(`删除字典: ${row.dictName}`)
  // 这里可以添加删除字典的逻辑
}

// 处理导出
const handleExport = () => {
  message.success('导出数据')
  // 这里可以添加导出逻辑
}
</script>

<template>
  <div class="h-full w-full p-4">
    <n-card class="flex h-full flex-col" :bordered="false" size="small">
      <!-- 顶部检索条件 -->
      <div class="mb-4 flex justify-between">
        <div class="flex flex-1 items-center gap-4">
          <!-- 字典名称 -->
          <div class="flex items-center">
            <span class="mr-2 whitespace-nowrap">字典名称：</span>
            <n-input v-model:value="query.dictName" placeholder="请输入字典名称" clearable size="small" class="w-40" />
          </div>

          <!-- 字典类型 -->
          <div class="flex items-center">
            <span class="mr-2 whitespace-nowrap">字典类型：</span>
            <n-input v-model:value="query.dictType" placeholder="请输入字典类型" clearable size="small" class="w-40" />
          </div>

          <!-- 状态 -->
          <div class="flex items-center">
            <span class="mr-2 whitespace-nowrap">状态：</span>
            <n-select v-model:value="query.status" :options="statusOptions" placeholder="请选择状态" clearable size="small" class="w-32" />
          </div>

          <!-- 创建时间 -->
          <div class="flex items-center">
            <span class="mr-2 whitespace-nowrap">创建时间：</span>
            <n-date-picker
              v-model:formatted-value="query.range"
              type="daterange"
              value-format="yyyy-MM-dd"
              placeholder="请选择创建时间范围"
              clearable
              size="small"
              class="w-60"
            />
          </div>
        </div>

        <!-- 查询和重置按钮 -->
        <div class="ml-4 flex items-center gap-2">
          <n-button type="primary" @click="handleQuery" size="small">
            <template #icon>
              <n-icon><Icon icon="mdi:magnify" /></n-icon>
            </template>
            查询
          </n-button>
          <n-button @click="handleReset" size="small">
            <template #icon>
              <n-icon><Icon icon="mdi:refresh" /></n-icon>
            </template>
            重置
          </n-button>
        </div>
      </div>

      <!-- 工具条按钮 -->
      <div class="mb-4 flex">
        <n-space>
          <n-button type="primary" @click="handleAdd" size="small">
            <template #icon>
              <n-icon><Icon icon="mdi:plus" /></n-icon>
            </template>
            新增
          </n-button>
          <n-button type="info" @click="handleEdit2(singleCheckedRow)" size="small" :disabled="!canEdit">
            <template #icon>
              <n-icon><Icon icon="mdi:pencil" /></n-icon>
            </template>
            修改
          </n-button>
          <n-button type="warning" @click="handleDelete2" size="small" :disabled="!canDelete">
            <template #icon>
              <n-icon><Icon icon="mdi:delete" /></n-icon>
            </template>
            删除
          </n-button>
          <n-button type="error" @click="handleExport" size="small">
            <template #icon>
              <n-icon><Icon icon="mdi:file-export" /></n-icon>
            </template>
            导出
          </n-button>
        </n-space>
      </div>

      <!-- 表格区域 -->
      <div class="flex flex-1 flex-col">
        <n-data-table
          :columns="columns"
          :data="tableList"
          :pagination="pagination"
          :bordered="false"
          :row-key="row => row.dictId"
          :size="'small'"
          :max-height="'100%'"
          :scroll-x="1200"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
          striped
        />
        <!-- @update:checked-row-keys="handleCheck" -->
      </div>
    </n-card>
  </div>
</template>

<style scoped>
:deep(.n-data-table-td) {
  padding: 8px !important;
}

:deep(.n-pagination) {
  margin-top: 8px;
  justify-content: flex-end;
}

:deep(.n-tag) {
  display: flex;
  justify-content: center;
  width: 60px;
  padding: 0 8px;
}
</style>
