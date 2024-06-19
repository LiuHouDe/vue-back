<template>
  <el-table :data="filterTableData" style="width: 100%; height: 61%">
    <el-table-column label="commentId" prop="commentId" />
    <el-table-column label="content" prop="content" />
    <el-table-column label="creatTime" prop="createtime" />
    <el-table-column label="rate" prop="rate" />
    <el-table-column label="movieName" prop="movieId.name" />
    <el-table-column label="userEmail" prop="userId.email" />

    <el-table-column label="user" prop="userId.userLastname" />

    <el-table-column align="right">
      <template #header>
        <el-input
          v-model="search"
          size="small"
          placeholder="從評論尋找"
          @input="handleSearch"
        />
        <el-input
          v-model="search1"
          size="small"
          placeholder="以email尋找"
          @input="handleSearch1"
        />
        <el-input
          v-model="search2"
          size="small"
          placeholder="以電影名稱尋找"
          @input="handleSearch2"
        />
      </template>

      <template #default="scope">
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-container">
    <el-pagination
      v-model:currentPage="currentPage"
      :page-size="pageSize"
      :total="totalItems"
      @current-change="handlePageChange"
      layout="total, prev, pager, next"
    />
  </div>

  <el-dialog v-model="deleteDialogVisible" title="刪除" width="500">
    <h2>確定要刪除嗎?</h2>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="deleteDialogVisible = false">取消</el-button>
        <el-button @click="confirmDelete">確定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import axiosapi from "@/plugins/axiosConfig";
import Swal from "sweetalert2";
import { onMounted, ref, computed, watch } from "vue";

const deleteDialogVisible = ref(false);
const comments = ref([]);
const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(12);
const commentToDelete = ref(null);
const search = ref("");
const search1 = ref("");
const search2 = ref("");

function findComment(page = 1) {
  axiosapi
    .get("/comment/path", {
      params: {
        page: page - 1, 
        size: pageSize.value,
      },
    })
    .then((res) => {
      if (res.data && Array.isArray(res.data.comments)) {
        comments.value = res.data.comments;
        totalItems.value = res.data.totalItems;
      } else {
        console.error("不是陣列", res.data);
        Swal.fire("Error", "不是陣列", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Error", error.message, "error");
    });
}

function searchComments(page = 1) {
  axiosapi
    .get("/comment/search", {
      params: {
        keyword: search.value,
        page: page - 1, // 后端分頁0開始
        size: pageSize.value,
      },
    })
    .then((res) => {
      if (res.data && Array.isArray(res.data.comments)) {
        comments.value = res.data.comments;
        totalItems.value = res.data.totalItems;
      } else {
        console.error("不是陣列", res.data);
        Swal.fire("Error", "不是陣列", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Error", error.message, "error");
    });
}

function searchemail(page = 1) {
  axiosapi
    .get("/comment/search/email", {
      params: {
        keyword: search1.value,
        page: page - 1, // 后端分頁0開始
        size: pageSize.value,
      },
    })
    .then((res) => {
      if (res.data && Array.isArray(res.data.comments)) {
        comments.value = res.data.comments;
        totalItems.value = res.data.totalItems;
      } else {
        console.error("不是陣列", res.data);
        Swal.fire("Error", "不是陣列", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Error", error.message, "error");
    });
}

function searchname(page = 1) {
  axiosapi
    .get("/comment/search/movie", {
      params: {
        keyword: search2.value,
        page: page - 1, // 后端分頁0開始
        size: pageSize.value,
      },
    })
    .then((res) => {
      if (res.data && Array.isArray(res.data.comments)) {
        comments.value = res.data.comments;
        totalItems.value = res.data.totalItems;
      } else {
        console.error("不是陣列", res.data);
        Swal.fire("Error", "不是陣列", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Error", error.message, "error");
    });
}

onMounted(() => {
  findComment(currentPage.value);
});

watch(search, (newVal) => {
  if (newVal) {
    searchComments(currentPage.value);
  } else {
    findComment(currentPage.value);
  }
});

const filterTableData = computed(() => {
  if (!Array.isArray(comments.value)) {
    return [];
  }
  return comments.value;
});

const handleDelete = (index: number, row: any) => {
  deleteDialogVisible.value = true;
  commentToDelete.value = row.commentId; // 保存删除的評論ID
  console.log(index, row);
};

const confirmDelete = () => {
  axiosapi
    .delete(`/comment/delete/${commentToDelete.value}`)
    .then((res) => {
      Swal.fire("Deleted!", "已刪除訊息", "success");
      deleteDialogVisible.value = false;
      findComment(currentPage.value); // 刷新列表
    })
    .catch((error) => {
      Swal.fire("Error", error.message, "error");
    });
};

const handlePageChange = (page) => {
  currentPage.value = page;
  if (search.value) {
    searchComments(page);
  } else {
    findComment(page);
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  searchComments(currentPage.value);
};
const handleSearch1 = () => {
  currentPage.value = 1;
  searchemail(currentPage.value);
};
const handleSearch2 = () => {
  currentPage.value = 1;
  searchname(currentPage.value);
};
</script>

<style scoped>
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>
