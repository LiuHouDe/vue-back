<template>
    <label class="list-group" :class="{ active: isActive }" id="list-tab" role="tablist">
        <div @click="handleClick">
            <div class="d-flex align-items-center">
                <input class="form-check-input custom-hidden-checkbox" type="checkbox" value="" aria-label="...">
            </div>
            <a class="list-group-item list-group-item-action" :class="{ active: isActive }" id="list-home-list"
                data-bs-toggle="list" href="#list-home" role="tab" aria-controls="list-home">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">{{ movie.name }}</h5>
                    <small>{{ movie.releaseDate }} ~ {{ movie.endDate }}</small>
                </div>
                <p class="mb-1">{{ movie.name_eng }}</p>
                <small>{{ movie.director }}</small>
            </a>
        </div>
        <button @click.stop="goToDetails(movie.id)">檢視場次</button>
    </label>
</template>

<script setup>
import { ref, defineProps, defineEmits, inject, onMounted, watch } from "vue";
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
    movie: Object
});
const emits = defineEmits(["openUpdate", "delete", "select", 'checkbox']);

const updateActiveMovie = inject('updateActiveMovie');
const activeMovie = inject('activeMovie');

const isActive = ref(false);

onMounted(() => {
    if (activeMovie && activeMovie.id === props.movie.id) {
        isActive.value = true;
    }
});

function doclick1(action, data) {
    emits("openUpdate", action, data);
}

function doclick2(data) {
    emits("delete", data);
}

function handleClick() {
    if (isActive.value) {
        updateActiveMovie(null);
    } else {
        updateActiveMovie(props.movie);
    }
    isActive.value = !isActive.value;
    emits('select', props.movie); 
}

function goToDetails(id) {
    router.push({
        path: '/screen/calendar',
        query: { movie_id: id }
    });
}

watch(activeMovie, (newActiveMovie) => {

    isActive.value = newActiveMovie && newActiveMovie.id === props.movie.id;
});
</script>

<style scoped>
.custom-list-group-item {
    position: relative;
    padding-left: 30px;
    cursor: pointer;
}

.custom-list-group-item.active {
    background-color: #007bff;
    color: white;
}

.form-check-input.custom-hidden-checkbox {
    display: none;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    padding-left: 10px;
}
</style>