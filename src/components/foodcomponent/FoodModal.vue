<template>
  <div
    ref="exampleModalRef"
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">餐點資訊</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <table>
            <!-- <tr>
              <td>Id :</td>
              <td>
                <input
                  type="text"
                  name="id"
                  :value="id"
                  @input="emits('update:id', $event.target.value)"
                />
              </td>
            </tr> -->
            <tr>
              <td>Name :</td>
              <td>
                <input
                  type="text"
                  name="name"
                  :value="name"
                  @input="emits('update:name', $event.target.value)"
                />
              </td>
            </tr>
            
            <tr>
              <td>Price :</td>
              <td>
                <input
                  type="text"
                  name="price"
                  :value="price"
                  @input="emits('update:price', $event.target.value)"
                />
              </td>
            </tr>

            <tr>
              <td>Count :</td>
              <td>
                <input
                  type="text"
                  name="count"
                  :value="count"
                  @input="emits('update:count', $event.target.value)"
                />
              </td>
            </tr>

            <tr>
              <td>CreateDate :</td>
              <td>
                <input
                  type="text"
                  name="createDate"
                  :value="createDate"
                  @input="emits('update:createDate', $event.target.value)"
                />
              </td>
            </tr>

            <tr>
              <td>ModifyDate :</td>
              <td>
                <input
                  type="text"
                  name="modifyDate"
                  :value="modifyDate"
                  @input="emits('update:modifyDate', $event.target.value)"
                />
              </td>
            </tr>
          </table>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-primary"
            v-show="isShowButtonInsert"
            @click="emits('insert')"
          >
            新增
          </button>
          <button
            type="button"
            class="btn btn-primary"
            v-show="!isShowButtonInsert"
            @click="emits('update')"
          >
            修改
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps([
  "id",
  "name",
  
  "price",
  "count",
  
  "createDate",
  "modifyDate",
  "isShowButtonInsert",
]);
const emits = defineEmits([
  "update:id",
  "update:name",
  
  "update:price",
  "update:count",
  
  "update:createDate",
  "update:modifyDate",
  "insert",
  "update",
]);

import { ref, onMounted } from "vue";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";

const exampleModalRef = ref(null);
const exampleModalObj = ref(null);
onMounted(function () {
  exampleModalObj.value = new bootstrap.Modal(exampleModalRef.value);
});

function showModal() {
  exampleModalObj.value.show();
}
function hideModal() {
  exampleModalObj.value.hide();
}
defineExpose({
  showModal,
  hideModal,
});
</script>

<style scoped>
.modal {
  z-index: 1500;
}
</style>
