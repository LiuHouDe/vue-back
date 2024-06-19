<template>
  <!-- 新增按鈕 -->
  <div class="row">
    <div class="col-4">
      <button type="button" class="btn btn-primary" @click="openModal('insert')">
        開啟新增
      </button>
      
    </div>
    
    <div class="col-4">
      <div class="input-group mb-3">
        <input type="text" class="form-control" aria-label="Recipient's username" aria-describedby="button-addon2"
          placeholder="請輸入產品名稱" list="datalistOptions" v-model="findName" @change="callFind(0)" />
        <datalist id="datalistOptions">
          <option value="爆米花"></option>
          <option value="熱狗堡"></option>
          <option value="吉拿棒"></option>
          <option value="可樂"></option>
          <option value="雪碧"></option>
        </datalist>
        <button class="btn btn-outline-secondary" type="button" id="button-addon2">
          search
        </button>
      </div>
      
    </div>
    <br />
    <div class="col-4">
      <FoodRows :total="total" :choices="[2, 3, 5, 10]" v-model="rows" @change="callFind"></FoodRows>
    </div>

    <br />

    <!-- 商品簡介以及修改&刪除按鈕 -->
    <div class="row">
      <FoodCard v-for="product in products" :key="product.id" :item="product" @open-update="openModal"
        @delete="callRemove">
      </FoodCard>
    </div>
    <!-- 新增及修改彈出視窗 -->
    <FoodModal ref="foodModalRef" :is-show-button-insert="isShowButtonInsert" v-model:id="product.id"
      v-model:name="product.name" v-model:price="product.price"
      v-model:count="product.count" 
      v-model:create-date="product.createDate"
      v-model:modify-date="product.modifyDate" @insert="callCreate" @update="callModify">
    </FoodModal>

    <!-- 分頁 -->
    <div class="col-2 page" v-show="total != 0">
      <Paginate :first-last-button="true" first-button-text="&lt;&lt;" last-button-text="&gt;&gt;" prev-text="&lt;"
        next-text="&gt;" :page-count="pages" :initial-page="current" v-model="current" :click-handler="callFind">
      </Paginate>
    </div>
  </div>
</template>

<script setup>
import Swal from "sweetalert2";
import axiosapi from "@/plugins/axiosConfig";
import Paginate from "vuejs-paginate-next";

import FoodCard from "@/components/foodcomponent/FoodCard.vue";
import FoodModal from "@/components/foodcomponent/FoodModal.vue";
import FoodRows from "@/components/foodcomponent/FoodRows.vue";
import { ref, onMounted } from "vue";

const products = ref(null);
const foodModalRef = ref(null);
const isShowButtonInsert = ref(true);
const product = ref({});
const findName = ref("");

//pagination start
const total = ref(0); //總資料筆數
const pages = ref(20); //分頁總數
const current = ref(1); //目前頁碼
const start = ref(0); //起始資料位置
const rows = ref(3); //分頁資料筆數
const lastPageRows = ref(0);
//pagination end

function openModal(action, id) {
  console.log("openMadalStart");
  console.log("action", action);
  console.log("id", id);
  if (action === "insert") {
    isShowButtonInsert.value = true;
    product.value = {};
  } else {
    // 修改,有id
    isShowButtonInsert.value = false;
    callFindById(id);
  }
  foodModalRef.value.showModal();
}

function callFind(page) {
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  console.log("page", current.value);
  if (page) {
    start.value = (page - 1) * rows.value;
    current.value = page;
  } else {
    start.value = 0;
    current.value = 1;
  }

  if (findName.value === "") {
    findName.value = null;
  }

  let data = {
    start: start.value,
    rows: rows.value,
    dir: false,
    order: "id",
    name: findName.value,
  };

  axiosapi
    .post("/backstage/food/find", data)
    .then(function (response) {
      console.log("data", data);
      console.log("counts", response.data.counts);
      console.log("response", response);
      console.log("start.value", start.value);
      console.log("rows.value", rows.value);
      products.value = response.data.list;

      //pagination start
      console.log("counts", response.data.counts);
      total.value = response.data.counts;
      console.log("total", total.value);

      pages.value = Math.ceil(response.data.counts / rows.value);
      lastPageRows.value = response.data.counts % rows.value;
      //pagination end

      setTimeout(function () {
        Swal.close();
      }, 500);
    })
    .catch(function (error) {
      console.log("callFind Error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}

function callModify() {
  console.log("---------");
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  if (product.value.id === "") {
    product.value.id = null;
  }
  if (product.value.name === "") {
    product.value.name = null;
  }
  if (product.value.price === "") {
    product.value.price = null;
  }
  if (product.value.make === "") {
    product.value.make = null;
  }
  if (product.value.expired === "") {
    product.value.expired = null;
  }
  let data = product.value;

  axiosapi
    .put(`/backstage/food/${product.value.id}`, data)
    .then(function (response) {
      console.log("response", response);
      console.log("product.value.id", product.value.id);
      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: "success",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        }).then(function () {
          foodModalRef.value.hideModal();
          callFind(current.value);
        });
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "warning",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        });
      }
    })
    .catch(function (error) {
      console.log("callModify error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}

function callRemove(id) {
  console.log("callRemove Start:", id);
  Swal.fire({
    text: "確定刪除？",
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonText: "確認",
    showCancelButton: true,
    cancelButtonText: "取消",
  }).then(function (result) {
    if (result.isConfirmed) {
      console.log("result", result);
      Swal.fire({
        text: "Loading......",
        showConfirmButton: false,
        allowOutsideClick: false,
      });
      axiosapi
        .delete(`/backstage/food/${id}`)
        .then(function (response) {
          if (response.data.success) {
            Swal.fire({
              text: response.data.message,
              icon: "success",
              allowOutsideClick: false,
              confirmButtonText: "確認",
            }).then(function () {
              console.log("delete success");
              if (lastPageRows.value === 1 && current.value > 1) {
                current.value = current.value - 1;
              }
              callFind(current.value);
            });
          } else {
            Swal.fire({
              text: response.data.message,
              icon: "warning",
              allowOutsideClick: false,
              confirmButtonText: "確認",
            });
          }
        })
        .catch(function (error) {
          Swal.fire({
            text: "失敗：" + error.message,
            icon: "error",
            allowOutsideClick: false,
            confirmButtonText: "確認",
          });
        });
    }
  });
}

function callCreate() {
  console.log("callCreate");
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });

  if (product.value.id === "") {
    product.value.id = null;
  }
  if (product.value.name === "") {
    product.value.name = null;
  }
  if (product.value.price === "") {
    product.value.price = null;
  }
  if (product.value.make === "") {
    product.value.make = null;
  }
  if (product.value.expired === "") {
    product.value.expired = null;
  }
  let data = product.value;

  axiosapi
    .post("/backstage/food", data).then(function (response) {
      console.log("callCreate", response);
      if (response.data.success) {
        
        
        Swal.fire({
          text: response.data.message,
          icon: "success",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        }).then(function () {
          foodModalRef.value.hideModal();
          callFind(current.value);
          
          
        });


      } else {
        Swal.fire({
          text: response.data.message,
          icon: "warning",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        });
      }
    })
    .catch(function (error) {
      console.log("callCreate error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}

function callFindById(id) {
  // Swal.fire({
  //   text: "Loading......",
  //   showConfirmButton: false,
  //   allowOutsideClick: false,
  // });
  axiosapi
    .get(`/backstage/food/${id}`)
    .then(function (response) {
      console.log("response", response.data.list[0]);
      if (response.data.list.length != 0) {
        product.value = response.data.list[0];
      }
      setTimeout(function () {
        Swal.close();
      }, 500);
    })
    .catch(function (error) {
      console.log("callFindById error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}


onMounted(function () {
  callFind();
});
</script>

<style scoped>
.page{
  margin: 0 auto;
}
</style>
