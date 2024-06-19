<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3">
                <ScreenMenu :cinema="cinema" :movies="movies" :movieDate="movieDate" :movieTime="movieTime"
                    :auditoriums="auditoriums" :movieShowtimes="movieShowtimes" @cinema-change="dochange1"
                    @auditoriums-change="dochange2" @search-screening="doclick" />
                <button @click="goToDetails(movieselect.id)" class="btn btn-primary mt-2">資源檢視圖</button>
            </div>
            <div class="col-md-9">
                <div class="row mb-3">
                    <div class="col-md-4">
                        <el-date-picker v-model="formattedDateRange" type="daterange" range-separator="至"
                            start-placeholder="開始日期" end-placeholder="結束日期" class="w-100" />
                    </div>
                    <div class="col-md-4">
                        <select v-model="frequency" class="form-select">
                            <option selected>全日</option>
                            <option>僅熱門時段</option>
                            <option>僅早午夜場</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <button @click="submitDates" class="btn btn-success w-100">多筆場次新增</button>
                    </div>
                </div>
                <div>
                    <div id="external-events"></div>
                    <p>上映日期：{{ startDate }}</p>
                    <p>下檔日期：{{ endDate }}</p>
                </div>
            </div>
            <FullCalendar :options="calendarOptions" ref="calendarRef" id="calendar" />
            <button @click="saveChanges" class="btn btn-primary mt-3 save-button">保存變更</button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, computed , watch  } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import Swal from 'sweetalert2';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import axiosapi from '@/plugins/axiosConfig';
import ScreenMenu from './screenMenu.vue'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import { ElDatePicker } from 'element-plus';
const router = useRouter();
const route = useRoute();
const cinema = ref('');
const movies = ref('');
const movie = ref('');
const movieDate = ref('');
const movieTime = ref('');
const screeningId = ref('');
const screenings = ref('')
const cinemaId = ref('')
const auditoriumId = ref('')
const auditoriums = ref('')
const movieShowtimes = ref('');
const frequency = ref('')
const movieselect = ref({})
const dateRange = ref([new Date(movieselect.value.releaseDate), new Date(movieselect.value.endDate)]);
const eventElDrag = ref('')
const startTimeDrag = ref('')
const startDate = ref('')
const endDate = ref('')
const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin],
    initialView: 'timeGridWeek',
    slotMinTime: '09:00:00',
    slotMaxTime: '25:00:00',
    editable: true,
    droppable: true,
    events: [],
    eventReceive: handleEventReceive,
    eventChange: handleEventChange,
    eventDrop: handleEventDrop,
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    eventOverlap: false,
    allDaySlot: false,
    resourceAreaHeaderContent: 'Auditorium',
    resources: auditoriums.value,
    eventContent: function (arg) {
        return { html: arg.event.title };
    },
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'timeGridDay,timeGridWeek,dayGridMonth',
    },
    eventDidMount: (info) => {
        const fontSize = info.event.extendedProps.customFontSize;
        if (fontSize) {
            info.el.style.fontSize = fontSize;
        }
        info.el.oncontextmenu = (e) => handleRightClick(e, info.event);
    },
});
const calendarRef = ref(null);
const deleteScreens = ref([]);
// 拖動事件
onMounted(() => {
    fetchMovieEvents();
});
watch(movieselect, (newMovie) => {
    if (newMovie) {
        startDate.value = newMovie.releaseDate;
        endDate.value = newMovie.endDate;
    }
}, { immediate: true });
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1); // 月份從0開始
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-'); // 格式化為YYYY-MM-DD
}
// 獲得電影事件
function fetchMovieEvents() {
    axiosapi.get(`/backstage/movie/${route.query.movie_id}`).then(function (response) {
        const container = document.getElementById('external-events');
        movieselect.value = response.data.list[0]
        dateRange.value = ref([new Date(movieselect.value.releaseDate), new Date(movieselect.value.endDate)])
        container.innerHTML = '';
        response.data.list.forEach(movie => {
            const eventEl = document.createElement('div');
            eventEl.className = 'fc-event';
            eventEl.className = 'fc-event draggable-event';
            eventEl.innerHTML = `${movie.name} <br>片長: ${movie.duration}分鐘<br>`;
            eventEl.style.width = calculateWidthFromText(eventEl.innerText);
            eventEl.dataset.id = movie.id;
            eventEl.dataset.duration = movie.duration;
            eventEl.dataset.movieId = movie.id;

            container.appendChild(eventEl);
        });

        new Draggable(container, {
            itemSelector: '.fc-event',
            eventData: function (eventEl) {
                return {
                    title: eventEl.innerHTML + '開始時間:',
                    duration: eventEl.dataset.duration,
                    id: 0,
                    isModified: true,
                    movieid: movieselect.value.id,
                    auditoriumId: auditoriumId.value,
                    markedForDeletion: false
                };
            }
        });
    });
}
function calculateWidthFromText(text) {
    const baseWidth = 100;
    const additionalWidthPerCharacter = 8;
    return `${baseWidth + text.length * additionalWidthPerCharacter}px`;
}
function calculateWidthFromDuration(duration) {
    const baseWidth = 100;
    const widthPerMinute = 4;
    return `${baseWidth + duration * widthPerMinute}px`;
}
// 事件被放置到日曆上
function handleEventReceive(info) {
    let duration = parseInt(info.draggedEl.dataset.duration, 10); // Get duration from the dragged element
    let endTime = new Date(info.event.start.getTime() + duration * 60000); // Calculate end time based on duration
    info.event.setEnd(endTime); // Set the end time of the event
    const startTime = info.event.start;
    info.event.setProp('title', `${info.event.title} ${startTime.toLocaleTimeString()}`);
    info.event.setExtendedProp('customFontSize', duration < 100 ? '3px' : 'inherit');
    let eventApi = info.event;
    console.log(movieselect.value.id)
    console.log(`Event ${eventApi.title} marked as modified.`);
    console.log('Event received:', info.event.title);
    console.log('Start:', info.event.start.toISOString());
    console.log('End:', info.event.end.toISOString());
    console.log(info.event)

}

// 事件時間變更
function handleEventDrop(info) {
    let eventApi = info.event;
    eventApi.setExtendedProp('isModified', true);
    console.log(`Event ${eventApi.title} marked as modified.`);
}

function handleEventChange(info) {
}

function dochange1(event) {
    if (event == "default_1") {
        movies.value = '';
        movieDate.value = '';
        movieTime.value = '';
        // movieShowtimes.value='';
        screeningId.value = '';
        return;
    }
    console.log("test", event);
    cinemaId.value = event
    axiosapi.get("/backstage/auditorium?cinemaId=" + event).then(function (response) {
        console.log(response)
        movies.value = response.data.movies;
        auditoriums.value = response.data.list;
        console.log(auditoriums)
    }).catch(function (response) {
        console.log(response);
    })
}

function dochange2(event) {
    if (event == "default_2") {
        movieDate.value = '';
        movieTime.value = '';
        auditoriumId.value = '';
        return;
    }
    console.log(event)
    auditoriumId.value = event
}


function doclick() {
    //find by a_id m_id(no mid sugguest)
    console.log("test")
    // `/backstage/screen?mid=${movieselect.value.id}&aid=${auditoriumId.value}`
    axiosapi.get(`/backstage/screenbya?aid=${auditoriumId.value}`).then(function (response) {
        screenings.value = response.data.list
        console.log(screenings);
        addEventToCalendar();
    }).catch(function (response) {
        console.log(response);
    })
}
function addEventToCalendar() {
    console.log(screenings)
    const events = screenings.value.map(screening => ({
        title: `Screening ID: ${screening.Screening_id} <br>${screening.name}`,
        start: screening.Start_time,
        end: screening.End_time,
        id: screening.Screening_id,
        movieid: movieselect.value.id,
        auditoriumId: auditoriumId.value,
        isModified: false,
        markedForDeletion: false,
    }));
    console.log(events.start)
    console.log(formatDateWithoutTimezone(events))
    calendarOptions.value.events = events;
}

function saveChanges() {
    //回傳修改事件
    let modifiedEvents = calendarRef.value.getApi().getEvents().filter(event => event.extendedProps.isModified);
    console.log(modifiedEvents)
    let eventData = modifiedEvents.map(event => ({
        movieid: event.extendedProps.movieid,
        auditoriumId: event.extendedProps.auditoriumId,
        start: formatDateWithoutTimezone(new Date(event.start)),
        end: formatDateWithoutTimezone(new Date(event.end)),
        screeningId: event.id
    }));
    if (eventData.length > 0) {
        console.log(eventData)
        console.log()
        axiosapi.post('/admin/backstage/screen/calendar', eventData)
            .then(response => {
                console.log('更新成功');
                Swal.fire({
                    title: '更新成功',
                    text: '資料已成功儲存',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            })
            .catch(error => {
                console.error('更新失敗:', error);
                Swal.fire({
                    title: '失敗',
                    text: '更新失敗',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
    } else {
        console.log('沒有修改的事件');
    }
    //處理欲刪除的事件

    if (deleteScreens.value.length > 0) {
        console.log(deleteScreens.value)
        const idsToDelete = deleteScreens.value.map(screen => screen.id);
        axiosapi.delete(`/admin/backstage/screen/calendar?deletelist=${idsToDelete}`)
            .then(response => {
                console.log('刪除成功');
                deleteScreens.value = [];  //清空紀錄
            })
            .catch(error => {
                console.error('刪除失敗:', error);
            });
    } else {
        console.log('沒有需要刪除的場次');
    }
    doclick();
}
//去除時區
function formatDateWithoutTimezone(datestr) {
    let date = new Date(datestr)
    let localYear = date.getFullYear();
    let localMonth = date.getMonth() + 1;
    let localDate = date.getDate();
    let localHours = date.getHours();
    let localMinutes = date.getMinutes();
    let localSeconds = date.getSeconds();
    localMonth = localMonth.toString().padStart(2, '0');
    localDate = localDate.toString().padStart(2, '0');
    localHours = localHours.toString().padStart(2, '0');
    localMinutes = localMinutes.toString().padStart(2, '0');
    localSeconds = localSeconds.toString().padStart(2, '0');
    return `${localYear}-${localMonth}-${localDate} ${localHours}:${localMinutes}:${localSeconds}`;
}
//處理時間範圍date-picker
const formattedDateRange = computed({
    get() {
        return [
            new Date(movieselect.value.releaseDate),
            new Date(movieselect.value.endDate)
        ];
    },
    set(newValue) {
        movieselect.value.releaseDate = newValue[0];
        movieselect.value.endDate = newValue[1];
    }
});
//右鍵點擊事件
function handleRightClick(event, calendarEvent) {
    event.preventDefault();
    const confirmed = confirm(`確定要刪除 ${calendarEvent.title} 嗎?`);
    if (confirmed) {
        deleteScreens.value.push({
            id: calendarEvent.id,
            title: calendarEvent.title,
            start: calendarEvent.startStr,
            end: calendarEvent.endStr
        });
        calendarEvent.remove();
    }
}
function goToDetails(id) {
    console.log(cinema.value[0].cinema_id)
    router.push({
        path: '/screen/resources',
        query: { movie_id: id, cinemaid: cinema.value[0].cinema_id }
    });
}
function submitDates() {
    console.log(auditoriumId)
    const data = {
        "movieId": movieselect.value.id,
        "dailySessions": 5,
        "startDate": formatDate(formattedDateRange.value[0]),
        "endDate": formatDate(formattedDateRange.value[1]),
        "audotoriumId": parseInt(auditoriumId.value),
        "frequency": frequency.value
    }
    console.log(data)
    axiosapi.post("/admin/backstage/screening-batch", data).then(response => {
        Swal.fire({
            title: '場次新增成功!',
            text: '已完成場次新增',
            icon: 'success',
            confirmButtonText: '查看場次'
        }).then(result => {
            if (result.isConfirmed) {
                router.push({
                    path: '/screen/resources',
                    query: { movie_id: movieselect.value.id, cinemaid: cinema.value[0].cinema_id }
                });
            }
        });
    })
        .catch(error => {
            Swal.fire({
                title: `場次新增失敗`,
                text: error.response.data,
                icon: 'error',
                confirmButtonText: '確認'
            })
        });
    doclick()
}

onBeforeMount(function () {
    axiosapi.get("/order/movie/findAllCinema").then(function (response) {
        cinema.value = response.data.allCinemaName;
    }).catch(function (response) {
        console.log(response);
    })
})

</script>

<style scoped>
html,
body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
}

#calendar {
    max-width: 1100px;
    margin: 40px auto;
}


.toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;

}

.el-date-picker {
    max-width: 200px;
}

.frequency-select {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

.save-button {
    width: auto;
    padding: 6px 12px;
}

.fc-event.draggable-event {
    background-color: #f39c12;
    color: white;
    border: 1px solid #e67e22;
    padding: 5px;
    border-radius: 4px;
    cursor: grab;
    font-weight: bold;
}

.fc-event.draggable-event:active {
    cursor: grabbing;
}

#external-events {
    padding: 10px;
    background-color: #2c3e50;
    border: 1px solid #2980b9;
    border-radius: 4px;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    margin-bottom: 20px;
    color: #ecf0f1;
    width: 250px;
    align-items: center;
}
</style>