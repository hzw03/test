<template>
  <div class="app-container">
    <el-row :gutter="20" class="header" justify="space-between" style="padding-bottom: 10px">
      <el-col :span="16">
        <el-input
          style="width: 150px"
          v-model="queryForm.title"
          placeholder="搜索文章标题"
          clearable
        ></el-input>
        &nbsp;
        <el-button type="primary" :icon="Search" @click="initArticleList">搜索</el-button>
        <el-popconfirm title="你确认批量删除吗？" @confirm="handleDelete(null)">
          <template #reference>
            <el-button type="danger" :disabled="delBthStatus" :icon="Delete">批量删除</el-button>
            <!-- :disabled 是 Vue 的动态绑定语法，用于绑定 HTML 元素或组件的 disabled 属性。delBtnStatus 是一个响应式变量，用于控制按钮是否被禁用。 -->
          </template>
        </el-popconfirm>
      </el-col>
      <el-col :span="8" class="text-right">
        <Wen @initArticleList="initArticleList"></Wen>
        <el-button type="success" :icon="DocumentAdd" @click="handleDialogValue()">新增</el-button>
      </el-col>
    </el-row>
    <el-table
      :data="tableData"
      class="fixed-width"
      stripe
      style="width: 100%"
      :row-style="{ height: '30px' }"
      :cell-style="{ padding: '10px' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column show-overflow-tooltip type="selection" width="55" />
      <el-table-column
        show-overflow-tooltip
        prop="articleId"
        label="文章id"
        width="200"
        align="center"
      />
      <el-table-column
        show-overflow-tooltip
        prop="title"
        label="文章标题"
        width="200"
        align="center"
      />
      <el-table-column
        show-overflow-tooltip
        prop="content"
        label="文章内容"
        width="200"
        align="center"
      />
      <el-table-column
        show-overflow-tooltip
        prop="author.userName"
        label="作者"
        width="200"
        align="center"
      />
      <el-table-column
        show-overflow-tooltip
        prop="createdAt"
        label="创建时间"
        width="200"
        align="center"
      />
      <el-table-column
        show-overflow-tooltip
        prop="updatedAt"
        label="最后更新时间"
        width="200"
        align="center"
      />
      <el-table-column
        show-overflow-tooltip
        prop="action"
        label="操作"
        width="400"
        fixed="right"
        align="center"
      >
        <template v-slot="scope">
          <el-button
            type="primary"
            :icon="Edit"
            @click="handleDialogValue(scope.row.articleId)"
          ></el-button>
          <el-popconfirm
            title="您确定要删除这条记录吗？"
            @confirm="handleDelete(scope.row.articleId)"
          >
            <template #reference>
              <el-button type="danger" :icon="Delete" />
            </template>
          </el-popconfirm>
          <el-button type="primary" @click="wzfx(scope.row.articleId)">文章分析</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total > 0"
      v-model:current-page="queryForm.current"
      v-model:page-size="queryForm.size"
      :page-sizes="[5, 10, 15]"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <Dialog
      v-model="dialogVisible"
      :userId="userId"
      :dialogVisible="dialogVisible"
      :articleId="articleId"
      :dialogTitle="dialogTitle"
      @initArticleList="initArticleList"
    ></Dialog>
    <!-- <AnalysisDashboard :responseData="apiResponse" /> -->
  </div>
</template>
<script setup>
import { ref } from 'vue'
import requestUtil from '@/utils/request'
import {
  Search,
  Delete,
  DocumentAdd,
  Edit,
  Tools,
  RefreshRight,
  Files
} from '@element-plus/icons-vue'
import Dialog from '@/views/article/components/dialog.vue'
import Wen from '@/views/article/components/wen.vue'
// import AnalysisDashboard from '@/views/article/components/AnalysisDashboard.vue'

const userId = ref(localStorage.getItem('userId') || '')

const dialogTitle = ref('')
const dialogVisible = ref(false)
const tableData = ref([])
const queryForm = ref({
  current: 1,
  size: 10
})
const total = ref(0)
const articleId = ref(0)
// 初始化文章列表
const initArticleList = async () => {
  try {
    const res = await requestUtil.post('/api/article/page', queryForm.value)
    tableData.value = res.data.data.records
    total.value = Number(res.data.data.total) // 修正字段路径
    queryForm.size = res.data.data.size
    queryForm.current = res.data.data.current
    console.log(queryForm.value.size, queryForm.value.current, total.value)
  } catch (error) {
    console.error('获取文章列表失败:', error)
    ElMessage.error('数据加载失败')
  }
}

// 分页处理
const handleSizeChange = (size) => {
  queryForm.value.size = size
  queryForm.value.current = 1
  initArticleList()
}

const handleCurrentChange = (current) => {
  queryForm.value.current = current
  initArticleList()
}

console.log()
const handleDialogValue = (id) => {
  // 修改参数名为id
  articleId.value = id ? id : 0 // 正确赋值给响应式变量
  dialogTitle.value = id ? '文章编辑' : '文章新增'
  dialogVisible.value = true
}

// const handleWJValue = () => {}

const delBthStatus = ref(true)
const multipleSelection = ref([])
//如果勾选了
const handleSelectionChange = (selection) => {
  multipleSelection.value = selection
  delBthStatus.value = selection.length == 0 //为false,此时按钮可用
}

const handleDelete = async (articleId) => {
  var ids = []
  if (articleId) {
    const res = await requestUtil.delete(`/api/article/delete?id=${articleId}`)
    if (res.data.code == 0) {
      ElMessage({
        type: 'success',
        message: '执行成功'
      })
      initArticleList()
    } else {
      ElMessage({
        type: 'error',
        message: res.data.msg
      })
    }
  } else {
    multipleSelection.value.forEach((row) => {
      ids.push(row.articleId)
    })
    const res = await requestUtil.post('/api/article/deleteBatch', ids)
    if (res.data.code == 0) {
      ElMessage({
        type: 'success',
        message: '执行成功'
      })
      initArticleList()
    } else {
      ElMessage({
        type: 'error',
        message: res.data.msg
      })
    }
  }
  console.log(ids)

  // try {
  //   console.log(articleId)
  //   await requestUtil.delete(`/api/article/delete?id=${articleId}`)
  //   ElMessage.success('删除成功')
  //   initArticleList()
  // } catch (error) {
  //   ElMessage.error('删除失败')
  // }
}

import { useAnalysisStore } from '@/stores/modules/article'

const analysisStore = useAnalysisStore()

//文章分析
import { useRouter } from 'vue-router'
const router = useRouter()
const wzfx = async (articleId) => {
  // 将字符串类型的 articleId 转换为 BigInt
  const longId = BigInt(articleId)
  console.log(longId)

  // 调用后端接口时，确保后端支持 BigInt 或将其转换为字符串
  const res = await requestUtil.get(`/api/article/analysis?articleId=${longId.toString()}`)
  analysisStore.setData(res.data)

  const fromPath = router.currentRoute.value.path
  router.push({ path: '/Home/index2', query: { from: fromPath } })
}

// 初始化加载
initArticleList()
</script>

<style lang="scss" scoped>
.text-right {
  display: flex;
  justify-content: flex-end;
}

.fixed-width {
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
