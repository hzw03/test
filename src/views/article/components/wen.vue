<template>
  <el-form
    ref="formRef"
    :model="form"
    label-width="100px"
    style="text-align: center; display: flex; padding-bottom: 10px"
  >
    <el-upload
      class="file-uploader"
      :auto-upload="false"
      :limit="1"
      :on-change="handleFileChange"
      :before-upload="beforeFileUpload"
      :file-list="fileList"
      accept=".docx"
    >
      <el-button type="primary">选择文件</el-button>
    </el-upload>
    <el-button @click="handleConfirm">上传文件</el-button>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
    required: true
  }
})

const form = ref({ ...props.user })
const fileList = ref([]) // 用于存储已选择的文件列表
const uploadFile = ref(null)

// 处理文件选择
const handleFileChange = (uploadFileInfo) => {
  const file = uploadFileInfo.raw
  uploadFile.value = file
  // 更新文件列表
  fileList.value = [uploadFileInfo]
}

const emits = defineEmits(['initArticleList'])
// 确认上传处理
const handleConfirm = async () => {
  if (!uploadFile.value) {
    ElMessage.warning('请先选择文件')
    return
  }

  const formData = new FormData()
  // 修改点1：字段名改为 file
  formData.append('files', uploadFile.value) // 这里改成接口要求的字段名

  try {
    // 修改点3：使用封装好的request实例
    const response = await request.post('/api/article/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // 确保保留这个header
      }
    })
    console.log(response)
    if (response.data.code === 0) {
      ElMessage.success('文件上传成功')
      emits('initArticleList')
    }
  } catch (error) {
    console.error('请求错误:', error)
    // 修改点5：显示后端错误信息
    ElMessage.error(error.response?.data?.message || '上传失败')
  }
}

// 上传前校验
const beforeFileUpload = (file) => {
  // 可以在这里添加文件类型、大小等校验逻辑
  const fileSize = file.size / 1024 / 1024 // 文件大小 (MB)
  if (fileSize > 10) {
    // 假设限制文件大小为10MB
    ElMessage.error('文件大小不能超过10MB')
    return false
  }
  return true
}
</script>

<style>
.file-uploader .el-upload {
  display: inline-block;
}
</style>
