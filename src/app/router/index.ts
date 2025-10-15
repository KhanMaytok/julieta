import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const AuthLayout = () => import('@/shared/layouts/AuthLayout.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: "/login/",
    component: AuthLayout,
    meta: { requiresAuth: false },
    children: [
      {
        path: "/login/",
        name: 'login',
        component: () => import('@/app/modules/auth/views/LoginView.vue'),
      },
      {
        path: "/login2/",
        name: 'login2',
        component: () => import('@/app/modules/auth/views/Login2View.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router }
