<template>
 <div class="col-12">
 <div class="row">
 
      <!-- <div class="col-4">
          <input type="text" v-model="findName" placeholder="請輸入產品名稱" @input="callFind(0)">
      </div> -->
      <div class="col-4">
          <Rows :total="count" :choices="[2, 3, 4, 5, 10]"
                      v-model="rows" @change="callFind"></Rows>
      </div>
      <div class="col-4" v-show="count!=0">
          <Paginate :first-last-button="true" first-button-text="&lt;&lt;"
                  last-button-text="&gt;&gt;" prev-text="&lt;" next-text="&gt;"
                  :page-count="pages" :initial-page="current" v-model="current"
                  :click-handler="callFind">
          </Paginate>
      </div>
      <div class="col-4">
          <button type="button" class="btn btn-primary" @click="drawer = true">
                  查詢
          </button>
          <el-drawer v-model="drawer" title="I am the title" :with-header="false"  >
              <el-form label-width="auto" style="max-width: 600px">
                <el-form-item label="編號">
                        <el-input v-model="id" />
                </el-form-item>
                <!-- 多一個姓名分開 -->
                <el-form-item label="姓氏">
                        <el-input v-model="userFirstname" />
                </el-form-item>
                <el-form-item label="名字">
                        <el-input v-model="userLastname" />
                </el-form-item>




                <el-form-item label="內容">
                        <el-input v-model="text" />
                </el-form-item>
                <el-form-item label="分類">

                    <select size="1" v-model="category">
                        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
                    </select>

                    

                </el-form-item>
                <el-form-item label="Email">
                        <el-input v-model="email" />
                </el-form-item>
                <el-form-item label="狀態">
                    <select  v-model="status">
                        <option v-for="status in statuses" :key="status.value" :value="status.value">{{ status.label }} </option>                    
                    </select>


                </el-form-item>

                


                <el-form-item label="新增時間">
                        <el-col :span="11">
                                <el-date-picker v-model="createDateStart" type="date"
                                        placeholder="Pick a date" style="width: 100%"
                                        value-format="YYYY-MM-DD" />
                        </el-col>
                        <el-col :span="2" class="text-center">
                                <span class="text-gray-500">-</span>
                        </el-col>
                        <el-col :span="11">
                                <el-date-picker v-model="createDateEnd" type="date"
                                        placeholder="Pick a date" style="width: 100%"
                                        value-format="YYYY-MM-DD" />
                        </el-col>
                </el-form-item>
                


                <el-form-item label="處理時間">
                        <el-col :span="11">
                                <el-date-picker v-model="handleDateStart" type="date"
                                        placeholder="Pick a date" style="width: 100%"
                                        value-format="YYYY-MM-DD" />
                        </el-col>
                        <el-col :span="2" class="text-center">
                                <span class="text-gray-500">-</span>
                        </el-col>
                        <el-col :span="11">
                                <el-date-picker v-model="handleDateEnd" type="date"
                                        placeholder="Pick a date" style="width: 100%"
                                        value-format="YYYY-MM-DD" />
                        </el-col>
                </el-form-item>
                
                <el-form-item>
                        <el-button type="primary" class="btn btn-primary" @click="callFind(0)">查詢</el-button>
                        <el-button @click="clear" class="btn btn-primary">清空查詢條件</el-button>
                </el-form-item>
              </el-form>
          </el-drawer>
      

  </div>


  </div>

  <div class="table-container">
      <table class="styled-table">
        <thead>
          <tr>
            <th>編號</th>
            <th>姓名</th>
            <th>分類</th>
            <th>內容描述</th>
            <th>Email</th>
            <th>狀態</th>
            <th>新增時間</th>
            <th>處理時間 </th>

            
            <th>修改狀態</th>
            <th>刪除</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="custservice in custServices" :key="custservice.id" >
            <th scope="row">{{ custservice.id }}</th>
            <td>{{ custservice.user }}</td>
            <td>{{ custservice.category }}</td>
            <td>{{ custservice.text }}</td>
            <td>{{ custservice.userEmail }}</td>
            <td v-if="custservice.status"><el-tag type="success">已處理</el-tag>
                                                        </td>
            <td v-else><el-tag type="danger">未處理</el-tag></td>


            <td>{{ moment(custservice.createDate).format("YYYY-MM-DD ") }}</td>
            <td>{{ moment(custservice.HandleDate).format("YYYY-MM-DD ") }}</td>

            <td><input type="button" value="已處理" class="btn btn-primary"  @click="updateStatus(custservice.id)"/></td>
            <td><input type="button" value="刪除" class="btn btn-primary"  @click="deleteCustService(custservice.id)"/></td>

          </tr>
        </tbody>
      </table>
    </div>

  </div>

</template>

<script setup>
import moment from 'moment';
  import Swal from "sweetalert2"
  import axiosapi from "@/plugins/axiosConfig";
  import Paginate from "vuejs-paginate-next"

  import Rows from "./Rows.vue";
  import { ref, onMounted } from "vue";
  import { ElMessage } from 'element-plus';


  const custServices = ref({});
  const productModalRef = ref(null);
  const custservice = ref({ });
  const findName = ref("");


  const categories=(['票務問題','環境與設施','服務品質','電影相關','安全秩序','其他']);
  const statuses=([ { label: '已處理', value: true },
      { label: '未處理', value: false }]);
  //pagination start
  const count = ref(0);
  const pages = ref(4);
  const current = ref(1);
  const start = ref(0);
  const rows = ref(10);
  const lastPageRows = ref(0);
  //pagination end
  const drawer = ref(false)

  //查詢條件
  const id=ref(null);
  const userFirstname=ref('');
  const userLastname=ref('');

  const text=ref('');
  const category=ref('');
  const email=ref('');
  const status=ref(null);
  const createDateStart=ref('');
  const createDateEnd=ref('');
   const handleDateStart=ref('');
  const handleDateEnd=ref('');

  const dir=ref(true);
  const defcategory=ref()
  

    function updateStatus(id) {
        console.log(id);
        
        
            console.log(status.value)
        axiosapi.put(`/back/custService/update/${id}`).then((response) => {
            
            if (response.status === 200) {
                Swal.fire({
                    showConfirmButton: true,
                    allowOutsideClick: false,
                    icon: "success",
                    title: "修改完成",
                    confirmButtonText: "確認",
                })

                callFind(current.value);
            }
        }).catch(error => {
            console.log(error);
        })

        callFind();
    }

 
  function callFind(page) {
      // Swal.fire({
      //     text: "Loading......",
      //     showConfirmButton: false,
      //     allowOutsideClick: false,
      // });
      
    //   if(page) {
    //       start.value = (page - 1) * rows.value;
    //       current.value = page;
    //   } else {
    //       start.value = 0;
    //       current.value = 1;
    //   }

    if (page) {
    if (page > 1) {
    start.value = page - 1;
    } else {
    start.value = 0;
    }
    current.value = page;
    } else {
        start.value = 0;
        current.value = 1;
    }
      if(findName.value==="") {
          findName.value = null;
      }

      if(id.value==="") {
          id.value = null;
      }

    if(userFirstname.value==="") {
        userFirstname.value = null;
    }
      if(userLastname.value==="") {
          userLastname.value = null;
      }
      if(text.value==="") {
          text.value = null;
      }

      if(category.value==="") {
          category.value = null;
      } 

      if(email.value==="") {
          email.value = null;
      }

        if(status.value==="") {
            status.value = null;
        }

        

      if(createDateStart.value==="") {
          createDateStart.value = null;
      }

      if(createDateEnd.value==="") {
          createDateEnd.value = null;
      }
    if(handleDateStart.value==="") {
          handleDateStart.value = null;
      }

      if(handleDateEnd.value==="") {
          handleDateEnd.value = null;
      }


      let data = {
          // 要改
          "start": start.value,
          "rows": rows.value,
          "dir": dir.value,

          "id": id.value,
          "userFirstname":userFirstname.value,
          "userLastname":userLastname.value,

          "text": text.value,
          "category": category.value,
          "userEmail": email.value,
          "status": status.value,
          "createDateStart": createDateStart.value,
          "createDateEnd": createDateEnd.value,
          "handleDateStart": handleDateStart.value,
          "handleDateEnd": handleDateEnd.value,

          // "name": findName.value
      };
      axiosapi.post("/back/custService/find",  data).then((response) =>{
          custServices.value = response.data.list;
          count.value = response.data.count;
        //   status.value = response.data.list.status;
          //pagination start
          // total.value =  response.data.count;
          // pages.value = Math.ceil(response.data.count / rows.value);
          // lastPageRows.value = response.data.count % rows.value;
          //pagination end
      }).catch((error) => {
          console.log("callFind error", error);
          
          })
          drawer.value = false

  }

  onMounted(function() {
      callFind();
  });

  function clear() {
    
    id.value=null
    userFirstname.value=null
    userLastname.value=null
    text.value=null
    category.value=null
    email.value=null
    status.value=null
    createDateStart.value=''
    createDateEnd.value=''
    handleDateStart.value=''
    handleDateEnd.value=''

    callFind2();
}
function handleSizeChange(size) {
        rows.value = size
}

function callFind2(page) {
      // Swal.fire({
      //     text: "Loading......",
      //     showConfirmButton: false,
      //     allowOutsideClick: false,
      // });
      
      if(page) {
          start.value = (page - 1) * rows.value;
          current.value = page;
      } else {
          start.value = 0;
          current.value = 1;
      }

      if(findName.value==="") {
          findName.value = null;
      }

      if(id.value==="") {
          id.value = null;
      }
      if(userFirstname.value==="") {
        userFirstname.value = null;
    }
      if(userLastname.value==="") {
          userLastname.value = null;
      }
     

        if(status.value==="") {
            status.value = null;
      }

      if(text.value==="") {
          text.value = null;
      }

      if(category.value==="") {
          category.value = null;
      } 

      if(email.value==="") {
          email.value = null;
      }

      if(status.value==="") {
          status.value = null;
      }

      if(createDateStart.value==="") {
          createDateStart.value = null;
      }

      if(createDateEnd.value==="") {
          createDateEnd.value = null;
      }
        if(handleDateStart.value==="") {
            handleDateStart.value = null;
        }

        if(handleDateEnd.value==="") {
            handleDateEnd.value = null;
        }

      let data = {
          // 要改
          "start": start.value,
          "rows": rows.value,
          "dir": dir.value,

          "id": id.value,
          "userFirstname":userFirstname.value,
          "userLastname":userLastname.value,
          "text": text.value,
          "category": category.value,
          "userEmail": email.value,
          "status": status.value,
          "createDateStart": createDateStart.value,
          "createDateEnd": createDateEnd.value,
          "handleDateStart": handleDateStart.value,
          "handleDateEnd": handleDateEnd.value,

          // "name": findName.value
      };
      axiosapi.post("/back/custService/find",  data).then((response) =>{
          custServices.value = response.data.list;
          count.value = response.data.count;
          //pagination start
          // total.value =  response.data.count;
          // pages.value = Math.ceil(response.data.count / rows.value);
          // lastPageRows.value = response.data.count % rows.value;
          //pagination end
          
      }).catch((error) => {
          console.log("callFind error", error);
          
          })

  }
  function deleteCustService(id) {
    Swal.fire({
        text: "確定要刪除嗎?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "確定",
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            axiosapi.delete(`/back/custService/delete/${id}`).then((response) => {
                    callFind(current.value);
                    ElMessage({
                        type: 'success',
                        message: "刪除成功",
                    })
            }).catch((error) => {
                    ElMessage({
                        type: 'error',
                        message: "刪除失敗",
                    })
            })            
        }
    })
  }
</script>
  
<style scoped>
.table-container {
  margin: 20px;
  overflow-x: auto;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 16px;
  text-align: left;
}

.styled-table th, .styled-table td {
  padding: 12px 15px;
  border: 1px solid #ddd;
}

.styled-table th {
  background-color: #f4f4f4;
  color: #333;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f9f9f9;
}

.styled-table tbody tr:hover {
  background-color: #f1f1f1;
}

.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
}
</style>