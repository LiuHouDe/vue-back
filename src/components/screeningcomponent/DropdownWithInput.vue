<template>
    <div class="dropdown-with-input">
        <input type="text" v-model="inputValue" @blur="handleBlur" placeholder="Enter text" />
        <select v-model="selectedOption" @change="handleSelect">
            <option v-for="option in options" :key="option" :value="option">
                {{ option.name }}
            </option>
        </select>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axiosApi from '@/plugins/axiosConfig.js';

const selectedOption = ref('');
const inputValue = ref('');
const options = ref([]);
const dropdownOpen = ref(false);
const emits = defineEmits(['update']);
const toggleDropdown = (event) => {
    event.stopPropagation();
    dropdownOpen.value = !dropdownOpen.value;
};

const handleBlur = async () => {
    let data = {
        "name": inputValue.value
    }
    axiosApi.post('/backstage/movie/find', data).then(function (response) {
        options.value = response.data.list
        console.log("response", response);
    }).catch(function (error) {
        console.log("callFind error", error);
    });
};

const handleSelect = () => {
    console.log('Selected Option:', selectedOption.value);
    emits('update', selectedOption.value);

};
onMounted(() => {
    let data = {
        "name": ''
    }
    axiosApi.post('/backstage/movie/find', data).then(function (response) {
        options.value = response.data.list
        console.log("response", response);
    }).catch(function (error) {
        console.log("callFind error", error);
    });
})



</script>

<style scoped>
.dropdown-with-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

select,
input {
    padding: 10px;
    font-size: 16px;
}
</style>