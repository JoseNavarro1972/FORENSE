<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <span class="app-title">Sistema de Análisis Forense</span>
    </div>
    <div class="navbar-menu">
      <div v-if="isLoggedIn" class="user-info">
        <span class="user-name">{{ userName }}</span>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from 'axios';

export default {
  name: 'NavBar',
  data() {
    return {
      isLoggedIn: false,
      userName: ''
    };
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const userData = localStorage.getItem('user_data');
      const sessionToken = localStorage.getItem('session_token');
      
      if (userData && sessionToken) {
        try {
          const user = JSON.parse(userData);
          this.isLoggedIn = true;
          this.userName = user.nombres_usuario || 'Usuario';
          
          // Configurar axios con el token de sesión
          axios.defaults.headers.common['X-Session-Token'] = sessionToken;
        } catch (e) {
          console.error('Error al procesar datos de usuario:', e);
          this.clearSession();
        }
      } else {
        this.isLoggedIn = false;
        this.userName = '';
      }
    },
    
    clearSession() {
      localStorage.removeItem('session_token');
      localStorage.removeItem('user_data');
      delete axios.defaults.headers.common['X-Session-Token'];
      this.isLoggedIn = false;
      this.userName = '';
    }
  }
};
</script>

<style scoped>
.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
}

.navbar-menu {
  margin-left: auto;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  font-weight: 500;
  color: white;
  font-style: italic;
  margin-right: 15px;
}
</style> 