<template>
  <el-form ref="pwdRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item prop="oldPassword" label="原密码">
      <el-input v-model="form.oldPassword" maxlength="11" />
    </el-form-item>
    <el-form-item prop="newPassword" label="新密码">
      <el-input v-model="form.newPassword" maxlength="11" />
    </el-form-item>
    <el-form-item prop="confirmPassword" label="确认输入">
      <el-input v-model="form.confirmPassword" maxlength="11" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="handleSubmit">确认修改</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import { defineProps, ref } from 'vue'
import request from '@/utils/request'
import { ElMessage } from 'element-plus'

const props = defineProps({
  user: {
    type: Object,
    default: () => {},
    required: true
  }
})
const form = ref({
  oldPassword: '',
  confirmPassword: '',
  newPassword: ''
})
const pwdRef = ref(null)

form.value = props.user

const equalToPassword = (rule, value, callback) => {
  if (form.value.newPassword != value) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
const rules = ref({
  oldPassword: [{ required: true, message: '原密码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    {
      min: 6,
      max: 20,
      message: '密码长度应为 6 到 20 个字符之间',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      required: true,
      validator: equalToPassword,
      trigger: 'blur'
    }
  ]
})

const handleSubmit = () => {
  pwdRef.value.validate(async (valid) => {
    if (valid) {
      let result = await request.post('/api/user/update/my', form.value)
      let data = result.data
      if (data.code == 0) {
        // ElMessage.success(' 执行成功 ')
        // window.sessionStorage.setItem('currentUser', JSON.stringify(form.value))
        ElMessage.success('密码修改成功，下一次登录生效！')
      } else {
        ElMessage.error(data.errorInfo)
      }
    }
  })
}
</script>
<style lang=""></style>
