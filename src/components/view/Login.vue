<template>
    <div class="login-container">
        <el-card class="box-card">
            <h2>登入</h2>
            <el-form @submit.prevent="handleLogin" label-position="top" class="login-form">
                <el-form-item label="用戶名" :error="usernameError">
                    <el-input type="text" v-model="username" required />
                </el-form-item>
                <el-form-item label="密碼" :error="passwordError">
                    <el-input type="password" v-model="password" required />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin">登入</el-button>
                </el-form-item>
            </el-form>
            <p v-if="error" class="error">{{ error }}</p>
        </el-card>
    </div>
</template>

<script>
import { ref, inject } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import axiosApi from '@/plugins/axiosConfig.js'

export default {
    setup() {
        const username = ref('');
        const password = ref('');
        const error = ref(null);
        const usernameError = ref('');
        const passwordError = ref('');
        const router = useRouter();
        const relode = inject('relode');

        const validate = () => {
            let isValid = true;
            if (!username.value) {
                usernameError.value = '用戶名是必填項';
                isValid = false;
            } else {
                usernameError.value = '';
            }
            if (!password.value) {
                passwordError.value = '密碼是必填項';
                isValid = false;
            } else {
                passwordError.value = '';
            }
            return isValid;
        };

        const handleLogin = async () => {
            if (!validate()) return;
            try {
                const response = await axiosApi.post('/api/login', {
                    username: username.value,
                    password: password.value
                });

                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                    relode();
                    router.push('/'); // 登入成功後跳轉到首頁
                } else {
                    error.value = '登入失敗';
                }
            } catch (err) {
                error.value = '發生錯誤，請重試';
            }
        };
        return {
            username,
            password,
            error,
            usernameError,
            passwordError,
            handleLogin,
        };
    }
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    height: 100vh;
    background: #f5f5f5;
    padding-top: 100px;
}

.box-card {
    width: 400px;
    padding: 20px;
}

.login-form {
    width: 100%;
}

.error {
    color: red;
    margin-top: 10px;
}
</style>
