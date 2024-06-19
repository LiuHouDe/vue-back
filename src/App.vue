<script setup>
import { nextTick, provide, ref } from "vue";
import Navbar from "./components/view/Navbar.vue";
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.js"
import Header from "@/components/Page/header.vue"
import Banner from "@/components/view/FooterBanner.vue"
const isRouterAlive = ref(true);
provide("relode", relode);
function relode() {
    isRouterAlive.value = false;
    nextTick(() => (isRouterAlive.value = true));
}
</script>

<template>
    <div class="common-layout limiter ">
        <el-container>
            <el-header>
                <Header></Header>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <Navbar v-if="isRouterAlive"></Navbar>
                </el-aside>
                <el-main>
                    <RouterView></RouterView>
                </el-main>
            </el-container>
        </el-container>
    </div>
    <Banner></Banner>
</template>

<style scoped>
.limiter {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    padding: 15px;
    background: #f2f2f2;
}

.el-main {
    padding: 0;
}

.el-header {
    background-color: black;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px
}
</style>
