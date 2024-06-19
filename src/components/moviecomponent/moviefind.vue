<template>
  <div class="row align-items-start">
    <div class="col-7">
      <div class="row align-items-start">
        <div class="col-2">
          <button
            type="button"
            class="btn btn-primary"
            @click="openModal('insert')"
          >
            新增
          </button>
        </div>
        <div class="col-4">
          <input
            type="text"
            @change="callFind"
            v-model="name"
            maxlength="10"
            @keypress.enter="callFind"
            placeholder="Type here and press Enter"
          />
        </div>
        <div class="col-3">
          <MovieRows
            :total="total"
            :choices="[2, 3, 4, 5, 10]"
            @change="callFind"
            v-model="rows"
          />
        </div>
        <div class="col-3">
          <movieSortOrder
            :choices="[id, releaseDate, endDate, viewer]"
            @change="callFind"
            v-model="sort"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <MovieList
            class="mlist"
            v-for="movie in movies"
            :key="movie.id"
            :movie="movie"
            @select="handleSelectMovie"
            :activeMovie="activeMovie"
            @updateActive="handleUpdateActive"
          />
        </div>
      </div>
      <div class="container text-center">
        <div class="row">
          <div class="col-3">
            <Paginate
              v-show="!pages == 0"
              first-button-text="&lt;&lt;"
              last-button-text="&gt;&gt;"
              prev-text="&lt;"
              next-text="&gt;"
              :first-last-button="true"
              :page-count="pages"
              :initial-page="current"
              :click-handler="callFind"
              v-model="current"
            >
            </Paginate>
          </div>
        </div>
      </div>
    </div>
    <div class="col-5">
      <MovieCard
        v-if="selectedMovie"
        :movie="selectedMovie"
        @open-update="() => openModal('update', selectedMovie.id)"
        @delete="callDelete(selectedMovie.id)"
      >
      </MovieCard>
    </div>
  </div>
  <movieModal
    ref="movieModalRef"
    :is-show-button-insert="isShowButtonInsert"
    @insert="callCreate()"
    @update="callModify(movie.id)"
    v-model:id="movie.id"
    v-model:name="movie.name"
    v-model:name_eng="movie.name_eng"
    v-model:director="movie.director"
    v-model:releaseDate="movie.releaseDate"
    v-model:endDate="movie.endDate"
    v-model:price="movie.price"
    v-model:categories="movie.category"
    v-model:rated="movie.rated"
    v-model:duration="movie.duration"
    v-model:description="movie.description"
    v-model:movie="movie"
  ></movieModal>
</template>

<script setup>
import Swal from "sweetalert2";
import { onMounted, ref, provide } from "vue";
import { useRouter } from "vue-router";
import axiosapi from "@/plugins/axiosConfig.js";
import MovieCard from "@/components/moviecomponent/moviecard.vue";
import MovieRows from "@/components/moviecomponent/movieRow.vue";
import movieModal from "@/components/moviecomponent/movieModal.vue";
import Paginate from "vuejs-paginate-next";
import MovieList from "@/components/moviecomponent/movielist.vue";
import movieSortOrder from "./movieSortOrder.vue";
const movies = ref(null);
const movie = ref({});
const selectedMovie = ref(null);
const current = ref(1); //目前分頁
const pages = ref(100); //最多需要幾個分頁
const start = ref(0); //起始位置
const rows = ref(3); //一頁幾筆資料
const total = ref(0);
const sort = ref(null);
const isShowButtonInsert = ref(true);
const movieModalRef = ref(null);
const categories = ref([]);
const id = "id";
const releaseDate = "releaseDate";
const endDate = "endDate";
const viewer = "viewer";
const name = ref(null);
const router = useRouter();
onMounted(function () {
  callFind();
});
const activeMovie = ref(null);

function handleUpdateActive(movie) {
  activeMovie.value = movie;
}

provide("updateActiveMovie", handleUpdateActive);
provide("activeMovie", activeMovie);
function openModal(action, id) {
  console.log(id);
  if (action == "insert") {
    movie.value = {};
    isShowButtonInsert.value = true;
  } else {
    isShowButtonInsert.value = false;
    callFindById(id);
  }
  movieModalRef.value.showModal();
}
function callFind(page) {
  console.log("page", page);
  console.log("callFind");
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
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
  let data = {
    start: start.value,
    rows: rows.value,
    order: sort.value,
    name: name.value,
  };
  axiosapi
    .post("/backstage/movie/find", data)
    .then(function (response) {
      movies.value = response.data.list;
      //page start
      // total.value = response.data.count
      total.value = response.data.count;
      pages.value = Math.ceil(total.value / rows.value);
      //page end

      console.log("response", response);
      console.log(pages);
      setTimeout(function () {
        Swal.close();
      }, 100);
    })
    .catch(function (error) {
      console.log("callFind error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}
function callFindById(id) {
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  axiosapi
    .get(`/backstage/movie/${id}`)
    .then(function (response) {
      console.log("response", response.data.list);
      if (response.data.list.length != 0) {
        movie.value = response.data.list[0];
        categories.value = movie.value.category;
        console.log(categories);
      }
      console.log(movie.value);
      setTimeout(function () {
        Swal.close();
      }, 200);
    })
    .catch(function (error) {
      console.log("callFind error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}
function callCreate() {
  console.log("callCreate");
  Swal.fire({
    text: "Loading......",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  let data = movie.value;
  console.log(data);
  axiosapi
    .post("/admin/backstage/movie", data)
    .then(function (response) {
      if (response.data.success) {
        console.log("upload photo id");
        console.log(response.data);
        movieModalRef.value.uploadPhotoid(response.data.id);
        movieModalRef.value.saveDataid(response.data.id);
        Swal.fire({
          text: response.data.message,
          icon: "success",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        }).then(function () {
          callFind();
          movieModalRef.value.hideModal();
          console.log(response.data);
          //movieModalRef.value.uploadPhoto(response.data.movieId)
        });
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "warning",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        });
      }
    })
    .catch(function (error) {
      console.log("callCreate error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}
function callModify(id) {
  let data = movie.value;
  console.log("modify", data);
  axiosapi
    .put(`/admin/backstage/movie/${id}`, data)
    .then(function (response) {
      if (response.data.success) {
        Swal.fire({
          text: response.data.message,
          icon: "success",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        }).then(function () {
          selectedMovie.value = "";
          callFind();
          movieModalRef.value.hideModal();
        });
      } else {
        Swal.fire({
          text: response.data.message,
          icon: "warning",
          allowOutsideClick: false,
          confirmButtonText: "確認",
        });
      }
    })
    .catch(function (error) {
      console.log("callCreate error", error);
      Swal.fire({
        text: "失敗：" + error.message,
        icon: "error",
        allowOutsideClick: false,
        confirmButtonText: "確認",
      });
    });
}
function callDelete(id) {
  let data = movie.value;
  Swal.fire({
    text: "確定要刪除嗎?",
    icon: "warning",
    allowOutsideClick: false,
    confirmButtonText: "確認",
    showCancelButton: true,
    cancelButtonText: "取消",
  }).then((result) => {
    if (result.isConfirmed) {
      axiosapi
        .delete(`/admin/backstage/movie/${id}`)
        .then(function (response) {
          console.log(response);
          if (response.data.succeed) {
            Swal.fire({
              text: "刪除成功",
              icon: "success",
              allowOutsideClick: false,
              confirmButtonText: "確認",
            }).then(function () {
              router.go(0);
            });
          } else {
            Swal.fire({
              text: response.data.message,
              icon: "warning",
              allowOutsideClick: false,
              confirmButtonText: "確認",
            });
          }
        })
        .catch(function (error) {
          console.log("callCreate error", error);
          Swal.fire({
            text: "失敗：" + error.message,
            icon: "error",
            allowOutsideClick: false,
            confirmButtonText: "確認",
          });
        });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      console.log("用戶取消刪除");
    }
  });
}
function handleSelectMovie(movie) {
  console.log(movie.id);
  if (selectedMovie.value && selectedMovie.value.id === movie.id) {
    selectedMovie.value = null;
  } else {
    selectedMovie.value = movie;
  }
}
</script>

<style scoped>
.modal {
  z-index: 1051;
}
.mlist {
  margin-top: 10px;
}
</style>
