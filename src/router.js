import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import AdminView from "@/views/AdminView.vue";
import UserView from "@/views/UserView.vue";
import CrearUsuarioView from "@/views/CrearUsuarioView.vue";
import EliminarUsuarioView from "@/views/EliminarUsuarioView.vue";
import IngresoRegistroView from "@/views/IngresoRegistroView.vue";
import ConsultaRegistroView from "@/views/ConsultaRegistroView.vue";
import ModificarRegistroView from "@/views/ModificarRegistroView.vue"; // 👈 Importación correcta

const routes = [
  { path: "/", component: LoginView, meta: { requiresAuth: false } },
  { path: "/menu-administrador", component: AdminView, meta: { requiresAuth: true } },
  { path: "/menu-usuario", component: UserView, meta: { requiresAuth: true } },
  { path: "/crear-usuario", component: CrearUsuarioView, meta: { requiresAuth: true } },
  { path: "/eliminar-usuario", component: EliminarUsuarioView, meta: { requiresAuth: true } },
  { path: "/ingreso-registro", component: IngresoRegistroView, alias: "/ingreso", meta: { requiresAuth: true } },
  { path: "/consulta", component: ConsultaRegistroView, meta: { requiresAuth: true } },

  // ✅ Esta ruta debe coincidir con lo que usas en los botones de navegación
  { path: "/modificar-registro", component: ModificarRegistroView, meta: { requiresAuth: true } },

  // ✅ Ruta para editar un ingreso específico
  {
    path: "/editar/:id_ingreso",
    name: "EditarIngreso",
    component: IngresoRegistroView,
    props: true,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// Guardia de navegación para proteger rutas
router.beforeEach((to, from, next) => {
  const sessionToken = localStorage.getItem('session_token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // Si la ruta requiere autenticación y no hay token
  if (requiresAuth && !sessionToken) {
    sessionStorage.setItem('redirect_message', 'Debe iniciar sesión para acceder a esta página.');
    next('/');
  } 
  // Permitir siempre el acceso al login sin redirección automática
  else if (to.path === '/') {
    next();
  }
  // En cualquier otro caso, continuar
  else {
    next();
  }
});

export default router;
