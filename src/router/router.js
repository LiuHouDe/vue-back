import { createRouter, createWebHistory } from "vue-router";

import userRouters from "./user-routers";
import index from "@/components/Page/index.vue";
import NotFound from "@/components/Page/NotFound.vue";
import movieRouters from "./movie-router.js";
import screeningRouters from "./screening-router.js";
import Login from "@/components/view/Login.vue";
import cinemaRouters from "./cinema-router.js";
import commentRouter from "./comment-router.js";
import orderRouter from "./order-router.js";
import custService from "./custService.js";
import foodRouter from "./food-router.js";

const routes = [
  {
    name: "index-link",
    path: "/",
    component: index,
  },
  { path: "/:pathMatch(.*)*", name: "notfound-link", component: NotFound },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  ...userRouters,
  ...movieRouters,
  ...screeningRouters,
  ...cinemaRouters,
  ...commentRouter,
  ...orderRouter,
  ...custService,
  ...foodRouter,
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 
  if (to.path !== '/login' && to.path !== '/' && !token) {
    next('/login');
  } else {
    next();
  }
});

export default router;
