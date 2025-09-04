<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { NButton, NInput, NSelect, NDataTable, NPagination, NTree, NSwitch, NSpace, NCard, NForm, NFormItem, NGrid, NFormItemGi, useMessage } from 'naive-ui'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import FormDialog, { type FormFieldConfig } from '@/components/FormDialog/index.vue'

// 消息提示
const message = useMessage()

// 搜索表单
const searchForm = reactive({
  userName: '',
  userNickName: '',
  phonenumber: '',
  status: null,
  deptId: null
})

// 分页信息
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 2,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
})

// 部门树数据
const deptTreeData = ref([
  {
    key: '100',
    label: '若依科技',
    children: [
      {
        key: '101',
        label: '深圳公司',
        children: [
          { key: '103', label: '研发部门' },
          { key: '104', label: '市场部门' },
          { key: '105', label: '测试部门' },
          { key: '106', label: '财务部门' },
          { key: '107', label: '运维部门' }
        ]
      },
      {
        key: '102',
        label: '长沙公司',
        children: [
          { key: '108', label: '市场部门' },
          { key: '109', label: '财务部门' }
        ]
      }
    ]
  }
])

// 用户列表数据
const userList = ref([
  {
    userId: 1,
    userName: 'admin',
    nickName: '若依',
    deptName: '研发部门',
    phonenumber: '15888888888',
    status: '0',
    createTime: '2025-05-26 10:07:46'
  },
  {
    userId: 2,
    userName: 'ry',
    nickName: '若依',
    deptName: '测试部门',
    phonenumber: '15666666666',
    status: '0',
    createTime: '2025-05-26 10:07:47'
  }
])

// 表格列定义
const columns = [
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
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center',
    render: (row: any) => {
      return h(NSwitch, {
        value: row.status === '0',
        onUpdateValue: (value: boolean) => {
          handleStatusChange(row, value)
        }
      })
    }
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 160
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    align: 'center',
    render: (row: any) => {
      return h('div', { class: 'flex gap-2 justify-center' }, [
        h(NButton, {
          size: 'small',
          type: 'primary',
          text: true,
          onClick: () => handleEdit(row)
        }, { default: () => '修改' }),
        h(NButton, {
          size: 'small',
          type: 'error',
          text: true,
          onClick: () => handleDelete(row)
        }, { default: () => '删除' }),
        h(NButton, {
          size: 'small',
          type: 'info',
          text: true,
          onClick: () => handleResetPwd(row)
        }, { default: () => '重置' })
      ])
    }
  }
]

// 状态选项
const statusOptions = [
  { label: '正常', value: '0' },
  { label: '停用', value: '1' }
]

// 选中的部门
const selectedDept = ref<string | null>(null)

// 搜索表单ref
const searchFormRef = ref()

// 对话框状态
const dialogVisible = ref(false)
const dialogLoading = ref(false)
const dialogTitle = ref('新增用户')
const currentUserData = ref<any>({})

// 用户表单字段配置
const userFormFields: FormFieldConfig[] = [
  {
    key: 'userName',
    label: '用户名称',
    type: 'input',
    placeholder: '请输入用户名称',
    required: true,
    span: 1
  },
  {
    key: 'nickName',
    label: '用户昵称',
    type: 'input',
    placeholder: '请输入用户昵称',
    required: true,
    span: 1
  },
  {
    key: 'deptId',
    label: '归属部门',
    type: 'select',
    placeholder: '请选择归属部门',
    required: true,
    span: 1,
    options: [
      { label: '研发部门', value: '103' },
      { label: '市场部门', value: '104' },
      { label: '测试部门', value: '105' },
      { label: '财务部门', value: '106' },
      { label: '运维部门', value: '107' }
    ]
  },
  {
    key: 'phonenumber',
    label: '手机号码',
    type: 'input',
    placeholder: '请输入手机号码',
    span: 1,
    rules: [
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ]
  },
  {
    key: 'email',
    label: '邮箱',
    type: 'input',
    placeholder: '请输入邮箱',
    span: 1,
    rules: [
      { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ]
  },
  {
    key: 'sex',
    label: '用户性别',
    type: 'radio',
    span: 1,
    defaultValue: '0',
    options: [
      { label: '男', value: '0' },
      { label: '女', value: '1' }
    ]
  },
  {
    key: 'status',
    label: '状态',
    type: 'radio',
    span: 1,
    defaultValue: '0',
    options: [
      { label: '正常', value: '0' },
      { label: '停用', value: '1' }
    ]
  },
  {
    key: 'postIds',
    label: '岗位',
    type: 'checkbox',
    span: 1,
    options: [
      { label: '董事长', value: '1' },
      { label: '项目经理', value: '2' },
      { label: '人力资源', value: '3' },
      { label: '普通员工', value: '4' }
    ]
  },
  {
    key: 'roleIds',
    label: '角色',
    type: 'checkbox',
    span: 1,
    options: [
      { label: '超级管理员', value: '1' },
      { label: '普通角色', value: '2' }
    ]
  },
  {
    key: 'remark',
    label: '备注',
    type: 'textarea',
    placeholder: '请输入内容',
    span: 2,
    props: {
      rows: 3
    }
  }
]

// 事件处理函数
const handleSearch = () => {
  message.info('搜索功能')
  // 这里添加搜索逻辑
}

const handleReset = () => {
  // 使用表单的重置方法
  searchFormRef.value?.restoreValidation()
  Object.assign(searchForm, {
    userName: '',
    userNickName: '',
    phonenumber: '',
    status: null,
    deptId: null
  })
  message.info('重置搜索条件')
}

const handleAdd = () => {
  dialogTitle.value = '新增用户'
  currentUserData.value = {}
  dialogVisible.value = true
}

const handleEdit = (row: any) => {
  dialogTitle.value = '修改用户'
  currentUserData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = (row: any) => {
  message.warning(`删除用户: ${row.userName}`)
}

const handleResetPwd = (row: any) => {
  message.info(`重置密码: ${row.userName}`)
}

const handleBatchDelete = () => {
  message.warning('批量删除')
}

const handleImport = () => {
  message.info('导入数据')
}

const handleExport = () => {
  message.info('导出数据')
}

const handleStatusChange = (row: any, value: boolean) => {
  row.status = value ? '0' : '1'
  message.success(`${value ? '启用' : '停用'}用户: ${row.userName}`)
}

const handleDeptSelect = (keys: string[]) => {
  selectedDept.value = keys[0] || null
  message.info(`选择部门: ${keys[0] || '全部'}`)
}

const handlePageChange = (page: number) => {
  pagination.page = page
  message.info(`切换到第 ${page} 页`)
}

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  message.info(`每页显示 ${pageSize} 条`)
}

// 对话框确认
const handleDialogConfirm = async (formData: Record<string, any>) => {
  dialogLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (currentUserData.value.userId) {
      // 编辑用户
      const index = userList.value.findIndex(user => user.userId === currentUserData.value.userId)
      if (index !== -1) {
        userList.value[index] = { ...userList.value[index], ...formData }
      }
      message.success('修改用户成功')
    } else {
      // 新增用户
      const newUser = {
        userId: userList.value.length + 1,
        ...formData,
        createTime: new Date().toLocaleString('zh-CN')
      }
      userList.value.push(newUser)
      pagination.itemCount = userList.value.length
      message.success('新增用户成功')
    }
    
    dialogVisible.value = false
  } catch (error) {
    message.error('操作失败')
  } finally {
    dialogLoading.value = false
  }
}

// 对话框取消
const handleDialogCancel = () => {
  dialogVisible.value = false
}

onMounted(() => {
  // 初始化数据加载
})
</script>

<template>
  <div class="user-management p-4">
    <div class="flex gap-4 h-full">
      <!-- 左侧部门树 -->
      <div class="w-64 flex-shrink-0">
        <NCard title="部门" class="h-full">
          <NTree
            :data="deptTreeData"
            selectable
            expand-on-click
            :default-expanded-keys="['100', '101', '102']"
            @update:selected-keys="handleDeptSelect"
            class="dept-tree"
          />
        </NCard>
      </div>

      <!-- 右侧主要内容 -->
      <div class="flex-1 flex flex-col">
        <!-- 搜索区域 -->
        <NCard class="mb-4">
          <NForm
            ref="searchFormRef"
            :model="searchForm"
            label-placement="left"
            label-width="auto"
            size="small"
          >
            <NGrid :cols="4" :x-gap="12">
              <NFormItemGi label="用户名称">
                <NInput
                  v-model:value="searchForm.userName"
                  placeholder="请输入用户名称"
                  clearable
                />
              </NFormItemGi>
              <NFormItemGi label="用户昵称">
                <NInput
                  v-model:value="searchForm.userNickName"
                  placeholder="请输入用户昵称"
                  clearable
                />
              </NFormItemGi>
              <NFormItemGi label="手机号码">
                <NInput
                  v-model:value="searchForm.phonenumber"
                  placeholder="请输入手机号码"
                  clearable
                />
              </NFormItemGi>
              <NFormItemGi label="状态">
                <NSelect
                  v-model:value="searchForm.status"
                  :options="statusOptions"
                  placeholder="用户状态"
                  clearable
                />
              </NFormItemGi>
            </NGrid>
            
            <div class="flex justify-start items-center mt-4">
              <NSpace>
                <NButton type="primary" @click="handleSearch">
                  搜索
                </NButton>
                <NButton @click="handleReset">
                  重置
                </NButton>
              </NSpace>
            </div>
          </NForm>
        </NCard>

        <!-- 操作工具栏 -->
        <NCard class="mb-4">
          <div class="flex justify-between items-center">
            <NSpace>
              <NButton type="primary" @click="handleAdd">
                新增
              </NButton>
              <NButton type="info" @click="handleEdit">
                修改
              </NButton>
              <NButton type="error" @click="handleBatchDelete">
                删除
              </NButton>
              <NButton type="warning" @click="handleImport">
                导入
              </NButton>
              <NButton type="success" @click="handleExport">
                导出
              </NButton>
            </NSpace>
          </div>
        </NCard>

        <!-- 数据表格 -->
        <NCard class="flex-1">
          <NDataTable
            :columns="columns"
            :data="userList"
            :pagination="false"
            :bordered="true"
            :single-line="false"
            size="small"
            class="user-table"
          />
          
          <!-- 分页 -->
          <div class="flex justify-between items-center mt-4 pt-4">
            <div class="text-sm text-gray-500">
              共 {{ pagination.itemCount }} 条
            </div>
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
              <template #prefix="{ itemCount }">
                {{ pagination.pageSize }} 条/页
              </template>
            </NPagination>
          </div>
        </NCard>
      </div>
    </div>

    <!-- 用户表单对话框 -->
    <FormDialog
      v-model:show="dialogVisible"
      :title="dialogTitle"
      :fields="userFormFields"
      :form-data="currentUserData"
      :loading="dialogLoading"
      :width="800"
      :cols="2"
      @confirm="handleDialogConfirm"
      @cancel="handleDialogCancel"
    />
  </div>
</template>

<style lang="scss" scoped>
.user-management {
  height: calc(100vh - 120px);
}

.dept-tree {
  :deep(.n-tree-node-content) {
    padding: 4px 8px;
    border-radius: 4px;
    
    &:hover {
      background-color: #f5f5f5;
    }
  }
  
  :deep(.n-tree-node-content--selected) {
    background-color: #e6f7ff;
    color: #1890ff;
  }
}

</style>
