<template>
    <div>
        <h3>影城列表</h3>
        <ul>
            <li v-for="cinema in cinemas" :key="cinema.id" @click="selectCinema(cinema)">
                {{ cinema.name }} {{ cinema.address }} {{ cinema.phone }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axiosApi from '@/plugins/axiosConfig.js';

const cinemas = ref([]);

function fetchCinemas() {
    axiosApi.get('/order/movie/findCinemaData')
        .then(response => {
            cinemas.value = response.data.allCinemaName;
            console.log(cinemas)
        })
        .catch(error => {
            console.error('Failed to fetch cinemas', error);
        });
};
const emits = defineEmits(["selectCinema"])
const selectCinema = (cinema) => {
    console.log(cinema)
    emits('selectCinema', cinema);
};
onMounted(() => {
    fetchCinemas();
});
</script>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}

li {
    cursor: pointer;
    padding: 10px;
    border-bottom: 1px solid #ccc;
}

li:hover {
    background-color: #f0f0f0;
}
</style>