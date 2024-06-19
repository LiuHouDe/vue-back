<template>
  <el-scrollbar>
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
      :default-active="currentPath" router text-color="#fff">
      <el-menu-item index="/">
        <el-icon> </el-icon>
        <span>首頁</span>
      </el-menu-item>
      <el-menu-item index="/findusers">
        <el-icon> </el-icon>
        <span>會員管理</span>
      </el-menu-item>
      <el-menu-item index="/movie/findlist">
        <el-icon> </el-icon>
        <span>電影管理</span>
      </el-menu-item>
      <el-menu-item index="/screen/resources">
        <el-icon> </el-icon>
        <span>場次管理</span>
      </el-menu-item>
      <el-menu-item index="/cinema/list">
        <el-icon> </el-icon>
        <span>影院 管理</span>
      </el-menu-item>
      <el-menu-item index="/order">
        <el-icon> </el-icon>
        <span>訂單管理</span>
      </el-menu-item>

      <el-menu-item index="/comment">
        <el-icon> </el-icon>
        <span>評論管理</span>
      </el-menu-item>

      <el-menu-item index="/custService">
        <el-icon> </el-icon>
        <span>客服管理</span>
      </el-menu-item>
      <el-menu-item index="/food">
        <el-icon> </el-icon>
        <span>餐點管理</span>
      </el-menu-item>
      <el-menu-item v-if="!token" index="/login">
        <el-icon> </el-icon>
        <span>登入</span>
      </el-menu-item>
      <el-menu-item v-else index="/login" @click="handlelogout">
        <el-icon> </el-icon>
        <span>登出</span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, watch, onMounted, computed ,inject} from "vue";
import axios from 'axios'
const route = useRoute();
const router = useRouter();
const relode = inject('relode');
const isLoggedIn = ref(false);
const currentPath = ref(route.path);
const authText = computed(() => (isLoggedIn.value ? '登出' : '登入'));
const token = localStorage.getItem('token');
// 監聽path變化顯示 激活bar
watch(route,(newRoute)=>{
  currentPath.value = newRoute.path;
})

const checkLoginStatus = () => {
  isLoggedIn.value = localStorage.getItem('token') !== null;
  console.log(isLoggedIn, authText)
};
const handlelogout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
  relode();
  checkLoginStatus();

};
</script>

<style scoped></style>
