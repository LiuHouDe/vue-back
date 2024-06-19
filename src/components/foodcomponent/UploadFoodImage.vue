<template>
  <div class="image-upload-container">
                
    <img v-if="imageUrl" class="card-img-top upload-preview" :src="imageUrl" :alt="item.name"
    height="300px">
    <input type="file"  @change="handleFileChange" accept="image/*" class="file-input" >
    <span v-if="!imageUrl" class="upload-placeholder col text-start">
    </span>
    <div class="col text-end">
      <a href="#" class="btn btn-secondary btn-md" @click="uploadImage(item.id)">上傳圖片</a>
    </div>
                <!-- <div class="col text-end">
                        <a href="#" class="btn btn-danger btn-md" @click="removePic(item.id)">刪除圖片</a>
                    </div> -->
  </div>
</template>

<script setup>

import Swal from 'sweetalert2';
import axiosapi from '@/plugins/axiosConfig.js';
import { ref } from 'vue'

const props = defineProps(["item"]);

const imageUrl = ref(null);
const selectedFile = ref(null);

function handleFileChange(event){
  selectedFile.value = event.target.files[0];
  console.log("selectedFile.value",event.target.files[0]);
  if(selectedFile.value){
    const reader = new FileReader();
    console.log("reader",reader);
    reader.onload = function(element){
      
      imageUrl.value = element.target.result;
      
    };
    reader.readAsDataURL(selectedFile.value);
    
  }
}

function uploadImage(id) {
    // console.log("upload id:", id)
    // console.log("selectedFile.value",selectedFile.value);
    if (!selectedFile.value) {
      alert("請選擇檔案");
        return;
    }else{
      const formData = new FormData();
    formData.append('files', selectedFile.value);
    
    console.log("formdata",formData);

    axiosapi.post(`/backstage/food/uploadPhoto/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(function (response) {
            console.log('Image uploaded successfully:', response.data);
            imageUrl.value = null;
            selectedFile.value = null;
            alert('上傳成功！');
        })
        .catch(function(error) {
            console.error('Error uploading image:', error.response.data);
        });
      }
};



// function removePic(id){
//     console.log("removePic Start:", id);
//   Swal.fire({
//     text: "確定刪除？",
//     icon: "warning",
//     allowOutsideClick: false,
//     confirmButtonText: "確認",
//     showCancelButton: true,
//     cancelButtonText: "取消",
//   }).then(function (result) {
//     if (result.isConfirmed) {
//       Swal.fire({
//         text: "Loading......",
//         showConfirmButton: false,
//         allowOutsideClick: false,
//       });
//       axiosapi
//         .delete(`/backstage/foodpicture/${id}`)
//         .then(function (response) {

//           console.log("response.data",response.data);
//           if (response.data.success) {
//             Swal.fire({
//               text: response.data.message,
//               icon: "success",
//               allowOutsideClick: false,
//               confirmButtonText: "確認",
//             }).then(function () {
//               console.log("delete success");
              
//             });
//           } else {
//             Swal.fire({
//               text: response.data.message,
//               icon: "warning",
//               allowOutsideClick: false,
//               confirmButtonText: "確認",
//             });
//           }
//         })
//         .catch(function (error) {
//           Swal.fire({
//             text: "失敗：" + error.message,
//             icon: "error",
//             allowOutsideClick: false,
//             confirmButtonText: "確認",
//           });
//         });
//     }
//   });
// }
</script>

<style scoped>
input[type="file"]::file-selector-button {
    visibility: hidden;
    width: 0;
    height: 0;
  }

</style>