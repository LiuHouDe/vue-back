<template>
    <div ref="exampleModalref" class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="app">
                        <table>
                            <tr>
                                <td>電影名 : </td>
                                <td><input type="text" name="name" :value="name"
                                        @input=" $emit('update:name', $event.target.value)"></td>
                            </tr>
                            <tr>
                                <td>電影名(英文) : </td>
                                <td><input type="text" name="name_eng" :value="name_eng"
                                        @input=" $emit('update:name_eng', $event.target.value)"></td>
                            </tr>
                            <tr>
                                <td>導演 : </td>
                                <td><input type="text" name="director" :value="director"
                                        @input=" $emit('update:director', $event.target.value)"></td>
                            </tr>

                            <tr>
                                <td>簡介 : </td>
                                <td><input type="text" name="description" :value="description"
                                        @input=" $emit('update:description', $event.target.value)"></td>
                            </tr>
                            <tr>
                                <td>電影時長(分) : </td>
                                <td><input type="text" name="duration" :value="duration"
                                        @input=" $emit('update:duration', $event.target.value)"></td>
                            </tr>
                            <tr>
                                <td>上映時間 : </td>
                                <td>
                                    <el-date-picker name="releaseDate" :value="releaseDate" v-model="date1" type="date"
                                        placeholder="Pick a day" :size="size" format="YYYY-MM-DD"
                                        default-value:releaseDate
                                        @change=" dateChange('release', $event)"></el-date-picker>
                                </td>
                            </tr>
                            <tr>
                                <td>下檔時間 : </td>
                                <td>
                                    <el-date-picker name="endDate" :value="endDate" v-model="date2" type="date"
                                        placeholder="Pick a day" :size="size" format="YYYY-MM-DD" default-value:endDate
                                        @change=" dateChange('end', $event)"></el-date-picker>
                                </td>
                            </tr>
                            <tr>
                                <td>價格 : </td>
                                <td><input type="text" name="price" :value="price"
                                        @input=" $emit('update:price', $event.target.value)"></td>
                            </tr>
                            <tr>
                                <td>分類 : </td>
                                <el-select name="category" :value="category" v-model="categories"
                                    @change="updateCategory($event)" multiple collapse-tags collapse-tags-tooltip
                                    :max-collapse-tags="3" placeholder="Select" style="width: 240px">
                                    <el-option v-for="option in optionCategory" :key="option.id" :value="option.code"
                                        :label="option.categoryContent">
                                        {{ option.categoryContent }}
                                    </el-option>
                                </el-select>
                            </tr>
                            <tr>
                                <td>分級 : </td>
                                <select name="rated" :value="rated"
                                    @change="$emit('update:rated', $event.target.value)">
                                    <option disabled value="">Please select one</option>
                                    <option v-for="option in optionsRated" :key="option.id" :value="option.code">
                                        {{ option.context }}
                                    </option>
                                </select>
                            </tr>
                            <tr>
                                <td>圖片預覽：</td>
                                <td>
                                    <img v-if="imageUrl" :src="imageUrl" class="card-img-top upload-preview" :alt="name"
                                        height="100px">
                                    <input type="file" @change="handleFileChange" id="file-input" accept="image/*"
                                        class="file-input" style="display: none;">
                                    <label for="file-input" class="file-label">選擇圖片</label>
                                </td>
                            </tr>
                        </table>
                        <div>
                            <el-row :gutter="20">
                                <el-col v-for="(pic, index) in moviePics" :key="pic.id" :span="6">
                                    <div class="image-container">
                                        <el-image :src="getPictureUrl(pic.pictureData)" class="image-item"></el-image>
                                        <el-button type="danger" :icon="Delete" circle
                                            @click="markForDeletion(index)" />
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                        <el-upload class="upload-demo" action="" list-type="picture-card" :auto-upload="false"
                            :on-change="handleUploadChange" v-model:file-list="fileList">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" v-show="isShowButtonInsert" class="btn btn-primary"
                        @click="insert">新增</button>
                    <button type="button" v-show="!isShowButtonInsert" class="btn btn-primary"
                        @click="update">修改</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'
import axiosapi from '@/plugins/axiosConfig.js'
import qs from 'qs';
import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from '@element-plus/icons-vue'
const props = defineProps(["isShowButtonInsert", 'id', 'name',
    'director', 'releaseDate', 'endDate',
    'price', 'categories', 'rated', 'name_eng', 'duration',
    'description'
])
const { releaseDate, endDate } = props


const emits = defineEmits([
    'update:name',
    'update:director',
    'update:releaseDate',
    'update:endDate',
    'update:price',
    'update:categories',
    'update:rated',
    'update:name_eng',
    'update:movie',
    'update:duration',
    'update:description'
]);
const optionsRated = ref(null)
const optionCategory = ref(null)

const exampleModalref = ref(null)
const exampleModalobj = ref(null)
const categories = ref([]);
const date1 = ref(new Date());
const date2 = ref(new Date());
const selectedFile = ref(null);
const imageUrl = ref(null);
const moviePics = ref([]);
const fileList = ref([]);
const deleteQueue = ref([]);
const updatedFileList = ref('')
const test = ref('')
onMounted(function () {
    console.log("Component mounted, initializing modal and fetching data.");
    exampleModalobj.value = new bootstrap.Modal(exampleModalref.value)
    if (props.releaseDate) {
        date1.value = formatDate(props.releaseDate);
    } if (props.endDate) {
        date2.value = formatDate(props.endDate);
    }
    findRated()
    findCategory()

})
watch(() => props.categories, (newVal) => {
    if (newVal) {
        categories.value = [...newVal]
    }
}, { deep: true, immediate: true });
watch(() => props.id, async (newVal1) => {
    if (newVal1) {
        try {
            console.log(newVal1, "ID");
            const response1 = await axiosapi.get(`/moviePicture/${newVal1}`);
            const pictures = response1.data;
            moviePics.value = pictures.map(pic => {
                return {
                    id: pic.id,
                    name: pic.filename,
                    pictureData: pic.picture
                };
            });
        } catch (error) {
            console.error('Error fetching movie pictures:', error);
        }
    }
});
watch(
    () => props.releaseDate,
    (newVal) => {
        if (newVal) {
            date1.value = formatDate(newVal);
        }
    },
    { immediate: true } // immediate: true ensures the watcher runs immediately with the current value
);

// Watch for changes in endDate prop
watch(
    () => props.endDate,
    (newVal) => {
        if (newVal) {
            date2.value = formatDate(newVal);
        }
    },
    { immediate: true }
);
function parseDate(date) {
    try {
        return new Date(date.toISOString().split('T')[0]);
    } catch (error) {
        console.error("Error parsing date:", error);
        return new Date(); // 如果傳入日期無效，返回當前日期
    }
}

function showModal() {
    exampleModalobj.value.show();
}
function hideModal() {
    exampleModalobj.value.hide();
}
const insert = async () => {
    try {
        emits('insert')
        console.log("新增");
        hideModal();
    } catch (error) {
        console.error("Error inserting data:", error);
    }
};

const update = async () => {
    try {
        emits('update')
        await saveData();
        console.log("修改");
        hideModal();
    } catch (error) {
        console.error("Error updating data:", error);
    }
};

function findRated() {
    axiosapi.get("/backstage/movie/ratedlist").then(function (response) {
        console.log("rated", response)
        optionsRated.value = response.data.ratedlist
        console.log("rated", optionsRated.value)
    }).catch(function (error) {
        console.log("callFind error", error);
    })
}
function findCategory() {
    axiosapi.get("/backstage/movie/categorylist").then(function (response) {
        console.log("cate", response)
        optionCategory.value = response.data.categorylist
    }).catch(function (error) {
        console.log("callFind error", error)
    })
}
function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1); // 月份是從 0 開始的
    let day = '' + d.getDate();
    let year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-'); // 格式化為 YYYY-MM-DD
}
function updateCategory(newCode) {
    console.log(newCode)
    emits('update:categories', categories.value);
}
function dateChange(action, newValue) {
    let formattedDate = formatDate(newValue);
    if (action === 'release') {
        date1.value = formattedDate
        emits('update:releaseDate', formattedDate)
    }
    else {
        date2.value = formattedDate
        emits('update:endDate', formattedDate)
    }
}
const handleFileChange = event => {
    selectedFile.value = event.target.files[0];
    if (selectedFile.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageUrl.value = e.target.result;
        };
        reader.readAsDataURL(selectedFile.value);
    }
}

function uploadPhotoid(id) {
    if (!selectedFile.value) {
        console.error('No file selected.');
        return;
    }
    console.log(props.id)
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    axiosapi.post(`/admin/backstage/movie/uploadPhoto/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            console.log('Image uploaded successfully:', response.data);
            imageUrl.value = null;
            selectedFile.value = null;
            alert('上傳成功！');
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
}
function uploadPhoto() {
    if (!selectedFile.value) {
        console.error('No file selected.');
        return;
    }
    console.log(props.id)
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    axiosapi.post(`/admin/backstage/movie/uploadPhoto/${props.id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then(response => {
            console.log('Image uploaded successfully:', response.data);
            imageUrl.value = null;
            selectedFile.value = null;
            alert('上傳成功！');
        })
        .catch(error => {
            console.error('Error uploading image:', error);
        });
}
const markForDeletion = (index) => {
    deleteQueue.value.push(moviePics.value[index]);
    moviePics.value.splice(index, 1);
};
const handleUploadChange = ({ file, fileList }) => {
    updatedFileList.value = fileList;
    console.log(updatedFileList.value);
};
const getPictureUrl = (pictureData) => {
    if (!pictureData) {
        console.error('Invalid pictureData:', pictureData);
        return '';
    }
    return `data:image/jpeg;base64,${pictureData}`//加上base64前綴
}
const saveDataid = async (id) => {
    const uploadData = new FormData();
    console.log("新增上傳")
    console.log(fileList)
    fileList.value.forEach(file => {
        uploadData.append('files', file.raw);
    });
    let uploadedPics = [];
    if (fileList.value.length > 0) {
        try {
            const response = await axiosapi.post(`/admin/moviePicture/${id}`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            uploadedPics = response.data;
            console.log('Photos uploaded successfully:', uploadedPics);
        } catch (error) {
            console.error('Error uploading photos:', error);
            return;
        }
    }
}
const saveData = async () => {
    // Save data
    const uploadData = new FormData();
    console.log(fileList)
    fileList.value.forEach(file => {
        uploadData.append('files', file.raw);
    });
    let uploadedPics = [];
    if (fileList.value.length > 0) {
        try {
            const response = await axiosapi.post(`/admin/moviePicture/${props.id}`, uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            uploadedPics = response.data;
            console.log('Photos uploaded successfully:', uploadedPics);
        } catch (error) {
            console.error('Error uploading photos:', error);
            return;
        }
    }
    // Delete marked photos
    if (deleteQueue.value.length > 0) {
        console.log(deleteQueue, "DELETE")
        const deleteIds = deleteQueue.value.map(pic => pic.id);
        console.log(deleteIds)
        try {
            const response = await axiosapi.delete('/admin/moviePicture', {
                params: { lists: deleteIds },
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: 'repeat' });
                }
            });
            deleteQueue.value = [];
        } catch (error) {
            console.error('Error deleting photos:', error);
        }
    }
};
defineExpose({
    showModal, hideModal, uploadPhoto, uploadPhotoid, saveDataid
})

</script>

<style scoped>
.fade {
    z-index: 1060;
}

.file-label {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 5px;
}

.file-label:hover {
    background-color: #45a049;
}
</style>