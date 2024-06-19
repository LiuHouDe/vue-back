import order from "@/components/ordercomponent/order.vue";
import orderDetail from "@/components/ordercomponent/orderDetail.vue";
export default [
    { name: 'order-link', path: '/order', component: order },
    { name: 'orderDetail-link', path: '/orderDetail', component: orderDetail },
]