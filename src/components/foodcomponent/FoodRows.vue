<template>
  <span>
    <span v-if="total <= 0">查無您要的餐點</span>
    <span v-else>查到{{ total }}筆餐點</span>
    <span>
      ，每頁顯示
      <select :value="modelValue" @change="dochange">
        <option v-for="row in choices" :key="row" :value="row">
          {{ row }}
        </option>
      </select>
      筆
    </span>
  </span>
</template>

<script setup>
const props = defineProps(["modelValue", "choices", "total"]);
const emits = defineEmits(["update:modelValue", "change"]);
function dochange(event) {
  console.log("event", event);
  console.log("event.target", event.target); //select option
  console.log("event.target.value", event.target.value);
  emits("update:modelValue", event.target.value); //:choices="[2, 3, 5, 10]"其一
  emits("change");
}
</script>

<style></style>
