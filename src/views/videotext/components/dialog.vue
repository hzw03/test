<template>
  <el-dialog model-value="dialogVisible" :title="dialogTitle" width="50%" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="视频标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <!-- 修改为视频上传组件 -->
      <el-form-item label="视频文件" prop="videos">
        <el-upload
          action="#"
          list-type="text"
          :auto-upload="false"
          :before-remove="handleRemove"
          :on-change="handleVideoChange"
          :file-list="fileList"
          :limit="3"
          multiple
          accept="video/*"
        >
          <el-button type="primary">点击上传视频</el-button>
          <template #tip>
            <div class="el-upload__tip">支持上传MP4、AVI等视频格式，单个文件不超过500MB</div>
          </template>
        </el-upload>
      </el-form-item>

      <el-form-item label="视频内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="5"
          placeholder="添加视频内容..."
          maxlength="10000"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm" :loading="submitting">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from 'vue'
import requestUtil from '../../../utils/request'
import { ElMessage } from 'element-plus'

const props = defineProps({
  articleId: {
    type: Number,
    default: 0,
    required: true
  },
  dialogTitle: {
    type: String,
    default: '',
    required: true
  },
  dialogVisible: {
    type: Boolean,
    default: false,
    required: true
  },
  userId: {
    type: String,
    default: '',
    required: true
  }
})

const form = ref({
  title: '',
  content: '',
  video: [], // 修改为存储视频文件
  articleId: ''
})

const rules = ref({
  title: [
    { required: true, message: '请输入视频标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入视频内容', trigger: 'blur' },
    { min: 5, max: 10000, message: '内容至少5个字符', trigger: 'blur' }
  ],
  video: [
    // 添加视频验证规则
    { required: true, message: '请上传视频文件', trigger: 'change' }
  ]
})

const formRef = ref(null)
const submitting = ref(false)
const fileList = ref([])

// 视频选择处理函数
const handleVideoChange = (uploadFile, uploadFiles) => {
  // 验证视频格式
  const isVideo = uploadFile.raw.type.includes('video/')
  if (!isVideo) {
    ElMessage.error('只能上传视频文件')
    return false
  }

  // 验证文件大小（500MB）
  const isLt500M = uploadFile.raw.size / 1024 / 1024 < 500
  if (!isLt500M) {
    ElMessage.error('视频大小不能超过500MB')
    return false
  }

  fileList.value = uploadFiles.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.raw.type
  }))
  form.value.video = uploadFiles.map((file) => file.raw)
}

// 新增原始视频存储字段
const originalVideo = ref('')
// 初始化表单数据
const initFormData = async (articleId) => {
  try {
    const res = await requestUtil.post(`/api/video/info?articleId=${articleId}`)
    if (res.data.code === 0) {
      const data = res.data.data
      console.log(data)
      form.value = {
        title: data.title,
        content: data.content,
        video: []
      }
      // 保存原始视频路径到新字段
      originalVideo.value = data.videoUrl
      // 文件列表显示原始视频
      fileList.value = data.videoUrl
        ? [
            {
              name: data.videoUrl.split('/').pop(),
              url: data.videoUrl
            }
          ]
        : []
    }
  } catch (error) {
    ElMessage.error('获取视频数据失败')
  }
}

watch(
  () => props.dialogVisible,
  (visible) => {
    if (visible) {
      if (props.articleId !== 0) {
        initFormData(props.articleId)
      } else {
        formRef.value?.resetFields()
        fileList.value = []
      }
    }
  }
)

const emits = defineEmits(['update:modelValue', 'initArticleList'])

const handleClose = () => {
  form.value = { title: '', content: '', video: [] }
  fileList.value = []
  emits('update:modelValue', false)
}

const handleConfirm = async () => {
  try {
    await formRef.value.validate()
    if (props.articleId === 0 && fileList.value.length === 0) {
      return ElMessage.error('请上传视频文件')
    }
  } catch (error) {
    return
  }

  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)
    formData.append('id', props.articleId)
    if (props.articleId !== 0) {
      // 如果有新上传文件
      if (form.value.video.length > 0) {
        form.value.video.forEach((file) => formData.append('video', file))
      }
      // 如果没有新文件但需要保留原视频
      else if (!originalVideo.value) {
        formData.append('videoPath', '')
      }
      // 保留原始视频
      else {
        formData.append('videoPath', originalVideo.value)
      }
    }
    // 新建时处理逻辑
    else {
      form.value.video.forEach((file) => formData.append('video', file))
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }
    const apiUrl = props.articleId !== 0 ? '/api/video/update' : '/api/video/video'
    const res = await requestUtil.post(apiUrl, formData)
    console.log(res)
    if (res.data.code === 0) {
      ElMessage.success(props.articleId !== 0 ? '更新成功' : '创建成功')
    } else {
      ElMessage.error(error.response?.data?.messag || '操作失败')
    }
    emits('initArticleList')
    handleClose()
  } catch (error) {
    ElMessage.error(error.response?.data?.msg || '操作失败')
  } finally {
    submitting.value = false
  }
}
const handleRemove = (file) => {
  // 删除原始视频时清除originalVideo
  if (file.url && file.url === originalVideo.value) {
    originalVideo.value = ''
  }
  fileList.value = fileList.value.filter((f) => f.uid !== file.uid)
  form.value.video = form.value.video.filter((f) => f.uid !== file.raw?.uid)
}
</script>

<style scoped>
.el-upload__tip {
  color: #666;
  font-size: 12px;
  margin-top: 8px;
}
</style>
