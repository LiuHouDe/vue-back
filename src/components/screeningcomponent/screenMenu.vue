<template>
    <br></br>
    <span>選擇分店:
        <select id="search_1" size="1" @change="dochange1" style="width:150px;">
            <option value="default_1">請選擇</option>
            <option v-for="item in cinema" :key="item" :value="item.cinema_id">{{ item.name }}</option>
        </select>
        <br>
        影廳編號:
        <select id="search_2" size="1" @change="dochange2" style="width:150px;">
            <option value="default_2">請選擇</option>
            <option v-for="item in auditoriums" :key="item" :value="item.auditorium_id">{{ item.auditorium_number }}</option>
        </select>
        <br>
        <div>
            <button @click="search" type="button">查詢場次表</button>
        </div>
        <br>
    </span>
</template>

<script setup>
const props = defineProps(["cinema", "movies", "movieDate", "movieTime", "movieShowtimes","auditoriums"])
const emits = defineEmits(["update:modelValue", "auditoriumsChange" ,"cinemaChange", "movieChange", "dateChange", "showTimeChange", "searchScreening"])
function dochange1(event) {
    emits("cinemaChange", event.target.value);
}
function dochange2(event) {
    emits("auditoriumsChange", event.target.value);
}
function dochange3(event) {
    emits("dateChange", event.target.value);
}
function dochange4(event) {
    emits("showTimeChange", event.target.value);
}
function search() {
    emits("searchScreening");
}
</script>

<style scoped></style>