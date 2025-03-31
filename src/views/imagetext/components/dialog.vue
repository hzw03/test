<template>
  <el-dialog model-value="dialogVisible" :title="dialogTitle" width="50%" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <!-- 新增图片上传组件 -->
      <el-form-item label="文章图片" prop="images">
        <el-upload
          action="#"
          list-type="picture-card"
          :auto-upload="false"
          :on-change="handleImageChange"
          :file-list="fileList"
          :limit="3"
          accept="image/*"
          multiple
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>

      <el-form-item label="文章内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="5"
          placeholder="添加文章内容..."
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
import { Plus } from '@element-plus/icons-vue'

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
  images: [], // 存储图片文件对象
  articleId: ''
})

const rules = ref({
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在2到50个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' },
    { min: 5, max: 10000, message: '内容至少5个字符', trigger: 'blur' }
  ]
})

const formRef = ref(null)
const submitting = ref(false)
const fileList = ref([]) // 用于图片预览

// 图片选择处理
const handleImageChange = (uploadFile, uploadFiles) => {
  // 清空旧图片列表
  fileList.value = []
  form.value.images = []

  // 更新文件列表和预览
  fileList.value = uploadFiles.map((file) => {
    if (file.raw) {
      return {
        name: file.name,
        url: URL.createObjectURL(file.raw)
      }
    }
    return {
      name: file.name,
      url: ''
    }
  })
  // 保存原始文件对象
  form.value.images = uploadFiles.map((file) => file.raw)
}
// 初始化表单数据
const initFormData = async (articleId) => {
  try {
    const res = await requestUtil.post(`/api/articleImages/info?articleId=${articleId}`)
    if (res.data.code === 0) {
      const data = res.data.data
      form.value = {
        title: data.title,
        content: data.content,
        images: data.images || []
      }
      // 转换服务器返回的图片URL为预览格式
      fileList.value =
        data.images?.map((url) => ({
          name: url.split('/').pop(),
          url: url
        })) || []
    }
  } catch (error) {
    ElMessage.error('获取图文数据失败')
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
        fileList.value = [] // 清空图片预览
      }
    }
  }
)

const emits = defineEmits(['update:modelValue', 'initArticleList'])

const handleClose = () => {
  form.value = { title: '', content: '', images: [] }
  fileList.value = []
  emits('update:modelValue', false)
}

const handleConfirm = async () => {
  try {
    await formRef.value.validate()
  } catch (error) {
    return
  }

  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('content', form.value.content)

    // 添加用户ID（新增时）或文章ID（更新时）
    if (props.articleId !== 0) {
      formData.append('articleId', props.articleId)
    } else {
      formData.append('userId', props.userId)
    }

    // 添加所有图片文件
    form.value.images.forEach((file) => {
      formData.append('images', file)
    })

    for (let [key, value] of formData.entries()) {
      console.log(key, value)
    }
    // 根据模式选择API
    const apiUrl = props.articleId !== 0 ? '/api/articleImages/update' : '/api/articleImages/add'

    await requestUtil.post(apiUrl, formData)

    ElMessage.success(props.articleId !== 0 ? '更新成功' : '创建成功')
    emits('initArticleList')
    handleClose()
  } catch (error) {
    ElMessage.error(error.response?.data?.msg || '操作失败')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped></style>
