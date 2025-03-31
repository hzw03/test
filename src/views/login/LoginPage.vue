<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <el-form
        :model="formModel"
        :rules="rules"
        ref="form"
        size="large"
        autocomplete="off"
        v-if="isRegister"
      >
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="userAccount">
          <el-input
            v-model="formModel.userAccount"
            :prefix-icon="User"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="userPhoneNumber">
          <el-input
            v-model="formModel.userPhoneNumber"
            :prefix-icon="Phone"
            placeholder="请输入手机号码"
          />
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            v-model="formModel.userPassword"
            :prefix-icon="Lock"
            :type="showRegisterPwd ? 'text' : 'password'"
            placeholder="请输入密码"
          >
            <template #suffix>
              <el-icon @click="showRegisterPwd = !showRegisterPwd">
                <component :is="showRegisterPwd ? View : Hide" />
              </el-icon> </template
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input
            v-model="formModel.checkPassword"
            :prefix-icon="Lock"
            :type="showCheckPwd ? 'text' : 'password'"
            placeholder="请再次输入密码"
          >
            <template #suffix>
              <el-icon @click="showCheckPwd = !showCheckPwd">
                <component :is="showCheckPwd ? View : Hide" />
              </el-icon> </template
          ></el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input v-model="formModel.captcha" placeholder="请输入验证码" />
            <img
              :src="captchaUrl"
              @click="loadCaptcha"
              class="captcha-img"
              title="点击刷新验证码"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="register" class="button" type="primary" auto-insert-space>
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false"> ← 返回 </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <el-form :model="formModel" :rules="rules" ref="form" size="large" autocomplete="off" v-else>
        <el-form-item>
          <div class="image-container">
            <img src="./../../assets/default.png" alt="" />
          </div>
        </el-form-item>
        <el-form-item prop="userAccount">
          <el-input
            v-model="formModel.userAccount"
            :prefix-icon="User"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="userPassword">
          <el-input
            v-model="formModel.userPassword"
            :prefix-icon="Lock"
            :type="showPassword ? 'text' : 'password'"
            placeholder="请输入密码"
          >
            <template #suffix>
              <el-icon
                :color="showPassword ? '#409eff' : '#c0c4cc'"
                @click="showPassword = !showPassword"
                style="cursor: pointer; margin-right: 8px"
              >
                <View v-if="showPassword" />
                <Hide v-else />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="captcha-container">
            <el-input v-model="formModel.captcha" placeholder="请输入验证码" />
            <img
              :src="captchaUrl"
              @click="loadCaptcha"
              class="captcha-img"
              title="点击刷新验证码"
            />
          </div>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="" :underline="false"
              >没有账户？<el-link type="primary" :underline="false" @click="isRegister = true">
                点击注册
              </el-link></el-link
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="login" class="button" type="primary" auto-insert-space>登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { User, Lock, Phone } from '@element-plus/icons-vue'
import { ref, watch, onMounted } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { View, Hide } from '@element-plus/icons-vue'

const isRegister = ref(false)
const form = ref()
const captchaUrl = ref('') // 验证码图片地址

const formModel = ref({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
  captcha: '',
  userPhoneNumber: ''
})

// 加载验证码方法
const loadCaptcha = () => {
  // 添加时间戳防止缓存
  captchaUrl.value = `http://172.18.65.209:8102/api/user/captcha?t=${new Date().getTime()}`
}

// 初始化加载验证码
onMounted(() => {
  loadCaptcha()
})

const rules = {
  userAccount: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为3-20位', trigger: 'blur' }
  ],
  userPassword: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '密码为6-12位非空字符', trigger: 'blur' },
    { pattern: /^\S{6,12}$/, message: '密码为6-12位非空字符', trigger: 'blur' }
  ],
  checkPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { min: 6, max: 12, message: '密码为6-12位非空字符', trigger: 'blur' },
    { pattern: /^\S{6,12}$/, message: '密码为6-12位非空字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== formModel.value.userPassword) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  userPhoneNumber: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号码格式不正确', trigger: 'blur' }
  ]
}

const register = async () => {
  await form.value.validate()
  console.log(formModel.value)
  const res = await userRegisterService(formModel.value)
  if (res.data.code === 0) {
    ElMessage.success('注册成功')
    isRegister.value = false
    loadCaptcha() // 注册成功后刷新验证码
  }
}

const userStore = useUserStore()
const router = useRouter()
const login = async () => {
  try {
    await form.value.validate()
    const res = await userLoginService(formModel.value)

    // ✅ 确保响应数据结构正确
    const token = res.data.token
    // const userId = res.data.data.id

    // ✅ 明确设置并等待状态更新
    userStore.setToken(token)
    // userStore.setUserId(userId)

    // ✅ 确保 Token 已设置后再调用
    await userStore.getUser()

    ElMessage.success('登录成功')
    router.push('/')
  } catch (e) {
    // ✅ 精确错误提示
    const message = e.response?.data?.message || '登录失败，请检查网络'
    ElMessage.error(message)
    console.error('登录错误详情:', e)
  }
}

watch(isRegister, () => {
  formModel.value = {
    userAccount: '',
    userPassword: '',
    checkPassword: '',
    captcha: '',
    userPhoneNumber: ''
  }
  loadCaptcha() // 切换表单时刷新验证码
})

const showPassword = ref(false) // 控制密码显示状态
const showRegisterPwd = ref(false) // 控制密码显示状态
const showCheckPwd = ref(false) // 控制密码显示状态
</script>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;
  .bg {
    background:
      // url('@/assets/UIv1.0/登录页素材/浮窗1.png') no-repeat 60% center / 240px auto,
      url('@/assets/UIv1.0/登录页.png') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }
  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;
    .title {
      margin: 0 auto;
    }
    .button {
      width: 100%;
      text-align: center;
    }
    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
    .captcha-container {
      display: flex;
      align-items: center;
      width: 100%;

      .captcha-img {
        height: 40px;
        margin-left: 10px;
        cursor: pointer;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        transition: opacity 0.3s;

        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
}
.image-container {
  padding-left: 35%;
}
</style>
