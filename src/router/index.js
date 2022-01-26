import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/main",
    name: "Main",
    component: () => import("@/views/Main"),
    children: [
      {
        path: "user",
        component: () => import("@/components/main/user/User"),
      },
      {
        path: "dashboard",
        component: () => import("@/views/Dashboard"),
      },
      {
        path: "task_item",
        component: () => import("@/components/task/TaskItem"),
      },
      {
        path: "new_task",
        component: () => import("@/components/task/NewTask"),
      },
      {
        path: "role",
        component: () => import("@/components/main/user/Role"),
      },
      {
        path: "published",
        component: () => import("@/components/task/Published"),
      },
      {
        path: "myTask",
        component: () => import("@/components/task/MyTask"),
      },
      {
        path: "authority",
        component: () => import("@/components/main/user/Authority"),
      },
    ],
    redirect: "/main/dashboard",
  },
  {
    path: "/",
    redirect: "/main",
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login"),
  },
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/login") {
    localStorage.setItem("toPath", to.path);
  }

  next();
});

export default router;
