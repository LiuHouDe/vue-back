import axios from "axios";
import router from '@/router/router.js';
import Swal from 'sweetalert2'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_END_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        console.log("驗證失敗")
        localStorage.removeItem('token');
        router.push({ name: 'Login' });
    }
    if (error.response.data.status == 901) {
        Swal.close();
        Swal.fire({
          position: "top",
          title: error.response.data.message,
          icon: "error",
          confirmButtonText: "確認！",
          allowOutsideClick: false
        }).then((result) => {
          if (result.isConfirmed) {
            router.push({ name: "order-findOrder" });
          }
        });
      }
    return Promise.reject(error);
});
export default axiosInstance