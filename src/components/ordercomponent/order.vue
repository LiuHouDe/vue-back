<template>
    <div class="div1">
        <div class="demo-collapse">
            <el-button type="primary" @click="drawer = true">
                多條件查詢功能
            </el-button>
            <el-drawer v-model="drawer" title="I am the title" :with-header="false"
                style="height:300px; width: 600px; margin:0 auto; margin-top:50px;" direction="ttb">
                <el-form label-width="auto" style="max-width: 600px; margin: 0 auto;">
                    <el-form-item label="帳號">
                        <el-input v-model=paramenters.email />
                    </el-form-item>
                    <el-form-item label="付款方式">
                        <el-select v-model=paramenters.supplier placeholder="選擇付款方式">
                            <el-option label="linepay" value="linepay" />
                            <el-option label="ecpay" value="ecpay" />
                            <el-option label="paypal" value="paypal" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="創建日期">
                        <el-col :span="11">
                            <el-date-picker v-model=paramenters.dateStart type="date" placeholder="Pick a date"
                                style="width: 100%" value-format="YYYY-MM-DD" />
                        </el-col>
                        <el-col :span="2" class="text-center">
                            <span class="text-gray-500">-</span>
                        </el-col>
                        <el-col :span="11">
                            <el-date-picker v-model=paramenters.dateEnd type="date" placeholder="Pick a date"
                                style="width: 100%" value-format="YYYY-MM-DD" />
                        </el-col>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click=multiConditionFindOrder>查詢</el-button>
                        <el-button @click="cleanInput">清空查詢條件</el-button>
                    </el-form-item>
                </el-form>
            </el-drawer>
        </div>
        <div class="div2">
            <h2>訂單總覽</h2>
        </div>
        <table width="1050px">
            <tr>
                <th>排序號碼</th>
                <th>訂單編號</th>
                <th>帳號</th>
                <th>電影</th>
                <th>訂單總金額</th>
                <th>付款方式</th>
                <th>訂單創建日期</th>
                <th>訂單明細</th>
                <th>操作</th>
            </tr>
            <tr v-for="item in orders">
                <td>{{ item.no }}</td>
                <td>{{ item.order_id }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.order_amount }}</td>
                <td>{{ item.supplier }}</td>
                <td>{{ item.create_date }}</td>
                <td><button :value="item.order_id" @click="detail">詳情</button></td>
                <td v-if="item.order_status"><button :value="item.order_id" @click="refund">退款</button></td>
                <td v-else>已退款</td>
            </tr>
        </table>
        <div class="div3"><v-pagination class="page" v-model=" paramenters.page" :pages="pages" :range-size="1"
                active-color="#DCEDFF" @update:modelValue="updateHandler" /></div>
         </div>
</template>

<script setup>
import axiosApi from '@/plugins/axiosConfig.js';
import { ref, onBeforeMount, watch } from "vue"
import { useRouter,useRoute } from 'vue-router'
import Swal from 'sweetalert2'
const drawer = ref(false);
const conditionFindFlag = ref(false);
const router = useRouter();
let route = useRoute();
// let userId=sessionStorage.getItem("id"); //測試固定
const page = ref(1); //預設
if(route.query.previousFlag == 'true'){
    page.value=route.query.page;
}
let orders = ref('');
let pages = ref();
//page.value//
const paramenters = ref({ "email": '', "supplier": '', "dateStart": '', "dateEnd": '', "page": 1  });

watch(paramenters.value, (oldValue, newValue) => {
    if ((oldValue.dateStart != null || oldValue.dateStart != '') && newValue.dateStart == null) {
        paramenters.value.dateStart = '';
        paramenters.value.dateEnd = '';
        return;
    }
    if (new Date(paramenters.value.dateStart).getTime() > new Date(paramenters.value.dateEnd).getTime() && newValue.dateEnd != null) {
        paramenters.value.dateEnd = paramenters.value.dateStart;
        return;
    }
    if (newValue.dateStart == null || newValue.dateStart == '') {
        paramenters.value.dateStart = newValue.dateEnd;
    }
});

function getOrder() {
    axiosApi.get("/order/movie/getOrderBackStage?page=" + paramenters.value.page).then(function (response) {
        orders.value = response.data.orders;
        pages.value = response.data.pages;
    }).catch(function (response) {
        console.log(response);
    });
}

function getOrderCondition() {
    axiosApi.post("/order/movie/getOrderCondition", paramenters.value).then(function (response) {
        orders.value = response.data.orders;
        pages.value = response.data.pages;
    })
}

onBeforeMount(function () {
    if(route.query.previousFlag == 'true'){
         paramenters.value.email=route.query.email;
         paramenters.value.supplier=route.query.supplier;
         paramenters.value.dateStart=route.query.dateStart;
         paramenters.value.dateEnd=route.query.dateEnd;
         paramenters.value.page=parseInt(route.query.page); 
         conditionFindFlag.value=route.query.conditionFindFlag;
    }
    console.log(paramenters);
    if (conditionFindFlag.value == false) {
        getOrder();
    }else{
        getOrderCondition();
    }
});

function detail(event) {
    //"email": '', "supplier": '', "dateStart": '', "dateEnd": '', "page"
    router.push({ path: "/orderDetail", query: { orderId: event.target.value,email:paramenters.value.email,supplier:paramenters.value.supplier,dateStart: paramenters.value.dateStart,
                                                 dateEnd:paramenters.value.dateEnd,page:paramenters.value.page,conditionFindFlag:conditionFindFlag.value} });
};

import VPagination from "@hennge/vue3-pagination";
import "@hennge/vue3-pagination/dist/vue3-pagination.css";

function updateHandler() {
    // paramenters.value.page = page.value;
    if (conditionFindFlag.value == false) {
        axiosApi.get("/order/movie/getOrderBackStage?page=" + paramenters.value.page).then(function (response) {
            orders.value = response.data.orders;
        }).catch(function (response) {
            console.log(response);
        });
    } else {
        // paramenters.value.page = page.value;
        axiosApi.post("/order/movie/getOrderCondition", paramenters.value).then(function (response) {
            orders.value = response.data.orders;
        })
    }
}

function refund(event) {
    Swal.fire({ position: "top", title: "退款處理中！", allowOutsideClick: false, showConfirmButton: false });
    axiosApi.get("/order/movie/deleteOrder?orderId=" + event.target.value).then(function (response) {
        if (response.data.success == true) {
            Swal.close();
            Swal.fire({
                position: "top",
                icon: "success",
                title: "退款成功！",
                confirmButtonText: "確認！",
                allowOutsideClick: false,
            }).then((result) => {
                if (result.isConfirmed) {
                    router.go(0);
                }
            })
        }
    }).catch(function (response) {
        console.log(response);
    });
}

function multiConditionFindOrder() {
    paramenters.value.page = 1;
    conditionFindFlag.value = true;
    getOrderCondition();
    drawer.value = false;
}

function cleanInput() {
    paramenters.value.email = '';
    paramenters.value.supplier = '';
    paramenters.value.dateStart = '';
    paramenters.value.dateEnd = '';
    paramenters.value.page = 1;
    conditionFindFlag.value = false;
    page.value = 1;
    drawer.value = false;
    getOrder();
}

</script>

<style scoped>
td {
    padding: 5px;
}

table {
    /* margin: 0 auto; */
    margin-top: 10px;
}

table,
th,
td {
    border: 1px solid black;
    text-align: center;
}

.div1 {
    width: 1050px;
    height: 525px;
    margin: 0 auto;
    margin-top: 10px;
}

.div2 {
    margin: 0 auto;
    text-align: center;
}

h2 {
    font-size: 30px;
    font-weight: bold;
}

.div3 {
    width: 900px;
    height: 300px;
    margin: 0 auto;
    margin-top: 5px;
}

ul,
li {
    list-style: none;
    padding: 0;
}

ul {
    display: flex;
    justify-content: center;
}

.el-select-dropdown__item {
    padding: 0 32px 0 20px;
}
</style>