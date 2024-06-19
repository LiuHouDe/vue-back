<template>
    <span>
        <span >排序條件:</span>
        <select :value="modelValue" @change="dochange">
            <option v-for="row in choices" :key="row" :value="row">{{ row }}</option>
        </select>
    </span>
</template>
    
<script setup>
    const props = defineProps(["modelValue", "choices"]);
    const emits = defineEmits(["update:modelValue", "change"]);
    function dochange(event) {
        emits('update:modelValue', event.target.value);
        emits("change");
    }
</script>
    
<style scoped>
    
</style>