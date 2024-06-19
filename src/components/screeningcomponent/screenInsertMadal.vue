<template>
    <div class="modal">
        <input type="date" v-model="localStartDate" />
        <input type="date" v-model="localEndDate" />
        <button @click="submitDates">確認送出</button>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
    startDate: String,
    endDate: String
});

const emits = defineEmits(['updateDates']);
const localStartDate = ref(props.startDate);
const localEndDate = ref(props.endDate);

// Watch for external changes
watch(() => props.startDate, (newVal) => {
    localStartDate.value = newVal;
});

watch(() => props.endDate, (newVal) => {
    localEndDate.value = newVal;
});

const submitDates = () => {
    emits('updateDates', { startDate: localStartDate.value, endDate: localEndDate.value });
};
</script>

<style scoped>
.modal {
    padding: 20px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
}
</style>