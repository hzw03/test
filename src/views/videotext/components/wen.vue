<template>
  <el-form
    ref="formRef"
    :model="form"
    label-width="100px"
    :rules="rules"
    style="max-width: 800px; margin: 20px auto"
  >
    <!-- 标题输入 -->
    <el-form-item label="视频标题" prop="title">
      <el-input v-model="form.title" placeholder="请输入视频标题" clearable />
    </el-form-item>

    <!-- 描述输入 -->
    <el-form-item label="视频描述" prop="content">
      <el-input
        v-model="form.content"
        type="textarea"
        :rows="3"
        placeholder="请输入视频描述"
        show-word-limit
        maxlength="200"
      />
    </el-form-item>

    <!-- 视频上传 -->
    <el-form-item label="视频文件" prop="video">
      <el-upload
        class="video-uploader"
        :auto-upload="false"
        :limit="1"
        :on-change="handleFileChange"
        :before-upload="beforeFileUpload"
        :file-list="fileList"
        :accept="allowedTypes"
      >
        <el-button type="primary">选择视频文件</el-button>
        <template #tip>
          <div class="upload-tip">
            支持格式：{{ supportedFormats.join(' / ') }}，最大体积：{{ maxSizeMB }}MB
          </div>
        </template>
      </el-upload>
    </el-form-item>

    <!-- 提交按钮 -->
    <el-form-item>
      <el-button type="success" :loading="isUploading" @click="handleSubmit">
        {{ isUploading ? '上传中...' : '提交视频' }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 配置参数
const maxSizeMB = 100
const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv']
const supportedFormats = allowedTypes.map((t) => t.split('/')[1].toUpperCase())

// 响应式数据
const formRef = ref(null)
const isUploading = ref(false)
const fileList = ref([])
const uploadFile = ref(null)

const form = reactive({
  title: '',
  content: ''
})

// 验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入视频标题', trigger: 'blur' },
    { min: 2, max: 30, message: '长度在2到30个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入视频描述', trigger: 'blur' },
    { min: 10, max: 200, message: '长度在10到200个字符', trigger: 'blur' }
  ],
  video: [{ required: true, validator: validateVideo, trigger: 'change' }]
})

// 文件验证方法
function validateVideo(rule, value, callback) {
  if (!uploadFile.value) {
    callback(new Error('请选择视频文件'))
  } else {
    callback()
  }
}

// 文件选择处理
const handleFileChange = (fileInfo) => {
  const valid = validateFile(fileInfo.raw)
  if (valid) {
    uploadFile.value = fileInfo.raw
    fileList.value = [fileInfo]
  }
}

// 文件验证逻辑
const validateFile = (file) => {
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error(`不支持的文件格式，请上传 ${supportedFormats.join(' / ')} 格式`)
    return false
  }

  const isValidSize = file.size / 1024 / 1024 < maxSizeMB
  if (!isValidSize) {
    ElMessage.error(`文件大小不能超过 ${maxSizeMB}MB`)
    return false
  }

  return true
}

// 上传前验证
const beforeFileUpload = (file) => {
  return validateFile(file)
}

// 表单提交
const handleSubmit = async () => {
  try {
    // 表单验证
    await formRef.value.validate()

    isUploading.value = true
    const formData = new FormData()

    // 添加表单字段
    formData.append('title', form.title)
    formData.append('content', form.content)
    formData.append('video', uploadFile.value)

    // 发送请求
    const response = await fetch('/api/video/video', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) throw new Error('上传失败')

    const result = await response.json()
    if (result.code === 0) {
      ElMessage.success('视频上传成功')
      resetForm()
    } else {
      throw new Error(result.message || '上传失败')
    }
  } catch (error) {
    console.error('上传错误:', error)
    ElMessage.error(`上传失败: ${error.message}`)
  } finally {
    isUploading.value = false
  }
}

// 重置表单
const resetForm = () => {
  formRef.value.resetFields()
  fileList.value = []
  uploadFile.value = null
}
</script>

<style>
.video-uploader {
  width: 100%;
}

.upload-tip {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
}

.el-form-item__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
