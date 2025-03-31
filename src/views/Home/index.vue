<template>
  <div v-show="!hasData" class="loading">
    数据加载中,请退出重试...<button class="exit-btn" @click="tuichu">退出分析</button>
  </div>
  <div class="container">
    <el-row class="bt">
      <img style="width: 80%" src="@/assets/UIv1.0/大屏元素/顶部标题3.png" alt="默认标题" />

      <span style="width: 30px"
        ><img
          style="width: 450%"
          src="@/assets/UIv1.0/大屏元素/退出按钮.png"
          alt=""
          @click="tuichu"
      /></span>
    </el-row>
    <el-row :gutter="10" class="container2">
      <el-col :span="6">
        <div style="padding-left: 5px" class="dingbu">
          <img src="@/assets/UIv1.0/大屏元素/标题底座.png" /><span>文章真伪率</span>
        </div>
        <div style="text-align: center; padding-top: 10px" class="image-with-text">
          <img style="width: 65%" src="@/assets/UIv1.0/大屏元素/文章真伪底座.png" />
          <span>{{ authenticityProbability }}%</span>
        </div>
      </el-col>
      <el-col :span="12">
        <div style="text-align: center; position: relative">
          <img style="width: 80%; padding-top: 30px" src="@/assets/UIv1.0/大屏元素/词云底座.png" />
          <div ref="wordcloudChart" class="wordcloud-chart"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="padding-left: 5px" class="dingbu">
          <img src="@/assets/UIv1.0/大屏元素/标题底座.png" /><span>AI生成可能性</span>
        </div>
        <div class="image-with-text">
          <img src="@/assets/UIv1.0/大屏元素/ai生成底座.png" />
          <span>{{ aiProbability }}%</span>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="10" class="container3">
      <el-col :span="6" class="xm">
        <div style="padding-left: 5px" class="dingbu">
          <img src="@/assets/UIv1.0/大屏元素/标题底座.png" /><span>文章信息</span>
        </div>
        <div style="text-align: center; padding-top: 25px">
          <div class="image-with-text2">
            <img src="@/assets/UIv1.0/大屏元素/字数统计底座.png" />
            <span>{{ wordCount }} 字</span>
          </div>
          <div class="image-with-text2">
            <img src="@/assets/UIv1.0/大屏元素/文章来源底座.png" />
            <span>{{ author }}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="xm">
        <div style="padding-left: 55px" class="dingbu">
          <img
            style="margin-top: 25px; margin-left: 30px"
            src="@/assets/UIv1.0/大屏元素/标题底座.png"
          /><span style="padding-top: 30px; padding-left: 25px">文章内部特征分析</span>
        </div>
        <div class="image-with-text3">
          <span>{{ aiAnalysisSummary }}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div style="padding-left: 5px" class="dingbu">
          <img src="@/assets/UIv1.0/大屏元素/标题底座.png" /><span>ai生成分析</span>
        </div>
        <div class="image-with-text-container" v-for="(item, index) in aiReasoning" :key="index">
          &nbsp;&nbsp;&nbsp;&nbsp;{{ item }}
        </div>
      </el-col></el-row
    >
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'
import { useAnalysisStore } from '@/stores/modules/article'
import { computed } from 'vue'
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts-wordcloud'

const router = useRouter()
const analysisStore = useAnalysisStore()
console.log(analysisStore.data)
const aiReasoningArray = ref([])

const wordcloudChart = ref(null)
let chartInstance = null

// 计算属性
const analysisData = computed(() => analysisStore.data || {})
const aiAnalysisSummary = computed(() => analysisData.value.aiAnalysisSummary || 0)
const authenticityProbability = computed(() => analysisData.value.authenticityProbability || 0)
const aiProbability = computed(() => analysisData.value.aiProbability || 0)
const hotWords = computed(() => analysisData.value.hotWords || [])
const aiReasoning = computed(() => analysisData.value.aiReasoning.split(/(?<=[。])/) || [])
const wordCount = computed(() => analysisData.value.wordCount || 0)
const author = computed(() => analysisData.value.author || '未知作者')
const formattedTime = computed(() => {
  if (!analysisData.value.analyzedAt) return '--'
  const date = new Date(analysisData.value.analyzedAt)
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
})

// 加载状态控制
const hasData = ref(false)
// 监听hotWords变化
watch(hotWords, (newVal) => {
  if (newVal.length > 0) {
    updateWordCloud()
  }
})

const updateWordCloud = () => {
  if (!chartInstance && wordcloudChart.value) {
    chartInstance = echarts.init(wordcloudChart.value)
  }

  const data = hotWords.value
    .filter((item) => item.word.trim()) // 过滤空词
    .map((item) => ({
      name: item.word,
      value: item.score
    }))

  const option = {
    tooltip: {},
    series: [
      {
        type: 'wordCloud',
        shape: 'circle',
        sizeRange: [20, 60], // 字体大小范围
        rotationRange: [0, 0],
        gridSize: 50,
        drawOutOfBound: false,
        textStyle: {
          color: () =>
            `rgb(${Math.round(Math.random() * 160 + 64)},${Math.round(Math.random() * 160 + 64)},${Math.round(Math.random() * 160 + 64)})`,
          // 添加边框样式
          backgroundColor: 'rgba(50, 150, 200, 0.3)', // 半透明背景
          borderColor: '#33f1ff', // 边框颜色
          borderWidth: 0.5, // 边框宽度
          borderRadius: 3, // 边框圆角
          padding: [6, 8]
        },
        layoutAnimation: true, // 启用布局动画
        keepAspect: false, // 不保持宽高比
        width: '90%', // 减少容器宽度
        height: '90%', // 减少容器高度
        emphasis: {
          focus: 'self',
          textStyle: {
            shadowBlur: 10,
            shadowColor: '#33f1ff'
          }
        },
        data: data
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  // 初始化词云
  if (hotWords.value.length > 0) {
    updateWordCloud()
  }

  // 窗口变化时自适应
  window.addEventListener('resize', () => {
    if (chartInstance) chartInstance.resize()
  })
})

// onMounted(() => {
//   // 使用正则表达式以中文句号分割字符串，同时保留句号
//   if (aiReasoningArray) {
//     aiReasoningArray.value = aiReasoning.value.split(/(?<=[。])/)
//   }
// })

// // 获取来源页面路径
// const fromPath = router.currentRoute.value.query.from || '/index/index'

// // 响应式判断变量
// const showV1Image = ref(false)

// 监听路由变化
watch(
  () => analysisStore.data,
  (newVal) => {
    if (
      newVal &&
      newVal.authenticityProbability !== undefined &&
      newVal.aiProbability !== undefined &&
      newVal.hotWords?.length > 0 &&
      newVal.aiReasoning?.length > 0
    ) {
      hasData.value = true
    }
  },
  { immediate: true, deep: true }
)

const tuichu = () => {
  // 获取来源页面路径
  const fromPath = router.currentRoute.value.query.from || '/index/index'
  console.log(fromPath)
  router.push(fromPath)
}

// 数据监听
// watch(
//   () => analysisStore.data,
//   (newVal) => {
//     if (newVal?.aiProbability !== undefined) {
//       hasData.value = true
//       nextTick(initCharts)
//     }
//   },
//   { immediate: true, deep: true }
// )
</script>
<style scoped>
.container {
  background-image: url(@/assets/UIv1.0/大屏元素/文章分析大屏背景2.png);
  background-size: 100% 100%; /* 调整背景图大小以铺满容器 */
  background-position: center center; /* 背景图居中显示 */
  background-repeat: no-repeat; /* 背景图不重复 */
  position: relative; /* 使用相对定位 */
  width: 100%; /* 宽度占满屏幕 */
  height: 100%; /* 高度占满屏幕 */
  margin: 0;
}

.bt {
  padding-top: 25px;
  align-items: center;
  text-align: center;
  justify-content: center;
}
.container2 {
  padding-top: 10px;
  height: 45%;
  padding: 0 20px 0 20px;
}
.container3 {
  padding: 0 20px 0 20px;
}

/* 新增的CSS样式 */
.el-col .dingbu {
  height: auto; /* 图片高度自适应 */
  display: block; /* 防止图片有额外的间距 */
  position: relative; /* 设置图片为相对定位 */
}

.el-col span {
  position: absolute; /* 设置文字为绝对定位 */
  top: 35%; /* 文字垂直居中 */
  left: 18%;
  transform: translate(-50%, -50%); /* 精确居中 */
  color: white; /* 文字颜色 */
  font-size: 16px;
  z-index: 1; /* 确保文字在图片上方 */
}

.image-with-text {
  position: relative; /* 设置为相对定位 */
  text-align: center; /* 文本居中 */
  padding-top: 25px; /* 上边距 */
}

.image-with-text img {
  width: 65%; /* 图片宽度 */
  display: block; /* 防止图片默认的inline属性导致的间距问题 */
  margin: 0 auto; /* 图片水平居中 */
}

.image-with-text span {
  position: absolute; /* 绝对定位 */
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 精确居中 */
  color: white; /* 文字颜色 */
  font-size: 35px; /* 文字大小 */
  font-weight: bold; /* 文字加粗 */
  z-index: 1; /* 确保文字在图片上方 */
  color: #4df1e3;
}

.image-with-text2 {
  position: relative; /* 设置为相对定位 */
  text-align: center; /* 文本居中 */
  padding-top: 25px; /* 上边距 */
}

.image-with-text2 img {
  width: 100%; /* 图片宽度 */
  display: block; /* 防止图片默认的inline属性导致的间距问题 */
  margin: 0 auto; /* 图片水平居中 */
}

.image-with-text2 span {
  position: absolute; /* 绝对定位 */
  top: 50%; /* 垂直居中 */
  left: 70%;
  transform: translate(-50%, -50%); /* 精确居中 */
  color: white; /* 文字颜色*/
  font-size: 16px; /* 文字大小 */
  z-index: 1; /* 确保文字在图片上方 */
  color: #cbedf8;
}

.image-with-text3 {
  position: relative; /* 设置为相对定位 */
  width: 100%; /* 容器宽度 */
  height: 280px; /* 容器高度 */
  background-image: url('@/assets/UIv1.0/大屏元素/分析.png'); /* 设置背景图片 */
  background-size: 70%; /* 背景图片覆盖整个容器 */
  background-repeat: no-repeat;
  padding-top: 10px; /* 上边距 */
  margin-top: 15px;
  margin-left: 40px; /* 左边距 */
  padding-left: 15px;
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
}

.image-with-text3 span {
  padding-bottom: 130px;
  position: relative; /* 设置为相对定位 */
  color: #b5feff; /* 文字颜色，可根据背景调整 */
  font-size: 16px; /* 文字大小 */
  text-align: left;
  width: 56%;
  word-wrap: break-word; /* 自动换行 */
}

.image-with-text-container {
  margin-top: 15px;
  margin-bottom: 20px;
  position: relative; /* 设置为相对定位 */
  width: 100%; /* 容器宽度 */
  height: 60px; /* 容器高度*/
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中 */
  background-color: rgba(18, 109, 184, 0.5);
  color: rgb(182, 253, 255);
  font-size: 14px;
  /* background-image: url('@/assets/UIv1.0/大屏元素/底部.png'); 设置背景图片 */
  /* background-size: cover; 背景图片覆盖整个容器
  background-position: center; 背景图片居中 */
}
.image-with-text4 {
  color: rgb(182, 253, 255);
  font-size: 16px;
  height: 25px;
}

.wordcloud-chart {
  position: absolute;
  top: 30px;
  left: 10%;
  width: 80%;
  height: 80%;
  z-index: 3;
}

.loading {
  width: 100%;
  height: 100vh;
  font-size: 30px;
  text-align: center;
  justify-content: center;
  align-items: center;
}
</style>
