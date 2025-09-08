<script setup lang="ts">
import { usePageTableHook } from '@/hooks/usePageTableHook'
import { getDictType } from '@/api/system/dict'
import { NTag, NButton, NSpace, NIcon, type DataTableColumns } from 'naive-ui'
import { Icon } from '@iconify/vue'

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

// 表单折叠状态
const isCollapsed = ref(false)

// 使用消息提示
const message = useMessage()

// 使用hook获取表格数据
const { query, handleReset, tableList, getList, pagination, handlePageChange, handlePageSizeChange } = usePageTableHook<Query, TableItem>(getDictType, {
  dictName: '',
  dictType: '',
  status: '',
  range: null
})

// 定义表格列
const columns: DataTableColumns<TableItem> = [
  {
    title: '字典编号',
    key: 'dictId',
    width: 100
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
    render(row) {
      return h(
        NTag,
        {
          type: row.status === '0' ? 'success' : 'error',
          size: 'small'
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
    key: 'createTime'
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render(row) {
      return h(
        NSpace,
        { justify: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                type: 'primary',
                onClick: () => handleEdit(row)
              },
              {
                default: () => '编辑',
                icon: () => h(Icon, { icon: 'mdi:pencil' })
              }
            ),
            h(
              NButton,
              {
                size: 'small',
                type: 'error',
                onClick: () => handleDelete(row)
              },
              // { default: () => '删除', icon: () => h(NIcon, null, { default: () => h(DeleteOutlined) }) }
              { default: () => '删除', icon: () => h(NIcon, null) }
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
  message.info('新增字典')
  // 这里可以添加新增字典的逻辑
}

// 处理编辑
const handleEdit = (row: TableItem) => {
  message.info(`编辑字典: ${row.dictName}`)
  // 这里可以添加编辑字典的逻辑
}

// 处理删除
const handleDelete = (row: TableItem) => {
  message.info(`删除字典: ${row.dictName}`)
  // 这里可以添加删除字典的逻辑
}

// 切换表单展开/折叠
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div class="flex h-full flex-col gap-4 p-4">
    <!-- 查询表单卡片 -->
    <n-card>
      <div class="flex flex-col gap-4">
        <div :class="isCollapsed ? 'grid grid-cols-3 gap-4' : 'grid grid-cols-3 gap-x-4 gap-y-2'">
          <!-- 字典名称 -->
          <n-form-item label="字典名称" size="small">
            <n-input v-model:value="query.dictName" placeholder="请输入字典名称" clearable />
          </n-form-item>

          <!-- 字典类型 -->
          <n-form-item label="字典类型" size="small">
            <n-input v-model:value="query.dictType" placeholder="请输入字典类型" clearable />
          </n-form-item>

          <!-- 状态 -->
          <n-form-item label="状态" size="small">
            <n-select v-model:value="query.status" :options="statusOptions" placeholder="请选择状态" clearable />
          </n-form-item>

          <!-- 日期范围，只在展开时显示 -->
          <n-form-item v-if="!isCollapsed" label="创建时间" size="small" class="col-span-3 md:col-span-2">
            <n-date-picker
              v-model:formatted-value="query.range"
              type="daterange"
              value-format="yyyy.MM.dd HH:mm:ss"
              placeholder="请选择创建时间范围"
              clearable
            />
          </n-form-item>
        </div>

        <!-- 按钮区 -->
        <div class="flex justify-between">
          <div class="space-x-2">
            <n-button type="primary" @click="handleQuery" size="small">
              <template #icon>
                <n-icon>
                  <SearchOutlined />
                </n-icon>
              </template>
              查询
            </n-button>
            <n-button @click="handleReset" size="small">
              <template #icon>
                <n-icon>
                  <ReloadOutlined />
                </n-icon>
              </template>
              重置
            </n-button>
            <n-button type="default" size="small" @click="toggleCollapse">
              {{ isCollapsed ? '展开' : '收起' }}
            </n-button>
          </div>
          <n-button type="success" @click="handleAdd" size="small">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            新增
          </n-button>
        </div>
      </div>
    </n-card>

    <!-- 表格卡片 -->
    <n-card class="flex flex-1 flex-col overflow-hidden">
      <!-- 表格 -->
      <n-data-table
        :columns="columns"
        :data="tableList"
        :pagination="pagination"
        :bordered="false"
        size="small"
        class="flex-1"
        @update:page="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </n-card>
  </div>
</template>
