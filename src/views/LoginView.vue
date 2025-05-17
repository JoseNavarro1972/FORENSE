<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="login">
      <div>
        <label for="usuario">Usuario:</label>
        <input type="text" id="usuario" v-model="usuario" required />
      </div>
      <div>
        <label for="clave">Contraseña:</label>
        <input type="password" id="clave" v-model="clave" required />
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
    <div v-if="mensaje" class="mensaje" :class="{'mensaje-error': !success, 'mensaje-exito': success}">{{ mensaje }}</div>
  </div>
</template>

<script>
import axios from "axios";
import AuthService from "../services/AuthService";

export default {
  name: "LoginView",
  data() {
    return {
      usuario: "",
      clave: "",
      mensaje: "",
      success: false
    };
  },
  created() {
    // Comprobar si hay un mensaje de redirección
    const redirectMessage = sessionStorage.getItem('redirect_message');
    if (redirectMessage) {
      this.mensaje = redirectMessage;
      this.success = false;
      sessionStorage.removeItem('redirect_message');
    }
  },
  methods: {
    async login() {
      try {
        const datos = {
          usuario: this.usuario,
          clave: this.clave
        };

        console.log("Enviando datos:", JSON.stringify(datos));

        // Usar la ruta de API correcta con URL completa
        const response = await axios.post("http://localhost:3002/api/login", datos);

        console.log("Respuesta del servidor:", response.data);

        if (response.data && response.data.id_usuario) {
          this.success = true;
          this.mensaje = "✅ Login exitoso, redirigiendo...";
          
          // Guardar el token de sesión y datos de usuario en localStorage
          localStorage.setItem('session_token', response.data.id_sesion);
          localStorage.setItem('user_data', JSON.stringify({
            id_usuario: response.data.id_usuario,
            id_perfil: response.data.id_perfil,
            nombres_usuario: response.data.nombres_usuario
          }));

          // Configurar axios para enviar el token en futuras solicitudes
          axios.defaults.headers.common['X-Session-Token'] = response.data.id_sesion;
          
          // Reiniciar el temporizador de inactividad
          AuthService.resetInactivityTimer();
          
          // Determinar a dónde redirigir según el perfil
          const ruta = (response.data.id_perfil === 1) 
            ? "/menu-administrador" 
            : "/menu-usuario";
            
          console.log("Redirigiendo a:", ruta);
          
          setTimeout(() => {
            this.$router.push(ruta);
          }, 1000);
          
        } else {
          this.success = false;
          this.mensaje = "❌ " + (response.data.mensaje || "Error de autenticación");
        }
      } catch (error) {
        this.success = false;
        console.error("Error al conectar con el servidor:", error);
        
        if (error.response && error.response.data) {
          this.mensaje = "❌ " + error.response.data.mensaje;
        } else {
          this.mensaje = "❌ Error al comunicarse con el servidor.";
        }
      }
    }
  }
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}
.login-container h2 {
  text-align: center;
}
.login-container label {
  display: block;
  margin-top: 10px;
}
.login-container input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.login-container button {
  width: 100%;
  padding: 10px;
  margin-top: 15px;
  background-color: #6e6dca;
  color: white;
  border: none;
  cursor: pointer;
}
.login-container button:hover {
  background-color: #6e6dca;
}
.mensaje {
  margin-top: 10px;
  text-align: center;
  font-weight: bold;
}
.mensaje-error {
  color: #e74c3c;
}
.mensaje-exito {
  color: #2ecc71;
}
</style>
