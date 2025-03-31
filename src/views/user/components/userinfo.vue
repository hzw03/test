<template>
  <el-form ref="userRef" :model="form" :rules="rules" label-width="100px">
    <el-form-item label="用户名称" prop="userName">
      <el-input v-model="form.userName" placeholder="请输入用户名" clearable maxlength="30" />
    </el-form-item>

    <el-form-item label="个人简介" prop="userProfile">
      <el-input
        v-model="form.userProfile"
        type="textarea"
        :rows="3"
        placeholder="介绍一下自己吧"
        maxlength="150"
        show-word-limit
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">保存修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { defineProps, ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const props = defineProps({
  user: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'userName' in value && 'userProfile' in value
    }
  }
})

const form = ref({
  newPassword: '',
  oldPassword: '',
  userAvatar: '',
  userName: '',
  userProfile: ''
})

form.value = props.user

const userRef = ref(null)

const submitting = ref(false)

const rules = ref({
  userName: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    { min: 2, max: 30, message: '用户名长度需在2-30个字符之间', trigger: 'blur' }
  ]
})

console.log(userRef)

const handleSubmit = () => {
  userRef.value.validate(async (valid) => {
    if (valid) {
      console.log(form.value)
      let result = await request.post('/api/user/update/my', form.value)
      let data = result.data
      if (data.code == 200) {
        ElMessage.success(' 执行成功 ')
        // window.sessionStorage.setItem('currentUser', JSON.stringify(form.value))
      }
    }
  })
}
</script>

<style scoped>
.el-form {
  padding: 20px 40px;
}

.el-textarea {
  width: 80%;
}
</style>
