<template>
  <el-form
    ref="formRef"
    :model="form"
    label-width="100px"
    style="text-align: center; padding-bottom: 10px"
  >
    <el-upload
      class="avatar-uploader"
      :auto-upload="false"
      :show-file-list="false"
      :on-change="handleAvatarChange"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <el-button @click="handleConfirm" style="margin-top: 10px">确认更换</el-button>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import request from '@/utils/request'

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
    required: true
  }
})

const form = ref({ ...props.user })
const imageUrl = ref(props.user.userAvatar)
const uploadFile = ref(null)

// 处理头像文件选择
const handleAvatarChange = (uploadFileInfo) => {
  const file = uploadFileInfo.raw
  imageUrl.value = URL.createObjectURL(file)
  uploadFile.value = file
  return true
}

// 确认更换处理
const handleConfirm = async () => {
  if (!uploadFile.value) {
    ElMessage.warning('请先选择头像文件')
    return
  }

  const formData = new FormData()
  // 修改点1：字段名改为 file
  formData.append('file', uploadFile.value) // 这里改成接口要求的字段名

  try {
    // 修改点3：使用封装好的request实例
    const response = await request.post('api/file/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // 确保保留这个header
      }
    })
    console.log(response.data)
    if (response.data.code === 0) {
      ElMessage.success('头像更新成功')
      // 修改点4：更新逻辑（根据实际返回字段调整）
      const newUrl = response.data.data?.url || response.data.data?.fileUrl
      if (newUrl) {
        imageUrl.value = newUrl
        form.value.userAvatar = newUrl
      }
    }
  } catch (error) {
    console.error('请求错误:', error)
    // 修改点5：显示后端错误信息
    ElMessage.error(error.response?.data?.message || '上传失败')
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: cover;
}
</style>
