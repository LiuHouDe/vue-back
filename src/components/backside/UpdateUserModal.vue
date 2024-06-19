<template>
    <!-- Modal -->
    <div class="modal fade " id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"
        ref="exampleModalRef">
        <div class="modal-dialog">
            <div class="modal-content panding">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">修改會員資料</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>


                <el-form-item label="userFirstname">
                    <el-input v-model="users.userFirstname" maxlength="10" />
                </el-form-item>
                <el-form-item label="userLastname">
                    <el-input v-model="users.userLastname" maxlength="10" />
                </el-form-item>

                <el-form-item label="email">
                    <el-input v-model="users.email" @change="docheckEmail"/>
                </el-form-item>


                <el-form-item label="phone">
                    <el-input v-model="users.phone" maxlength="10"  @change="doCheckPhone"/>
                </el-form-item>

                <el-form-item label="birth">
                    <el-col :span="11">
                        <el-date-picker v-model="users.birth" type="date" placeholder="Pick a date" style="width: 100%"
                            value-format="YYYY-MM-DD" :disabled-date="disabledDate" />
                    </el-col>
                </el-form-item>

                <el-form-item label="gender">
                    <el-select v-model="users.gender" placeholder="請選擇性別">
                        <el-option label="先生" value="M" />
                        <el-option label="女士" value="F" />
                    </el-select>
                </el-form-item>

                <el-form-item label="userlevel">
                    <el-input-number v-model="users.userlevel" :min="0" :max="12" />
                </el-form-item>

                <el-form-item label="consumption">
                    <el-col :span="7">
                        <el-input-number v-model="users.consumption" :min="0" />
                    </el-col>
                </el-form-item>

                <el-form-item label="registrationDate">
                    <el-col :span="11">
                        <el-date-picker v-model="users.registrationDate" type="date" placeholder="Pick a date"
                            style="width: 100%" value-format="YYYY-MM-DD"  :disabled-date="disabledDate"/>
                    </el-col>
                </el-form-item>

                <el-form-item label="isverified">
                    <el-select v-model="users.isverified" placeholder="請選擇是否已驗證">
                        <el-option label="已驗證" :value=true />
                        <el-option label="未驗證" :value=false />
                    </el-select>
                </el-form-item>


                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="doupdate" :disabled="isdisable"  >確認修改</button>
                </div>
            </div>
        </div>
    </div>




</template>

<script setup>
import { ref, onMounted} from 'vue';
import bootstrapBundle from 'bootstrap/dist/js/bootstrap.bundle.min.js';



const props = defineProps(['users','isdisable'])
const emits = defineEmits(['update:users','isdisable','docheckEmail', 'doCheckPhone'])

const disabledDate =(time)=>{
    return time.getTime() > Date.now();
}

function doupdate() {
    emits('update:users', props.users);
}

function docheckEmail(){
    emits('docheckEmail', props.users.email)
}
function doCheckPhone(){
    emits('doCheckPhone', props.users.phone)
}



const exampleModalRef = ref(null);
const exampleModalObj = ref(null);
onMounted(function () {
    exampleModalObj.value = new bootstrapBundle.Modal(exampleModalRef.value);
});

function showModal() {
    exampleModalObj.value.show();
}
function hideModal() {
    exampleModalObj.value.hide();
}
defineExpose({
    showModal, hideModal
});














</script>

<style scoped>
.modal {
    z-index: 1055;
}

.panding {
    padding: 10px;
}
</style>