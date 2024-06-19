<template>
    <div class="div1 container">
    <div class="div2">
        <h2>訂單明細</h2>
    </div>
    
<table>
    <tr>
    <th>編號</th>
    <th>區域</th>
    <th>電影</th>
    <th>開始時間</th>
    <th>座位</th>
    <th>訂單創建日期</th>
    </tr>
    <tr v-for="item in orderDetails">
        <td>{{item.no}}</td>
        <td>{{item.location}}</td>
        <td>{{item.movie_name}}</td>
        <td>{{item.Start_time}}</td>
        <td>{{item.seat}}</td>
        <td>{{item.create_date}}</td>
    </tr>
</table>
<a href="javascript: void(0)" class="btn" @click="previous">回上一頁</a>
</div>
</template>

<script setup>
import { useRoute,useRouter } from 'vue-router';
import axiosApi from '@/plugins/axiosConfig.js';
const route=useRoute();
const router=useRouter()
import { ref } from 'vue';
const paramenters = ref({ "email":route.query.email, "supplier": route.query.supplier,"dateStart": route.query.dateStart,"dateEnd":route.query.dateEnd,"page": route.query.page,"conditionFindFlag":route.query.conditionFindFlag});
const orderId=route.query.orderId;
const orderDetails=ref('');
console.log(paramenters.value);//
axiosApi.get("/order/movie/getOrderDetail?orderId="+orderId).then(function(response){
console.log(response);//
orderDetails.value=response.data.details;
console.log(orderDetails);//
}).catch(function(response){
console.log(response);
});

function previous(){
// window.history.go(-1);
// router.go(-1);
router.push({ path: "/order", query: {email:paramenters.value.email,supplier:paramenters.value.supplier,dateStart: paramenters.value.dateStart,
                                      dateEnd:paramenters.value.dateEnd,page:paramenters.value.page,conditionFindFlag:paramenters.value.conditionFindFlag,previousFlag:true}});
}

</script>

<style scoped>
td{
padding: 5px;
}
table{
margin:0 auto;
margin-top: 50px;    
}
table,th,td {
border: 1px solid black;
text-align: center; 
}
.div1{
width: 900px;
height: 450px;
margin:0 auto;
margin-top: 100px;
text-align: center;
}
.div2{
margin:0 auto;
}
h2{
font-size:30px;
font-weight:bold;
}
.button1{
margin-top: 20px;
}
.btn,
.btn:focus {
position: relative;
z-index: 1;
/* min-width: 200px; */
height: 40px;
border: 2px solid #D24D57;
background: #D24D57  ;
border-radius: 0;
color: #FFFFFF;
font-size: 1rem;
font-weight: bold;
text-align: center;
text-decoration: none;
text-transform: uppercase;
overflow: hidden;
text-shadow: 0 0 1px rgba(0, 0, 0, 0.2), 0 1px 0 rgba(0, 0, 0, 0.2);
-webkit-transition: all 1s ease;
-moz-transition: all 1s ease;
-o-transition: all 1s ease;
transition: all 1s ease;
margin-top: 30px;
border-radius: 10px 10px 10px 10px;
/* padding: 10px 20px; */
}
.btn:after {
content: "";
position: absolute;
height: 0%;
left: 50%;
top: 50%;
width: 150%;
z-index: -1;
background: #D24D57;
-moz-transform: translateX(-50%) translateY(-50%) rotate(-25deg);
-ms-transform: translateX(-50%) translateY(-50%) rotate(-25deg);
-webkit-transform: translateX(-50%) translateY(-50%) rotate(-25deg);
transform: translateX(-50%) translateY(-50%) rotate(-25deg);
-webkit-transition: all 0.75s ease 0s;
-moz-transition: all 0.75s ease 0s;
-o-transition: all 0.75s ease 0s;
transition: all 0.75s ease 0s;
}
.btn:hover {
color: #272323;
text-shadow: none;
}
.btn:hover:after {
height: 450%;
}
</style>