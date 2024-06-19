<template>
    <span>
        <span v-if="total<=0">查無資料</span>
        <span v-else>查到{{ total }}筆資料</span>
        ，每頁顯示
        <select :value="modelValue" @change="dochange">
            <option v-for="row in choices" :key="row" :value="row">{{ row }}</option>
        </select>
    筆</span>
</template>
    
<script setup>
    const props = defineProps(["modelValue", "choices", "total"]);
    const emits = defineEmits(["update:modelValue", "change"]);
    function dochange(event) {
        emits('update:modelValue', event.target.value);
        emits("change");
    }
</script>
    
<style scoped>
    
</style>