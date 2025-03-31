<template>
  <el-dialog model-value="dialogVisible" :title="dialogTitle" width="30%" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="文章内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :rows="3"
          placeholder="添加一些文章内容吧~"
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
  articleId: ''
})

// 添加表单验证规则
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

// 初始化表单数据
const initFormData = async (articleId) => {
  try {
    const res = await requestUtil.get(`/api/article/info?id=${articleId}`)
    if (res.data.code === 0) {
      const data = res.data.data
      form.value = {
        title: data.title,
        content: data.content
      }
    }
  } catch (error) {
    ElMessage.error('获取文章数据失败')
  }
}

// 监听弹窗打开状态
watch(
  () => props.dialogVisible,
  (visible) => {
    if (visible) {
      // 编辑模式且articleId有效时加载数据
      if (props.articleId !== 0) {
        initFormData(props.articleId)
      } else {
        // 新增模式重置表单
        formRef.value?.resetFields()
      }
    }
  }
)

const emits = defineEmits(['update:modelValue', 'initArticleList'])

const handleClose = () => {
  emits('update:modelValue', false)
}

const handleConfirm = async () => {
  try {
    // 表单验证
    await formRef.value.validate()
  } catch (error) {
    console.log('表单验证失败', error)
    return
  }

  submitting.value = true
  try {
    const requestData = {
      ...form.value
    }

    // 根据articleId判断操作类型
    if (props.articleId !== 0) {
      requestData.articleId = props.articleId
      console.log(requestData)
      await requestUtil.post('/api/article/update', requestData)
      ElMessage.success('更新成功')
    } else {
      await requestUtil.post('/api/article/add', requestData)
      ElMessage.success('创建成功')
    }

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
