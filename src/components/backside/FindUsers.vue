<template>
        <div class="">
                <div class="demo-collapse">
                        <el-button type="primary" @click="drawer = true">
                                多條件查詢功能
                        </el-button>
                        <el-drawer v-model="drawer" title="I am the title" :with-header="false"  >
                                <el-form label-width="auto" style="max-width: 600px">
                                        <el-form-item label="id">
                                                <el-input v-model="id" />
                                        </el-form-item>
                                        <el-form-item label="userFirstname">
                                                <el-input v-model="userFirstname" />
                                        </el-form-item>
                                        <el-form-item label="userLastname">
                                                <el-input v-model="userLastname" />
                                        </el-form-item>
                                        <el-form-item label="email">
                                                <el-input v-model="email" />
                                        </el-form-item>
                                        <el-form-item label="phone">
                                                <el-input v-model="phone" />
                                        </el-form-item>
                                        <el-form-item label="registrationDate">
                                                <el-col :span="11">
                                                        <el-date-picker v-model="registrationDateStart" type="date"
                                                                placeholder="Pick a date" style="width: 100%"
                                                                value-format="YYYY-MM-DD" />
                                                </el-col>
                                                <el-col :span="2" class="text-center">
                                                        <span class="text-gray-500">-</span>
                                                </el-col>
                                                <el-col :span="11">
                                                        <el-date-picker v-model="registrationDateEnd" type="date"
                                                                placeholder="Pick a date" style="width: 100%"
                                                                value-format="YYYY-MM-DD" />
                                                </el-col>
                                        </el-form-item>
                                        <el-form-item label="consumption">
                                                <el-col :span="7">
                                                        <el-input-number v-model="consumptionStart" :min="0" />
                                                </el-col>
                                                <el-col :span="2" class="text-center">
                                                        <span class="text-gray-500">~</span>
                                                </el-col>
                                                <el-col :span="7">
                                                        <el-input-number v-model="consumptionEnd"
                                                                :min="consumptionStart" />
                                                </el-col>
                                        </el-form-item>
                                        <el-form-item label="birthMonth">
                                                <el-select v-model="birthMonth" placeholder="請選擇生日月分">
                                                        <el-option :label="n + '月'" :value="n" v-for="n in 12" />
                                                </el-select>
                                        </el-form-item>

                                        <el-form-item label="userlevel">
                                                <el-input-number v-model="userlevel" :min="0" :max="12" />
                                        </el-form-item>

                                        <el-form-item label="gender">
                                                <el-select v-model="gender" placeholder="請選擇性別">
                                                        <el-option label="先生" value="M" />
                                                        <el-option label="女士" value="F" />
                                                </el-select>
                                        </el-form-item>
                                        <el-form-item label="isverified">
                                                <el-select v-model="isverified" placeholder="請選擇是否已驗證">
                                                        <el-option label="已驗證" value="true" />
                                                        <el-option label="未驗證" value="false" />
                                                </el-select>
                                        </el-form-item>
                                        <el-form-item>
                                                <el-button type="primary" @click="findUsers(0)">查詢</el-button>
                                                <el-button @click="cancleInput">清空查詢條件</el-button>
                                        </el-form-item>
                                </el-form>
                        </el-drawer>
                </div>
                <div>
                        <el-scrollbar height="550px">
                                <table class="table table-striped table-hover" >
                                        <thead >
                                                <tr>
                                                        <th scope="col" @click="sortBy('id')">userid</th>
                                                        <th scope="col">firstname</th>
                                                        <th scope="col">lastname</th>
                                                        <th scope="col">email</th>
                                                        <th scope="col">phone</th>
                                                        <th scope="col">userbirthday</th>
                                                        <th scope="col">gender</th>
                                                        <th scope="col"@click="sortBy('consumption')">consumption</th>
                                                        <th scope="col" @click="sortBy('userlevel')">userlevel</th>
                                                        <th scope="col"@click="sortBy('registrationDate')">registrationDate</th>
                                                        <th scope="col">isverified</th>
                                                        <th scope="col">modify</th>
                                                        <th scope="col">deleted</th>
                                                </tr>
                                        </thead>
                                        <tbody>
                                                <tr v-for="user in users" :key="user.id">
                                                        <th scope="row">{{ user.id }}</th>
                                                        <td>{{ user.userFirstname }}</td>
                                                        <td>{{ user.userLastname }}</td>
                                                        <td>{{ user.email }}</td>
                                                        <td>{{ user.phone }}</td>
                                                        <td>{{ user.birth }}</td>
                                                        <td>{{ user.gender == "M" ? "先生" : "女士" }}</td>
                                                        <td>{{ user.consumption }}</td>
                                                        <td>{{ user.userlevel }}</td>
                                                        <td>{{ moment(user.registrationDate).format("YYYY-MM-DD ") }}
                                                        </td>
                                                        <td v-if="user.isverified"><el-tag type="success">已驗證</el-tag>
                                                        </td>
                                                        <td v-else><el-tag type="danger">未驗證</el-tag></td>
                                                        <td><el-button type="warning" round
                                                                        @click="openModal(user.id)">修改</el-button></td>
                                                        <td><el-button type="danger" round
                                                                        @click="callDelect(user.id)">刪除</el-button></td>
                                                </tr>
                                        </tbody>
                                </table>
                        </el-scrollbar>
                                <div v-if="count > 0">
                                        <el-pagination layout="prev, pager, next,sizes " @change="findUsers"
                                                v-model:current-page="current" @size-change="handleSizeChange"
                                                :total="count" />
                                        <span>共有{{ count }}筆資料</span>
                                </div>
                                <span v-if="count === 0">查無資料</span>
                </div>

        </div>




        <UpdateUserModal :users="list" class="userModal" :isdisable="disable" @update:users="updateUserbymodal"
                ref="updateUserModal" @doupdate="updateUserbymodal" @docheckEmail="checkEmail"
                @doCheckPhone="checkPhone"></UpdateUserModal>







</template>

<script setup>
import { onMounted, ref } from 'vue';
import axiosapi from '@/plugins/axiosConfig.js'
import moment from 'moment';
import Swal from 'sweetalert2';
import { ElMessage } from 'element-plus';

import UpdateUserModal from './UpdateUserModal.vue';

const drawer = ref(false)



const users = ref({});
const id = ref(null)
const userFirstname = ref('')
const userLastname = ref('')
const email = ref('')
const phone = ref('')
const registrationDateStart = ref('')
const registrationDateEnd = ref('')
const consumptionStart = ref(0)
const consumptionEnd = ref(0)
const userlevel = ref(0)
const birthMonth = ref(0)
const gender = ref('')
const isverified = ref('')


const disable = ref(false)




const current = ref(1);
const rows = ref(10);
const start = ref(0);
const count = ref(0);


const order =ref("id")
const dir =ref(false)


function sortBy(orderby){
        order.value=orderby
        if(dir.value){
                dir.value=false
        }else{
                dir.value=true
        }
        findUsers()
}




onMounted(() => {
        findUsers();
})


function handleSizeChange(size) {
        rows.value = size
}



function findUsers(page) {

        if (page) {
                start.value = (page - 1) * rows.value;
                current.value = page;
        } else {
                start.value = 0;
                current.value = 1;
        }



        if (id.value === "") {
                id.value = null
        }
        if (consumptionStart.value == 0) {
                consumptionStart.value = null
        }
        if (consumptionEnd.value == 0) {
                consumptionEnd.value = null
        }
        if (userlevel.value == 0) {
                userlevel.value = null
        }
        if (birthMonth.value == 0) {
                birthMonth.value = null
        }

        if (userFirstname.value == '') {
                userFirstname.value = null
        }
        if (userLastname.value == '') {
                userLastname.value = null
        }
        if (email.value == '') {
                email.value = null
        }
        if (phone.value == '') {
                phone.value = null
        }
        if (gender.value == '') {
                gender.value = null
        }
        if (registrationDateStart.value == '') {
                registrationDateStart.value = null
        }

        if (registrationDateEnd.value == '') {
                registrationDateEnd.value = null
        }
        if (isverified.value === '') {
                isverified.value = null
        }




        let param = {
                "id": id.value,
                "userFirstname": userFirstname.value,
                "userLastname": userLastname.value,
                "email": email.value,
                "phone": phone.value,
                "registrationDateStart": registrationDateStart.value,
                "registrationDateEnd": registrationDateEnd.value,
                "consumptionStart": consumptionStart.value,
                "consumptionEnd": consumptionEnd.value,
                "userlevel": userlevel.value,
                "birthMonth": birthMonth.value,
                "gender": gender.value,
                "isverified": isverified.value,

                "start": start.value,
                "rows": rows.value,
                "order": order.value,
                "dir": dir.value
        }

        axiosapi.get('/user/backside/findUsers', { params: param }).then(
                (response) => {
                        users.value = response.data.list;
                        count.value = response.data.count
                }
        ).catch((error) => {
                console.log(error);
        })
        //關抽屜
        drawer.value = false
}


function callDelect(id) {
        Swal.fire({
                title: "確認要刪除?",
                icon: "warning",
                showConfirmButton: true,
                showDenyButton: true,
                confirmButtonText: "確認刪除",
                denyButtonText: `取消`
        }).then((result) => {
                if (result.isConfirmed) {
                        axiosapi.delete(`/user/backside/delect-user/${id}`).then((response) => {
                                findUsers(current.value)
                                ElMessage({
                                        type: 'success',
                                        message: "刪除成功",
                                })
                        }).catch((error) => {
                                ElMessage({
                                        type: 'fasle',
                                        message: "刪除失敗",
                                })
                        })
                }
        })

}






function cancleInput() {

        id.value = null
        userFirstname.value = null
        userLastname.value = null
        email.value = null
        phone.value = null
        registrationDateStart.value = ''
        registrationDateEnd.value = ''
        consumptionStart.value = null
        consumptionEnd.value = null
        userlevel.value = null
        birthMonth.value = null
        gender.value = null
        isverified.value = null
        findUsers();
}





const list = ref({});

const updateUserModal = ref(null)

function openModal(id) {
        findUserById(id)
        disable.value = false
        updateUserModal.value.showModal()
}

function findUserById(id) {
        axiosapi.get(`/user/backside/find-user/${id}`).then((response) => {
                list.value = response.data;
                list.value.registrationDate = moment(list.value.registrationDate).format('YYYY-MM-DD')

        }).catch((error) => {
                console.log(error);
        })
}







function updateUserbymodal(user) {
        console.log(user)
        let data = {
                "userFirstname": user.userFirstname,
                "userLastname": user.userLastname,
                "phone": user.phone,
                "birth": user.birth,
                "email": user.email,
                "gender": user.gender,
                "userlevel": user.userlevel,
                "consumption": user.consumption,
                "isverified": user.isverified,
                "registrationDate": user.registrationDate
        }
        console.log(data)

        axiosapi.put(`/user/backside/update-user/${user.id}`, data).then((response) => {
                if (response.status === 200) {
                        ElMessage({
                                type: 'success',
                                message: "修改成功",
                        })
                        updateUserModal.value.hideModal()
                        findUsers(current.value)
                }
        }).catch((error) => {
                console.log(error);
        })
}




function checkEmail(email) {
        disable.value = true;
        let pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!pattern.test(email)) {
                ElMessage({
                        type: 'error',
                        message: "Email格式不符合"
                })
                return;
        }
        axiosapi.get('/user/pass/check/email', { params: { "email": email } }).then((response) => {
                if (response.data.success) {
                        disable.value = false;
                } else {
                        ElMessage({
                                type: 'error',
                                message: response.data.message
                        })
                }
        }).catch((error) => {
                console.log(error);
        })

}
function checkPhone(phone) {
        disable.value = true;
        let pattern = /^[0-9]{10}$/;
        if (!pattern.test(phone)) {
                ElMessage({
                        type: 'error',
                        message: "手機號不合規"
                })
                return
        }
        disable.value = false;
}







</script>

<style scoped>
.userModal {
        background-color: unset;
}
</style>
