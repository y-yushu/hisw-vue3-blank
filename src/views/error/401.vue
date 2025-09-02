<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const handleGoHome = () => {
  router.push('/')
}

const handleGoLogin = () => {
  router.push('/login')
}

const handleGoBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
    <div class="text-center">
      <!-- 401 大号数字 -->
      <div class="text-9xl font-bold text-red-300 mb-4">401</div>
      
      <!-- 主标题 -->
      <h1 class="text-3xl font-bold text-gray-800 mb-4">无访问权限</h1>
      
      <!-- 描述信息 -->
      <p class="text-lg text-gray-600 mb-8 max-w-md">
        抱歉，您没有权限访问此页面，请联系管理员或重新登录。
      </p>
      
      <!-- 操作按钮 -->
      <div class="flex gap-4 justify-center flex-wrap">
        <n-button type="primary" size="large" @click="handleGoLogin">
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10,17 15,12 10,7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </n-icon>
          </template>
          重新登录
        </n-button>
        
        <n-button size="large" @click="handleGoHome">
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </n-icon>
          </template>
          返回首页
        </n-button>
        
        <n-button size="large" @click="handleGoBack">
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m12 19-7-7 7-7"/>
                <path d="M19 12H5"/>
              </svg>
            </n-icon>
          </template>
          返回上页
        </n-button>
      </div>
    </div>
    
    <!-- 装饰性图形 -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-20 h-20 bg-red-100 rounded-full opacity-50"></div>
      <div class="absolute top-40 right-20 w-16 h-16 bg-orange-100 rounded-full opacity-50"></div>
      <div class="absolute bottom-20 left-20 w-24 h-24 bg-pink-100 rounded-full opacity-50"></div>
      <div class="absolute bottom-40 right-10 w-12 h-12 bg-purple-100 rounded-full opacity-50"></div>
    </div>
  </div>
</template>
