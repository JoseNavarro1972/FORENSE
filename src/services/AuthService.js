import axios from 'axios';

class AuthService {
  constructor() {
    this.timeoutId = null;
    this.inactivityTimeout = 15 * 60 * 1000; // 15 minutos en milisegundos
    this.setupActivityListeners();
  }

  // Configura escuchas para eventos de actividad del usuario
  setupActivityListeners() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    // Eliminar listeners anteriores si existen
    events.forEach(event => {
      document.removeEventListener(event, this.resetInactivityTimer);
    });
    
    // Añadir listeners para reset del timer
    events.forEach(event => {
      document.addEventListener(event, this.resetInactivityTimer.bind(this));
    });
    
    // Iniciar timer de inactividad
    this.resetInactivityTimer();
  }

  // Resetea el temporizador de inactividad
  resetInactivityTimer() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    
    // Solo configurar el timer si hay un token de sesión
    if (localStorage.getItem('session_token')) {
      this.timeoutId = setTimeout(() => {
        this.clearSession();
        // Establecer mensaje en sessionStorage
        sessionStorage.setItem('redirect_message', 'Su sesión ha caducado por inactividad. Por favor inicie sesión nuevamente.');
        // Redirigir al login
        window.location.href = '/#/';
      }, this.inactivityTimeout);
    }
  }

  // Limpiar datos de sesión
  clearSession() {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_data');
    delete axios.defaults.headers.common['X-Session-Token'];
  }

  // Configurar el axios con el token de sesión
  setupAxiosInterceptors() {
    // Interceptor para añadir token a todas las peticiones
    axios.interceptors.request.use(
      config => {
        const token = localStorage.getItem('session_token');
        if (token) {
          config.headers['X-Session-Token'] = token;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Interceptor para manejar errores de autenticación
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          this.clearSession();
          // Establecer mensaje en sessionStorage
          sessionStorage.setItem('redirect_message', 'Su sesión ha expirado. Por favor inicie sesión nuevamente.');
          // Redirigir al login
          window.location.href = '/#/';
        }
        return Promise.reject(error);
      }
    );
  }
}

export default new AuthService(); 