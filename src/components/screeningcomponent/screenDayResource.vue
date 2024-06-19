<template>
    <h3>影廳場次檢視</h3>
    <br><br>
    <div class="row">
        <div class="col-3">
            <ScreenMenuCinema :cinema="cinema" :movies="movies" :movieDate="movieDate" :movieTime="movieTime"
                :auditoriums="auditoriums" :movieShowtimes="movieShowtimes" @cinema-change="dochange1"
                @search-screening="loadScreenById(cinema)">
            </ScreenMenuCinema>

        </div>
        <div class="col-3">
            <MovieDropdown @update="handleUpdate"></MovieDropdown>
        </div>
    </div>
    <div>
        <div id="external-events"></div>
        <FullCalendar :options="calendarOptions" ref="calendarRef" />
        <button @click="saveChanges">保存變更</button>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import axiosapi from '@/plugins/axiosConfig';
import ScreenMenuCinema from './screenMenuOnlyCinema.vue';
import MovieDropdown from './DropdownWithInput.vue'
import Swal from 'sweetalert2';
const route = useRoute();
const cinema = ref('');
const movies = ref('');
const movieDate = ref('');
const movieTime = ref('');
const screeningId = ref('');
const screenings = ref([]);
const auditoriumId = ref('');
const auditoriums = ref([]);
const movieShowtimes = ref('');
const movieselect = ref({});
const calendarRef = ref(null);
const deleteScreens = ref([]);
const selectedOption = ref('')
const selectcinema = ref('')
let draggableInstance = null;
const calendarOptions = ref({
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin],
    initialView: 'resourceTimelineDay',
    slotMinTime: '09:00:00',
    slotMaxTime: '25:00:00',
    editable: true,
    droppable: true,
    events: screenings.value,
    resources: [],
    eventReceive: handleEventReceive,
    eventChange: handleEventChange,
    eventDrop: handleEventDrop,
    eventOverlap: false,
    allDaySlot: false,
    schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
    resourceAreaHeaderContent: 'Auditorium',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay,resourceTimelineWeek,resourceTimelineMonth,timeGridWeek',
    },
    eventDidMount: (info) => {
        info.el.oncontextmenu = (e) => handleRightClick(e, info.event);
    },
    height: 'auto',
    contentHeight: 'auto',
});
watch(auditoriums, (newAuditoriums) => {
    const height = newAuditoriums.length * 50;
    calendarOptions.value.height = height > 400 ? height : 400; //最小高度
});

// 獲得電影事件
function fetchMovieEvents() {
    axiosapi.get(`/backstage/movie/${route.query.movie_id}`).then((response) => {
        const container = document.getElementById('external-events');
        movieselect.value = response.data.list[0];
        container.innerHTML = '';
        response.data.list.forEach(movie => {
            const eventEl = document.createElement('div');
            eventEl.className = 'fc-event';
            eventEl.innerText = `${movie.name} ${movie.duration}`;
            eventEl.style.width = calculateWidthFromDuration(movie.duration);
            eventEl.dataset.id = movie.id;
            eventEl.dataset.duration = movie.duration;
            eventEl.dataset.movieId = movie.id;
            container.appendChild(eventEl);
        });
        draggableInstance =new Draggable(container, {
            itemSelector: '.fc-event',
            eventData: function (eventEl) {
                return {
                    title: eventEl.innerText,
                    duration: eventEl.dataset.duration,
                    id: 0,
                    isModified: true,
                    movieid: movieselect.value.id,
                    markedForDeletion: false
                };
            }
        });
    });
} function fetchMovieEventsFromOption(option) {
    console.log(option);
    axiosapi.get(`/backstage/movie/${option.value.id}`).then((response) => {
        const container = document.getElementById('external-events');
        movieselect.value = response.data.list[0];
        container.innerHTML = '';
        if (draggableInstance) {
            draggableInstance.destroy();
            draggableInstance = null;
        }
        response.data.list.forEach(movie => {
            const eventEl = document.createElement('div');
            eventEl.className = 'fc-event draggable-event';
            eventEl.innerText = `${movie.name} ${movie.duration}`;
            eventEl.style.width = calculateWidthFromDuration(movie.duration);
            eventEl.dataset.id = movie.id;
            eventEl.dataset.duration = movie.duration;
            eventEl.dataset.movieId = movie.id;
            container.appendChild(eventEl);
        });

        draggableInstance = new Draggable(container, {
            itemSelector: '.fc-event',
            eventData: function (eventEl) {
                return {
                    title: eventEl.innerText,
                    duration: eventEl.dataset.duration,
                    id: 0,
                    isModified: true,
                    movieid: movieselect.value.id,
                    markedForDeletion: false
                };
            }
        });
    });
}
const handleUpdate = (newOption) => {
    selectedOption.value = newOption;
    fetchMovieEventsFromOption(selectedOption);
};

function calculateWidthFromDuration(duration) {
    const baseWidth = 100;
    const widthPerMinute = 4;
    return `${baseWidth + duration * widthPerMinute}px`;
}

function handleEventReceive(info) {
    const duration = parseInt(info.draggedEl.dataset.duration, 10);
    const endTime = new Date(info.event.start.getTime() + duration * 60000);
    info.event.setEnd(endTime);
    const auditoriumId = info.event.getResources() ? info.event.getResources()[0].id : null;
    info.event.setExtendedProp('auditoriumId', parseInt(auditoriumId));
    info.event.setExtendedProp('isModified', true);
    console.log(`Event ${info.event.title} added to auditorium: ${auditoriumId}`);
    console.log(`Event ${info.event.title} marked as modified.`);
    console.log('Event received:', info.event.title);
    console.log('Start:', info.event.start.toISOString());
    console.log('End:', info.event.end.toISOString());
    console.log(info.event);
}

function handleEventDrop(info) {
    console.log("info", info)
    const newAuditoriumId = info.newResource ? info.newResource.id : null;
    const eventApi = info.event;
    if (newAuditoriumId != null) {
        info.event.setExtendedProp('auditoriumId', newAuditoriumId);
        console.log(`Event ${info.event.title} moved to new auditorium: ${newAuditoriumId}`);
    }
    eventApi.setExtendedProp('isModified', true);

}

function handleEventChange(info) { }

function dochange1(event) {
    if (event == "default_1") {
        movies.value = '';
        movieDate.value = '';
        movieTime.value = '';
        screeningId.value = '';
        return;
    }
    console.log("test", event);
    selectcinema.value = event;
    axiosapi.get(`/backstage/auditorium?cinemaId=${event}`).then((response) => {
        console.log(response);
        movies.value = response.data.movies;
        auditoriums.value = response.data.list;
        calendarOptions.value.resources = auditoriums.value;
    }).catch((error) => {
        console.log(error);
    });
}

function dochange2(event) {
    if (event == "default_2") {
        movieDate.value = '';
        movieTime.value = '';
        auditoriumId.value = '';
        return;
    }
    auditoriumId.value = event;
}

function loadScreen() {
    console.log("test");
    axiosapi.get(`/backstage/screeningbyc?cinemaId=${route.query.cinemaid}`)
        .then((response) => {
            screenings.value = response.data.list;
            console.log(screenings.value)
            addEventToCalendar();
        }).catch((error) => {
            console.log(error);
        });
}
function loadScreenById(cinema) {
    console.log(cinema, "CINEMA");
    console.log(selectcinema.value, "TEST")
    fetchAuditoriumsId(cinema[selectcinema.value - 1].cinema_id)
    axiosapi.get(`/backstage/screeningbyc?cinemaId=${cinema[selectcinema.value - 1].cinema_id}`)
        .then((response) => {
            screenings.value = response.data.list;
            console.log(screenings.value)
            addEventToCalendar();
        }).catch((error) => {
            console.log(error);
        });
}

function addEventToCalendar() {
    console.log("ADDD")
    console.log(screenings, "SCREENING")
    const events = screenings.value.map(screening => ({
        title: `${screening.name} `,
        start: screening.Start_time,
        end: screening.End_time,
        id: screening.Screening_id,
        movieid: screening.Movie_id,
        auditoriumId: screening.auditorium_id,
        isModified: false,
        markedForDeletion: false,
        resourceId: screening.auditorium_id,
    }));
    calendarOptions.value.events = events; // 更新 FullCalendar 的事件
}

function saveChanges() {
    const modifiedEvents = calendarRef.value.getApi().getEvents().filter(event => event.extendedProps.isModified);
    const eventData = modifiedEvents.map(event => ({
        movieid: event.extendedProps.movieid,
        auditoriumId: event.extendedProps.auditoriumId,
        start: formatDateWithoutTimezone(new Date(event.start)),
        end: formatDateWithoutTimezone(new Date(event.end)),
        screeningId: event.id
    }));
    const promises = [];
    if (eventData.length > 0) {
        console.log("修改中")
        console.log(eventData)
        const updatePromise = axiosapi.post('/admin/backstage/screen/calendar', eventData)
            .then((response) => {
                console.log('更新成功');
                if (response.data.success) {
                    Swal.fire({
                        title: '成功!',
                        text: '場次變更已儲存',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                }
                else {
                    Swal.fire({
                        title: 'Error!',
                        text: response.data ? response.data.message : '新增場次時發生錯誤.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                }

            })
            .catch((error) => {
                console.error('更新失敗:', error);
                Swal.fire({
                    title: 'Error!',
                    text: error.response.data ? error.response.data.message : '場次發生錯誤 請確認時間地點是否正確',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            });
        promises.push(updatePromise);
    } else {
        console.log('沒有修改的事件');
    }
    if (deleteScreens.value.length > 0) {
        const idsToDelete = deleteScreens.value.map(screen => screen.id);
        const deletePromise = axiosapi.delete(`/admin/backstage/screen/calendar?deletelist=${idsToDelete}`)
            .then((response) => {
                console.log('刪除成功');
                deleteScreens.value = [];
            })
            .catch((error) => {
                console.error('刪除失敗:', error);
            });
        promises.push(deletePromise);
    } else {
        console.log('沒有需要刪除的場次');
    }
    Promise.all(promises).then(()=> {
        console.log(cinema.value[selectcinema.value],"TTT")
        loadScreenById(cinema.value)
    }).catch(error =>{
        console.error('操作失敗:', error);
    })
    
}

function formatDateWithoutTimezone(datestr) {
    const date = new Date(datestr);
    const localYear = date.getFullYear();
    const localMonth = (date.getMonth() + 1).toString().padStart(2, '0');
    const localDate = date.getDate().toString().padStart(2, '0');
    const localHours = date.getHours().toString().padStart(2, '0');
    const localMinutes = date.getMinutes().toString().padStart(2, '0');
    const localSeconds = date.getSeconds().toString().padStart(2, '0');
    return `${localYear}-${localMonth}-${localDate} ${localHours}:${localMinutes}:${localSeconds}`;
}

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
function fetchAuditoriums() {
    axiosapi.get(`/backstage/auditorium?cinemaId=${route.query.cinemaid}`).then((response) => {
        console.log(response);
        auditoriums.value = response.data.list.map(auditorium => ({
            id: auditorium.auditorium_id,
            title: auditorium.auditorium_number
        }));
        calendarOptions.value.resources = auditoriums.value;
        console.log(auditoriums, "AAA")
    }).catch((error) => {
        console.log(error);
    });
}
function fetchAuditoriumsId(id) {
    axiosapi.get(`/backstage/auditorium?cinemaId=${id}`).then((response) => {
        console.log(response);
        auditoriums.value = response.data.list.map(auditorium => ({
            id: auditorium.auditorium_id,
            title: auditorium.auditorium_number
        }));
        calendarOptions.value.resources = auditoriums.value;
        console.log(auditoriums, "AAA")
    }).catch((error) => {
        console.log(error);
    });
}
onBeforeMount(function () {
    axiosapi.get("/order/movie/findAllCinema").then(function (response) {
        cinema.value = response.data.allCinemaName;
    }).catch(function (response) {
        console.log(response);
    })
})
onMounted(() => {

    if (route.query.movie_id) {
        fetchMovieEvents();
    }
    if (route.query.cinemaid) {
        fetchAuditoriums();
        loadScreen();
    }

});

</script>

<style scoped>
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

.fc-daygrid-event.fc-event--all-day {
    display: none;
}

.schedule-container {
    padding: 20px;
}

.calendar-container {
    margin-top: 20px;
}
</style>
