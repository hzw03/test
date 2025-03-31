<script setup>
import {
  Management,
  Promotion,
  UserFilled,
  User,
  Crop,
  EditPen,
  SwitchButton,
  CaretBottom
} from '@element-plus/icons-vue'
import avatar from '@/assets/default.png'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores'
// import router from '@/router';
import { useRouter } from 'vue-router'

const userStore = useUserStore()
onMounted(() => {
  userStore.getUser()
})

const router = useRouter()
const handleCommand = async (key) => {
  if (key === 'logout') {
    await ElMessageBox.confirm('你确认退出登录吗？', '温馨提示', {
      type: 'warning',
      confirmButtonText: '确认',
      cancelButtonText: '取消'
    })
    userStore.removeToken()
    router.push('/login')
  } else {
    router.push(`/user/${key}`)
  }
}
</script>
<!-- :default-active="$route.path"   实现高亮 -->
<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="rgba(0, 0, 0, 0)"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/index/index">
          <el-icon><Promotion /></el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>新闻识别</span>
        </el-menu-item>
        <el-menu-item index="/imagetext/imagetext">
          <el-icon><Promotion /></el-icon>
          <span>图文识别</span>
        </el-menu-item>
        <el-menu-item index="/videotext/videotext">
          <el-icon><Promotion /></el-icon>
          <span>视频识别</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div style="color: aliceblue">AI 分析系统</div>
        <!-- 下拉菜单 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <span style="border: 1px solid #ffffff; border-radius: 100%"
              ><el-avatar :src="userStore.user.userAvatar || avatar"
            /></span>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: aliceblue">{{
              userStore.user.userName
            }}</span>
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
              <!-- <el-dropdown-item command="avatar" :icon="Crop">更换头像</el-dropdown-item> -->
              <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
        <el-footer style="color: rgb(110, 110, 110)">AI 分析系统 ©2025 Created by </el-footer>
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  .el-aside {
    background-image: url('@/assets/cb.png'); /* 添加背景图片 */
    background-size: cover; /* 背景图片覆盖整个容器 */
    background-position: center; /* 背景图片居中 */
    &__logo {
      height: 120px;
      background: url('@/assets/logos.png') no-repeat center / 60px auto;
      img {
        width: 50%;
        height: 50%;
      }
    }
    .el-menu {
      border-right: none;
    }
  }
  .el-header {
    background-image: url('@/assets/db.png');
    background-size: cover; /* 背景图片覆盖整个容器 */
    background-position: center; /* 背景图片居中 */
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-dropdown__box {
      display: flex;
      align-items: center;
      margin: 10px;
      padding: 10px;
      .el-icon {
        color: #ffffff;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #ffffff;
  }
}
</style>
