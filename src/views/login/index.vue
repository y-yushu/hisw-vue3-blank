<script setup lang="ts">
import { ref, reactive } from 'vue'

// 表单模型
const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  rememberMe: false
})

// 表单校验规则（可根据 Naive UI 规则后续实现）
const loginRules = {}

// 验证码开关
const captchaOnOff = ref(false)

// 验证码图片 URL
const codeUrl = ref('')

// 登录按钮 loading 状态
const loading = ref(false)

// 是否显示注册链接
const register = ref(true)

// 方法占位，后续实现逻辑
function handleLogin() {
  console.log('登录逻辑待实现', loginForm)
}

function getCode() {
  console.log('刷新验证码逻辑待实现')
}
</script>
<template>
  <div class="login flex h-full items-center justify-center">
    <n-form :model="loginForm" :rules="loginRules" ref="loginForm" class="login-form">
      <h3 class="title">浦东安监系统</h3>

      <!-- 用户名 -->
      <n-form-item path="username">
        <n-input v-model="loginForm.username" placeholder="账号">
          <template #prefix>
            <!-- <svg-icon icon-class="user" class="input-icon" /> -->
          </template>
        </n-input>
      </n-form-item>

      <!-- 密码 -->
      <n-form-item path="password">
        <n-input v-model="loginForm.password" type="password" placeholder="密码" @keyup.enter="handleLogin">
          <template #prefix>
            <!-- <svg-icon icon-class="password" class="input-icon" /> -->
          </template>
        </n-input>
      </n-form-item>

      <!-- 验证码 -->
      <n-form-item path="code" class="login-code">
        <n-input v-model="loginForm.code" placeholder="验证码" @keyup.enter="handleLogin" style="width: 63%">
          <template #prefix>
            <!-- <svg-icon icon-class="validCode" class="input-icon" /> -->
          </template>
        </n-input>
        <img :src="codeUrl" @click="getCode" class="login-code-img" />
      </n-form-item>

      <!-- 记住密码 -->
      <n-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 25px 0px">记住密码</n-checkbox>

      <!-- 登录按钮 + 注册 -->
      <n-form-item style="width: 100%">
        <n-button :loading="loading" type="primary" block @click="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </n-button>
        <div v-if="register" style="float: right">
          <router-link class="link-type" :to="'/register'">立即注册</router-link>
        </div>
      </n-form-item>
    </n-form>

    <!-- 底部版权 -->
    <div class="el-login-footer">
      <span>Copyright © 2018-2022 hisw.vip All Rights Reserved.</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  background-image: url('@/assets/images/login-background.jpg');
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;

  .n-input {
    height: 38px;
    input {
      height: 38px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
