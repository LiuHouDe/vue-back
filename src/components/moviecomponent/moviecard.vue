<template>
    <div class="col-9">
        <div class="card">
            <div class="image-upload-container">
                <img v-if="imageUrl" class="card-img-top upload-preview" :src="imageUrl" :alt="movie.name"
                    height="300px">
                <img v-else class="card-img-top " :src="photoURL + movie.id" :alt="movie.name" height="300px">
                <input type="file" @change="handleFileChange" accept="image/*" class="file-input">
                <div v-if="!imageUrl" class="upload-placeholder col text-start">
                    點擊圖片上傳圖檔
                </div>
                <div class="col text-end">
                    <a href="#" class="btn btn-secondary btn-sm" @click="uploadImage(movie.id)">上傳圖片</a>
                </div>
            </div>

            <div class="card-body">
                <div class="col text-start">
                    <h5 class="card-title">{{ movie.name }}</h5>
                </div>

                <div class="card-text text-danger text-end">NTA${{ movie.price }}</div>
                <div class="row">
                    <div class="col text-start">
                        <a href="#" class="btn btn-primary" @click="doclick1('update', movie.id)">開啟修改</a>
                    </div>
                    <div class="col text-end">
                        <a href="#" class="btn btn-primary" @click="doclick2(movie.id)">刪除</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, defineProps, defineEmits, watch } from "vue"
import axiosapi from "@/plugins/axiosConfig.js"

const props = defineProps(["movie"])
const emits = defineEmits(["openUpdate", "delete"])
const photoURL = import.meta.env.VITE_END_URL + "/backstage/movie/photo/"
const selectedFile = ref(null);
const imageUrl = ref(null);
const imageSrc = ref('')
function doclick1(action, data) {
    emits("openUpdate", action, data)
}
function doclick2(data) {
    emits("delete", data)
}

const fetchImage = async (id) => {
    try {
        const response = await axiosapi.get(`/backstage/movie/photo/${id}`, {
            responseType: 'blob'
        });
        imageSrc.value = URL.createObjectURL(response.data);
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}
const handleFileChange = event => {
    selectedFile.value = event.target.files[0];
    if (selectedFile.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageUrl.value = e.target.result;
        };
        reader.readAsDataURL(selectedFile.value);
    }
};
function uploadImage(id) {
    console.log("upload")
    if (!selectedFile.value) {
        return;
    }
    const formData = new FormData();
    formData.append('file', selectedFile.value);

    axiosapi.post(`/admin/backstage/movie/uploadPhoto/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            console.log('Image uploaded successfully:', response.data);
            imageUrl.value = null;
            selectedFile.value = null;
            alert('上傳成功！');
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
};

</script>

<style scoped>
.image-upload-container {
    position: relative;
}

.file-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: calc(100% - 40px); 
    opacity: 0;
    cursor: pointer;
}

.upload-placeholder, .btn-secondary {
    z-index: 2; 
}
.card-img-top {
    width: 100%;
    max-height: 800px; 
    object-fit: contain;
}
</style>