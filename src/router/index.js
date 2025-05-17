import { createRouter, createWebHashHistory } from 'vue-router';
import IngresoRegistroView from '../views/IngresoRegistroView.vue'
import ConsultaRegistroView from '../views/ConsultaRegistroView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/login',
    meta: { requiresAuth: false }
  },
  {
    path: '/ingreso',
    name: 'ingreso',
    component: IngresoRegistroView,
    meta: { requiresAuth: true }
  },
  {
    path: '/ingreso/:id_ingreso',
    name: 'editar-ingreso',
    component: IngresoRegistroView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/consulta',
    name: 'consulta',
    component: ConsultaRegistroView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Protección de rutas
router.beforeEach((to, from, next) => {
  const sessionToken = localStorage.getItem('session_token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Si la ruta requiere autenticación y no hay token
  if (requiresAuth && !sessionToken) {
    sessionStorage.setItem('redirect_message', 'No ha iniciado sesión. Por favor, inicie sesión primero.');
    next('/login');
  } 
  // Si va a login pero ya está autenticado
  else if (to.path === '/login' && sessionToken) {
    // Determinar ruta según perfil
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const { id_perfil } = JSON.parse(userData);
      next(id_perfil === 1 ? '/menu-administrador' : '/menu-usuario');
    } else {
      next();
    }
  } 
  // En cualquier otro caso, continuar
  else {
    next();
  }
});

export default router; 