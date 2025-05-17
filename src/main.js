import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Corregido: apunta al directorio para encontrar index.js
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import AuthService from './services/AuthService';

// Actualizar la URL base para apuntar al backend de Node.js
axios.defaults.baseURL = 'http://localhost:3002/api/';

// Configurar interceptores para token y cierre de sesión automático
AuthService.setupAxiosInterceptors();

const app = createApp(App);

app.use(router); // ✅ Usa el router en la app Vue

app.mount('#app');
