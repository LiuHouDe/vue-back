<template>
  
  <div class="col-lg-4 col-md-6">
    <div class="card">
      <img class="card-img-top" :src="`${path}${item.id}`" :alt="item.name" />
      <div class="card-body">
        <h5 class="card-title">{{ item.name }}</h5>
        <div class="card-text text-end text-danger">NT$ {{ item.price }}</div>
        <div class="row">
          <div class="col text-start">
            <a href="#" class="btn btn-primary" @click="doclick1(item.id)">
              開啟修改
            </a>
          </div>
          <div class="col text-mid">
            <UploadFoodImage :item="item" >
            </UploadFoodImage>
          </div>
          <div class="col text-end">
            <a href="#" class="btn btn-primary" @click="doclick2(item.id)">
              刪除商品
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import UploadFoodImage from "@/components/foodcomponent/UploadFoodImage.vue";

const path = import.meta.env.VITE_FOODPICTURE_URL;
const props = defineProps(["item"]);
const emits = defineEmits(["openUpdate", "delete"]);

function doclick1(id) {
  emits("openUpdate", "update", id);
}
function doclick2(id) {
  console.log("delete", id);
  emits("delete", id);
}


</script>

<style scoped>
img {
  width: 200px;
  margin: 0 auto;
}
.card {
  width: 80%;
  margin: 5% auto;
  border-radius: 10px;
  box-shadow: 3px 3px 5px black;
}
</style>
