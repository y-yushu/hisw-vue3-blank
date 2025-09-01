<script setup lang="ts">
import type { NForm } from 'naive-ui'
import { ref, reactive } from 'vue'
import { getCodeImg, type LoginRequest } from '@/api/login'
import { useUserStore } from '@/store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const message = useMessage()

// 表单模型
const loginForm = reactive<LoginRequest>({
  username: 'admin',
  // password: 'hisw123!@#',
  password: 'admin123',
  uuid: '',
  code: '',
  rememberMe: false
})

// 表单校验规则（可根据 Naive UI 规则后续实现）
const loginRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}

// 验证码图片 URL（示例）
const codeUrl = ref('')
// 登录按钮 loading 状态
const loading = ref(false)
// 是否显示注册链接
const register = ref(false)

const loginFormRef = ref<InstanceType<typeof NForm>>()
// 登录
function handleLogin() {
  loginFormRef.value?.validate(errors => {
    if (!errors) {
      loading.value = true
      console.log('登录逻辑待实现', loginForm)
      userStore
        .toLogin(loginForm)
        .then(() => {
          message.success('登录成功')
          router.push('/')
        })
        .catch(() => {
          loading.value = false
        })
    } else {
      console.log('校验失败', errors)
    }
  })
}

// 获取验证码
function getCode() {
  getCodeImg().then(res => {
    loginForm.uuid = res.uuid
    codeUrl.value = 'data:image/gif;base64,' + res.img
  })
}
getCode()
</script>

<template>
  <div class="login-back flex min-h-screen flex-col items-center justify-center bg-center">
    <!-- 登录表单卡片 -->
    <n-form
      :model="loginForm"
      :rules="loginRules"
      ref="loginFormRef"
      class="w-full max-w-md rounded-lg bg-white shadow-md"
      style="width: 400px; padding: 25px 25px 5px 25px"
    >
      <h3 class="mb-8 text-center text-xl font-medium text-gray-700">浦东安监系统</h3>

      <!-- 用户名 -->
      <n-form-item path="username" class="mb-4">
        <n-input v-model:value="loginForm.username" placeholder="账号" class="h-[38px]">
          <template #prefix>
            <div class="ml-2 flex items-center text-gray-400">
              <span>1</span>
            </div>
          </template>
        </n-input>
      </n-form-item>

      <!-- 密码 -->
      <n-form-item path="password" class="mb-4">
        <n-input v-model:value="loginForm.password" type="password" placeholder="密码" @keyup.enter="handleLogin" class="h-[38px]">
          <template #prefix>
            <div class="ml-2 flex items-center text-gray-400">
              <span>2</span>
            </div>
          </template>
        </n-input>
      </n-form-item>

      <!-- 验证码 -->
      <n-form-item path="code" class="mb-4">
        <div class="flex space-x-2">
          <n-input v-model:value="loginForm.code" placeholder="验证码" @keyup.enter="handleLogin" class="h-[38px]" style="width: 63%">
            <template #prefix>
              <div class="ml-2 flex items-center text-gray-400">
                <span>3</span>
              </div>
            </template>
          </n-input>
          <img :src="codeUrl" @click="getCode" alt="验证码" class="h-[38px] cursor-pointer" />
        </div>
      </n-form-item>

      <!-- 记住密码 -->
      <n-checkbox v-model:checked="loginForm.rememberMe" class="mb-6">
        <span class="text-sm text-gray-700">记住密码</span>
      </n-checkbox>

      <!-- 登录按钮 -->
      <n-form-item>
        <n-button :loading="loading" type="primary" block @click="handleLogin" class="h-[38px]">
          <span v-if="!loading">登 录</span>
          <span v-else>登录中...</span>
        </n-button>
      </n-form-item>

      <!-- 立即注册 - 单独一行并靠右 -->
      <div v-if="register" class="mb-4 text-right">
        <router-link class="text-sm text-blue-600 hover:text-blue-800" to="/register">立即注册</router-link>
      </div>
    </n-form>

    <!-- 底部版权 -->
    <div class="fixed bottom-0 w-full py-2 text-center text-xs text-white">
      <span>Copyright © 2018-{{ new Date().getFullYear() }} hisw.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<style scoped>
.login-back {
  background-image: url('@/assets/images/login-background.jpg');
  background-size: cover;
}
</style>
