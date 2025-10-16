import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthToken } from "@/app/modules/auth/composables/useAuthToken";
import { ElMessage } from 'element-plus';

const { getAccess } = useAuthToken();
const AuthLayout = () => import('@/shared/layouts/AuthLayout.vue');
const DefaultLayout = () => import('@/shared/layouts/DefaultLayout.vue');

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
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "/web/",
        name: 'web',
        component: () => import('@/app/modules/core/views/WebDashboard.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = getAccess();
  const isAuthenticated = !!token;

  // Si requiere autenticación y no hay token → login
  if (to.meta.requiresAuth && !isAuthenticated) {
    ElMessage.warning('Debes iniciar sesión para continuar')
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }

  // Si ya está logeado e intenta ir al login → dashboard
  if (
    !to.meta.requiresAuth &&
    isAuthenticated &&
    typeof to.name === 'string' &&
    to.name.startsWith('login')
  ) {
    next({ name: 'web' })
    return
  }

  next()
})

export { router }
