<template>
    <div id="app" class="container">
        <div class="row">
            <div class="col-md-4">
                <CinemaList @selectCinema="selectCinema" @click="drawer = true" />
            </div>
            <div class="col-md-8">
                <GoogleMap :address="selectedCinema.address" :cinemaId="selectedCinema.cinema_id" />
            </div>
        </div>
        <el-drawer v-model="drawer" title="Edit Cinema" :with-header="false">
            <el-form :model="editCinema" label-width="auto" style="max-width: 600px">
                <el-form-item label="Cinema Name">
                    <el-input v-model="editCinema.name"></el-input>
                </el-form-item>
                <el-form-item label="Address">
                    <el-input v-model="editCinema.address"></el-input>
                </el-form-item>
                <el-form-item label="Phone">
                    <el-input v-model="editCinema.phone"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveCinema">Save</el-button>
                    <el-button @click="drawer = false">Cancel</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import CinemaList from '@/components/cinemacomponent/cinemaList.vue';
import GoogleMap from '@/components/cinemacomponent/GoogleMap.vue';
import { ElMessage } from 'element-plus';
import axiosapi from '@/plugins/axiosConfig.js' 
const selectedCinema = ref({ address: null, id: null });
const editCinema = ref({});
const drawer = ref(false)
const drawerVisible = ref(false);
const selectCinema = (cinema) => {
    console.log(cinema)
    selectedCinema.value = cinema;
    editCinema.value = { ...cinema }; // 初始化編輯表單
    drawerVisible.value = true; // 打開抽屜
};
const saveCinema = async () => {
    console.log(editCinema)
    try {
        const response = await axiosapi.post('/admin/backstage/update', editCinema.value);
        ElMessage.success('Cinema updated successfully');
        drawer.value = false; // 關閉抽屜
        // 更新 selectedCinema 資料
        selectedCinema.value = { ...editCinema.value };
    } catch (error) {
        ElMessage.error('Error updating cinema');
        console.error(error);
    }
};

</script>

<style scoped>
.container {

    height: 100vh;
}

.row {

    width: 100%;
}

.col-md-4,
.col-md-8 {
    padding: 10px;
}
</style>