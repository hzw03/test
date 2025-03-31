<script setup>
import znCn from 'element-plus/dist/locale/zh-cn.mjs'
</script>

<template>
  <div>
    <el-config-provider :locale="znCn">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
<style scoped></style>
