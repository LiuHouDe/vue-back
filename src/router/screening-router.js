import ScreenCalendar from '@/components/screeningcomponent/screeningcalendar.vue'
import ScreenResource from '@/components/screeningcomponent/screenDayResource.vue'
export default [
    { name: 'screen-calendar-link', path: '/screen/calendar', component: ScreenCalendar},
    { name: 'screen-resource-link', path: '/screen/resources' , component: ScreenResource},
]