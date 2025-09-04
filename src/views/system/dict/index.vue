<script setup lang="ts">
import type { TableColumn } from 'naive-ui/es/data-table/src/interface'

const searchForm = reactive({
  dictName: '',
  dictType: '',
  status: '',
  range: []
})

const statusOptions = [
  { value: '0', lable: '启用' },
  { value: '1', lable: '停用' }
]

function handleSearch() {
  console.log('触发搜索')
}

function handleReset() {
  console.log('触发重置')
}

// 表格列定义
const columns: TableColumn[] = [
  {
    title: '用户编号',
    key: 'userId',
    width: 100,
    align: 'center'
  },
  {
    title: '用户名称',
    key: 'userName',
    width: 120
  },
  {
    title: '用户昵称',
    key: 'nickName',
    width: 120
  },
  {
    title: '部门',
    key: 'deptName',
    width: 120
  },
  {
    title: '手机号码',
    key: 'phonenumber',
    width: 140
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160
  }
]

const userList = ref([])

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 2,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
})

const handlePageChange = (page: number) => {
  pagination.page = page
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
}
</script>

<template>
  <div class="h-full p-4">
    <!-- 右侧主要内容 -->
    <div class="flex flex-1 flex-col">
      <!-- 搜索区域 -->
      <NCard class="mb-4">
        <NForm ref="searchFormRef" :model="searchForm" label-placement="left" label-width="auto" size="small">
          <NGrid :cols="4" :x-gap="12">
            <NFormItemGi label="字典名称">
              <NInput v-model:value="searchForm.dictName" placeholder="请输入字典名称" clearable />
            </NFormItemGi>
            <NFormItemGi label="字典类型">
              <NInput v-model:value="searchForm.dictType" placeholder="请输入用户昵称" clearable />
            </NFormItemGi>
            <NFormItemGi label="状态">
              <NSelect v-model:value="searchForm.status" :options="statusOptions" placeholder="用户状态" clearable />
            </NFormItemGi>
            <NFormItemGi label="创建时间">
              <n-date-picker v-model:value="searchForm.range" type="daterange" clearable />
            </NFormItemGi>
          </NGrid>

          <div class="mt-4 flex items-center justify-start">
            <NSpace>
              <NButton type="primary" @click="handleSearch"> 搜索 </NButton>
              <NButton @click="handleReset"> 重置 </NButton>
            </NSpace>
          </div>
        </NForm>
      </NCard>

      <!-- 操作工具栏 -->
      <NCard class="mb-4">
        <div class="flex items-center justify-between">
          <NSpace>
            <!-- <NButton type="primary" @click="handleAdd"> 新增 </NButton>
            <NButton type="info" @click="handleEdit"> 修改 </NButton>
            <NButton type="error" @click="handleBatchDelete"> 删除 </NButton>
            <NButton type="warning" @click="handleImport"> 导入 </NButton>
            <NButton type="success" @click="handleExport"> 导出 </NButton> -->
          </NSpace>
        </div>
      </NCard>

      <!-- 数据表格 -->
      <NCard class="flex-1">
        <NDataTable :columns="columns" :data="userList" :pagination="false" :bordered="true" :single-line="false" size="small" class="user-table" />

        <!-- 分页 -->
        <div class="mt-4 flex items-center justify-between pt-4">
          <div class="text-sm text-gray-500">共 {{ pagination.itemCount }} 条</div>
          <NPagination
            v-model:page="pagination.page"
            v-model:page-size="pagination.pageSize"
            :item-count="pagination.itemCount"
            :page-sizes="pagination.pageSizes"
            show-size-picker
            show-quick-jumper
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
          >
            <template #prefix> {{ pagination.pageSize }} 条/页 </template>
          </NPagination>
        </div>
      </NCard>
    </div>
  </div>
</template>

<style scoped></style>
