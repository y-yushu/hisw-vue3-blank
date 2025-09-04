<script setup lang="ts">
import { ref, reactive, watch, nextTick } from 'vue'
import { NModal, NCard, NForm, NFormItem, NGrid, NFormItemGi, NButton, NSpace, NInput, NSelect, NSwitch, NDatePicker, NInputNumber, NRadioGroup, NRadio, NCheckboxGroup, NCheckbox, useMessage } from 'naive-ui'

// 字段类型定义
export interface FormFieldConfig {
  key: string // 字段键名
  label: string // 字段标签
  type: 'input' | 'select' | 'switch' | 'date' | 'number' | 'radio' | 'checkbox' | 'textarea' // 字段类型
  placeholder?: string // 占位符
  required?: boolean // 是否必填
  options?: Array<{ label: string; value: any }> // 选项（用于select、radio、checkbox）
  span?: number // 占据的网格列数，默认为1
  rules?: Array<any> // 验证规则
  disabled?: boolean // 是否禁用
  defaultValue?: any // 默认值
  props?: Record<string, any> // 额外的组件属性
}

// 组件属性定义
interface Props {
  show: boolean // 是否显示对话框
  title?: string // 对话框标题
  fields: FormFieldConfig[] // 表单字段配置
  formData?: Record<string, any> // 表单数据
  loading?: boolean // 是否加载中
  width?: number // 对话框宽度
  cols?: number // 网格列数
}

// 组件事件定义
interface Emits {
  (e: 'update:show', value: boolean): void
  (e: 'confirm', formData: Record<string, any>): void
  (e: 'cancel'): void
}

const props = withDefaults(defineProps<Props>(), {
  title: '表单',
  loading: false,
  width: 600,
  cols: 2
})

const emit = defineEmits<Emits>()

const message = useMessage()

// 表单引用
const formRef = ref()

// 内部表单数据
const internalFormData = reactive<Record<string, any>>({})

// 表单规则
const formRules = computed(() => {
  const rules: Record<string, any> = {}
  props.fields.forEach(field => {
    if (field.required || field.rules) {
      rules[field.key] = [
        ...(field.required ? [{ required: true, message: `请输入${field.label}`, trigger: ['blur', 'input'] }] : []),
        ...(field.rules || [])
      ]
    }
  })
  return rules
})

// 监听外部传入的表单数据
watch(() => props.formData, (newData) => {
  if (newData) {
    Object.assign(internalFormData, newData)
  }
}, { immediate: true, deep: true })

// 监听对话框显示状态
watch(() => props.show, (show) => {
  if (show) {
    nextTick(() => {
      // 初始化表单数据
      initFormData()
    })
  }
})

// 初始化表单数据
const initFormData = () => {
  props.fields.forEach(field => {
    if (!(field.key in internalFormData)) {
      internalFormData[field.key] = field.defaultValue ?? (
        field.type === 'switch' ? false :
        field.type === 'number' ? 0 :
        field.type === 'checkbox' ? [] :
        ''
      )
    }
  })
}

// 渲染表单字段
const renderFormField = (field: FormFieldConfig) => {
  const commonProps = {
    placeholder: field.placeholder,
    disabled: field.disabled,
    ...field.props
  }

  switch (field.type) {
    case 'input':
      return h(NInput, {
        value: internalFormData[field.key],
        'onUpdate:value': (value: string) => {
          internalFormData[field.key] = value
        },
        ...commonProps
      })
    
    case 'textarea':
      return h(NInput, {
        type: 'textarea',
        value: internalFormData[field.key],
        'onUpdate:value': (value: string) => {
          internalFormData[field.key] = value
        },
        ...commonProps
      })
    
    case 'select':
      return h(NSelect, {
        value: internalFormData[field.key],
        'onUpdate:value': (value: any) => {
          internalFormData[field.key] = value
        },
        options: field.options || [],
        ...commonProps
      })
    
    case 'switch':
      return h(NSwitch, {
        value: internalFormData[field.key],
        'onUpdate:value': (value: boolean) => {
          internalFormData[field.key] = value
        },
        ...commonProps
      })
    
    case 'date':
      return h(NDatePicker, {
        value: internalFormData[field.key],
        'onUpdate:value': (value: number | null) => {
          internalFormData[field.key] = value
        },
        type: 'date',
        ...commonProps
      })
    
    case 'number':
      return h(NInputNumber, {
        value: internalFormData[field.key],
        'onUpdate:value': (value: number | null) => {
          internalFormData[field.key] = value
        },
        ...commonProps
      })
    
    case 'radio':
      return h(NRadioGroup, {
        value: internalFormData[field.key],
        'onUpdate:value': (value: any) => {
          internalFormData[field.key] = value
        },
        ...commonProps
      }, {
        default: () => field.options?.map(option => 
          h(NRadio, { value: option.value }, { default: () => option.label })
        )
      })
    
    case 'checkbox':
      return h(NCheckboxGroup, {
        value: internalFormData[field.key],
        'onUpdate:value': (value: any[]) => {
          internalFormData[field.key] = value
        },
        ...commonProps
      }, {
        default: () => field.options?.map(option => 
          h(NCheckbox, { value: option.value }, { default: () => option.label })
        )
      })
    
    default:
      return h(NInput, {
        value: internalFormData[field.key],
        'onUpdate:value': (value: string) => {
          internalFormData[field.key] = value
        },
        ...commonProps
      })
  }
}

// 确认提交
const handleConfirm = async () => {
  try {
    await formRef.value?.validate()
    emit('confirm', { ...internalFormData })
  } catch (error) {
    message.error('请检查表单输入')
  }
}

// 取消
const handleCancel = () => {
  emit('cancel')
  emit('update:show', false)
}

// 关闭对话框
const handleClose = () => {
  emit('update:show', false)
}
</script>

<template>
  <NModal
    :show="show"
    :mask-closable="false"
    preset="card"
    :title="title"
    :style="{ width: `${width}px` }"
    @close="handleClose"
  >
    <NForm
      ref="formRef"
      :model="internalFormData"
      :rules="formRules"
      label-placement="left"
      label-width="auto"
      size="medium"
    >
      <NGrid :cols="cols" :x-gap="12" :y-gap="8">
        <NFormItemGi
          v-for="field in fields"
          :key="field.key"
          :label="field.label"
          :path="field.key"
          :span="field.span || 1"
        >
          <component :is="renderFormField(field)" />
        </NFormItemGi>
      </NGrid>
    </NForm>
    
    <template #footer>
      <NSpace justify="end">
        <NButton @click="handleCancel">取消</NButton>
        <NButton type="primary" :loading="loading" @click="handleConfirm">
          确定
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style lang="scss" scoped>
:deep(.n-card-header) {
  padding: 20px 24px 0;
}

:deep(.n-card__content) {
  padding: 20px 24px;
}

:deep(.n-card__footer) {
  padding: 12px 24px 20px;
}
</style>
