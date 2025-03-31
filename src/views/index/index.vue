<template>
  <el-row :gutter="10">
    <el-col :span="6" v-for="(item, index) in statsData" :key="index">
      <div class="stat-card">
        <div class="icon-container">
          <img :src="item.icon" alt="icon" class="icon" />
        </div>
        <div class="content">
          <div class="main-value">{{ item.value }}</div>
          <div class="card-title">{{ item.title }}</div>
          <div class="sub-info">
            <span class="percentage-container">
              <img :src="item.xtb" alt="trend" class="trend-icon" />
              <span class="percentage">{{ item.percentage }}</span>
            </span>
            <span class="time-range">{{ item.timeRange }}</span>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="12">
      <div ref="chartRef" class="chart"></div>
    </el-col>
    <el-col :span="12">
      <div class="disk-usage-card">
        <div class="disk-title">磁盘使用情况</div>
        <div class="disk-progress-container">
          <div class="disk-progress-bar">
            <div class="disk-progress" :style="{ width: diskUsage.percentage + '%' }"></div>
          </div>
        </div>
        <div class="disk-info">
          已使用：<span class="disk-used">{{ diskUsage.used }}G/{{ diskUsage.total }}G</span>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-row :gutter="30">
    <el-col :span="12">
      <div ref="chartRef2" class="chart chart2"></div>
    </el-col>
    <el-col :span="12">
      <div ref="chartRef1" class="chart chart2"></div>
    </el-col>
  </el-row>
</template>

<script setup>
import newUserIcon from '@/assets/UIv1.0/首页元素/01.png'
import totalUserIcon from '@/assets/UIv1.0/首页元素/02.png'
import articleIcon from '@/assets/UIv1.0/首页元素/03.png'
import fakeArticleIcon from '@/assets/UIv1.0/首页元素/04.png'
import trendIcon from '@/assets/UIv1.0/首页元素/05.png'
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import requestUtil from '@/utils/request'

const statsData = ref([
  {
    value: '',
    title: '新增访客',
    percentage: '',
    timeRange: '(1day)',
    icon: newUserIcon,
    xtb: trendIcon
  },
  {
    value: '',
    title: '总访客数',
    percentage: '',
    timeRange: '(30days)',
    icon: totalUserIcon,
    xtb: trendIcon
  },
  {
    value: '',
    title: '总文章数',
    percentage: '',
    timeRange: '(30days)',
    icon: articleIcon,
    xtb: trendIcon
  },
  {
    value: '',
    title: '虚假文章',
    percentage: '',
    timeRange: '(30days)',
    icon: fakeArticleIcon,
    xtb: trendIcon
  }
])

const diskUsage = ref({
  used: '',
  total: '',
  percentage: 0
})

const chartRef = ref(null)
let chartInstance = null

// ---------------------------------------------
// 新增图表引用
const chartRef1 = ref(null)
const chartRef2 = ref(null)
let chartInstance1 = null
let chartInstance2 = null

// CPU负载图表配置
const option1 = {
  title: {
    text: 'CPU负载状态',
    left: 'center',
    textStyle: {
      fontSize: 25,
      color: '#303133'
    }
  },
  series: [
    {
      type: 'gauge',
      center: ['50%', '60%'],
      progress: {
        show: true,
        width: 18
      },
      axisLine: {
        lineStyle: {
          width: 18,
          color: [
            [0.35, '#67C23A'],
            [1, '#E4E7ED']
          ]
        }
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 28,
        offsetCenter: [0, '20%'],
        formatter: '{value}%',
        color: '#303133'
      },
      data: [{ value: 35 }]
    }
  ]
}

// 虚假新闻占比图表配置
const option2 = {
  title: {
    text: '虚假新闻占比',
    left: 'center',
    textStyle: {
      fontSize: 25,
      color: '#303133'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['50%', '60%'],
      data: [
        { value: 176, name: '虚假文章' },
        { value: 75, name: '真实文章' }
      ],
      label: {
        show: true,
        formatter: '{b}: {d}%'
      },
      itemStyle: {
        borderRadius: 5,
        borderColor: '#fff',
        borderWidth: 2,
        color: function (params) {
          return params.dataIndex === 0 ? '#85f4fa' : '#3a57e8'
        }
      }
    }
  ]
}
// ---------------------------------------------

const option = {
  title: [
    {
      text: '内存使用情况监测',
      left: '10',
      top: '10',
      textStyle: {
        fontSize: 25,
        fontWeight: 'bold',
        color: '#303133'
      }
    },
    {
      text: '实时数据:11.1G/15.3G',
      right: '10',
      top: '10',
      textStyle: {
        fontSize: 14,
        color: '#6366f1'
      }
    }
  ],
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '30%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['60s', '50s', '40s', '30s', '20s', '10s', '0'],
    axisLine: {
      lineStyle: {
        color: '#909399'
      }
    },
    axisLabel: {
      color: '#606266'
    }
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: '#e4e7ed'
      }
    },
    axisLabel: {
      formatter: '{value}%',
      color: '#606266'
    }
  },
  series: [
    {
      data: [30, 20, 50, 80, 20, 60, 80],
      type: 'line',
      smooth: true,
      lineStyle: {
        width: 3,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#6366f1' },
          { offset: 1, color: '#8b5cf6' }
        ])
      },
      itemStyle: {
        color: '#6366f1',
        border_color: '#6366f1',
        border_width: 2
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(99, 102, 241, 0.5)' },
          { offset: 1, color: 'rgba(99, 102, 241, 0.1)' }
        ])
      }
    }
  ]
}

onMounted(() => {
  // 初始化图表
  chartInstance = echarts.init(chartRef.value)
  chartInstance.setOption(option)
  // 初始化新增图表
  chartInstance1 = echarts.init(chartRef1.value)
  chartInstance1.setOption(option1)

  chartInstance2 = echarts.init(chartRef2.value)
  chartInstance2.setOption(option2)

  // 添加窗口大小变化时的图表自适应
  window.addEventListener('resize', resizeChart)
  window.addEventListener('resize', () => {
    chartInstance1.resize()
    chartInstance2.resize()
  })
})

const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

const sj = async () => {
  try {
    const res = await requestUtil.get('/api/index/statistics')
    const data = res.data.data
    console.log(data)
    // 更新 statsData 的值
    statsData.value = [
      {
        value: data.newUsers || '0',
        title: '新增用户数',
        timeRange: '(1day)',
        icon: newUserIcon,
        xtb: trendIcon
      },
      {
        value: data.totalUsers || '0',
        title: '总用户数',
        timeRange: '(30days)',
        icon: totalUserIcon,
        xtb: trendIcon
      },
      {
        value: data.totalArticles || '0',
        title: '总文章数',
        timeRange: '(30days)',
        icon: articleIcon,
        xtb: trendIcon
      },
      {
        value: data.checkedArticles || '0',
        title: '已审核文章数',
        timeRange: '(30days)',
        icon: fakeArticleIcon,
        xtb: trendIcon
      }
    ]

    // 更新磁盘使用情况
    if (data.diskUsage) {
      const [used, total] = data.diskUsage
        .split('/')
        .map((item) => parseFloat(item.trim().replace('G', '')))
      diskUsage.value = {
        used: used.toFixed(1),
        total: total.toFixed(1),
        percentage: ((used / total) * 100).toFixed(0)
      }
    }

    // 3. 更新内存图表
    if (data.memoryHistory) {
      const memoryData = data.memoryHistory.map(Number) //将数组中的每个字符串元素转换为数值类型
      option.series[0].data = memoryData
      // option.xAxis.data = Array.from(
      //   { length: memoryData.length },
      //   (_, i) => `${memoryData.length - i - 1}s`
      // )
      chartInstance?.setOption(option)
    }

    // 4. 更新CPU负载仪表盘
    if (data.cpuLoad) {
      const cpuValue = Math.abs(parseFloat(data.cpuLoad))
      option1.series[0].data[0].value = cpuValue
      chartInstance1?.setOption(option1)
    }

    // 5. 更新饼图数据
    if (data.totalArticles && data.truthRatio) {
      // 解析真实比例（处理百分比符号）
      const realPercent = parseFloat(data.truthRatio.replace('%', '')) / 100
      // 计算真实/虚假文章数
      const realCount = Math.round(data.totalArticles * realPercent)
      const fakeCount = data.totalArticles - realCount

      // 更新饼图数据
      option2.series[0].data = [
        { value: fakeCount, name: '虚假文章' },
        { value: realCount, name: '真实文章' }
      ]

      // 强制更新图表（解决数据未变化时不渲染的问题）
      chartInstance2?.setOption(option2, { notMerge: true })
    }
    // 在sj函数内添加内存使用率更新
    if (data.memoryUsage) {
      const [usage, total] = data.memoryUsage.split('/').map((s) => parseFloat(s))
      const memoryOptionUpdate = {
        title: [
          {},
          {
            text: `实时数据：${usage.toFixed(1)}G/${total.toFixed(1)}G`
          }
        ]
      }
      chartInstance?.setOption(memoryOptionUpdate)
    }
  } catch (error) {
    console.error('获取数据失败:', error)
  }
}

sj()

onUnmounted(() => {
  // 移除窗口大小变化的监听
  window.removeEventListener('resize', resizeChart)
  // 销毁图表实例
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  // 销毁新增图表
  if (chartInstance1) {
    chartInstance1.dispose()
    chartInstance1 = null
  }
  if (chartInstance2) {
    chartInstance2.dispose()
    chartInstance2 = null
  }
})
</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.5);
  align-items: center;
  width: 80%;
  height: 100px;
}

.icon-container {
  margin: 15px;
  margin-right: 10px;
  background-color: #f0f4ff;
  border-radius: 50%;
  width: 55px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon {
  width: 60px;
  height: 60px;
}

.content {
  flex: 1;
}

.main-value {
  font-size: 30px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
  margin-left: 10px;
}

.card-title {
  font-size: 15px;
  color: #606266;
  margin-bottom: 8px;
  margin-left: 10px;
}

.sub-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 10px;
  text-align: center;
}

.percentage-container {
  display: flex;
  align-items: center;
  gap: 4px;
}

.trend-icon {
  width: 16px;
  height: 16px;
}

.percentage {
  font-size: 13px;
  color: #67c23a;
  font-weight: 500;
}

.time-range {
  font-size: 13px;
  color: #909399;
}

.chart {
  margin-top: 18px;
  width: 100%;
  height: 300px;
  background-color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}

.chart2 {
  padding-top: 10px;
  width: 100%;
  height: 300px;
}

.disk-usage-card {
  margin-top: 20px;
  margin-left: 80px;
  background-color: #0e3a5f;
  border-radius: 20px;
  /* padding: 20px; */
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  width: 80%;
}

.disk-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.disk-progress-container {
  width: 100%;
  margin-bottom: 15px;
}

.disk-progress-bar {
  height: 45px;
  background-color: #ececec;
  /* border-radius: 5px; */
  border-right: 1px solid #ececec;
  overflow: hidden;
}

.disk-progress {
  height: 100%;
  background-color: #00b8be;
  /* border-radius: 5px; */
  transition: width 0.3s ease;
}

.disk-info {
  font-size: 20px;
}

.disk-used {
  color: #ffffff;
  font-weight: bold;
}
</style>
