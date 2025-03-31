<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <template v-slot:header>
            <div class="clearfix">
              <span>个人信息</span>
            </div>
          </template>
          <div>
            <div class="text-center">
              <avatar :user="userInfo" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon="user" />&nbsp;&nbsp;用户名称
                <div class="pull-right">{{ userInfo.userName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon="phone" />&nbsp;&nbsp;个人简介
                <div class="pull-right">{{ userInfo.userProfile }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon="peoples" />&nbsp;&nbsp;所属角色
                <div class="pull-right">{{ userInfo.userRole }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon="date" />&nbsp;&nbsp;创建日期
                <div class="pull-right">{{ userInfo.updateTime?.split('T')[0] }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card>
          <template v-slot:header>
            <div class="clearfix">
              <span>修改基本资料</span>
            </div>
          </template>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userinfo :user="userInfo" />
            </el-tab-pane>
            <el-tab-pane label="更改密码" name="userpassword">
              <userpassword :user="userInfo" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import avatar from '@/views/user/components/avatar.vue'
import userinfo from '@/views/user/components/userinfo.vue'
import userpassword from '@/views/user/components/userpassword.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores'
import { onMounted } from 'vue'

const userStore = useUserStore()
const activeTab = ref('userinfo')
onMounted(async () => {
  // 调用 getUser 来获取用户信息
  await userStore.getUser()
})

// 访问 user 里的值
const userInfo = userStore.user
</script>

<style lang="scss" scoped>
.list-group-striped > .list-group-item {
  border-left: 0;
  border-right: 0;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
}

.list-group-item {
  list-style: none;
  border-bottom: 1px solid #e7eaec;
  border-top: 1px solid #e7eaec;
  margin-bottom: -1px;
  padding: 11px 0;
  font-size: 13px;
}

.pull-right {
  float: right !important;
}

:v-deep .el-card__body {
  height: 230px;
}

:v-deep .box-card {
  height: 450px;
}
</style>
