<template>
  <div>
    <!-- Botones en la parte superior -->
    <div class="botones-superior">
      <button class="boton-volver" @click="volver">Volver</button>
    </div>

    <!-- Título centrado y fuera del cuadro -->
    <h1 class="titulo-principal">Eliminar Usuario</h1>

    <!-- Contenedor gris con formulario -->
    <div class="eliminar-usuario-container">
      <div class="eliminar-usuario">
        <form class="form-container" @submit.prevent="confirmarEliminar">
          <div class="input-group">
            <label for="nombre">Nombre de Usuario:</label>
            <input type="text" id="nombre" v-model="nombreUsuario" required />
          </div>
          <button type="button" @click="buscarUsuario">Buscar</button>

          <div class="input-group">
            <label for="id">ID del Usuario:</label>
            <input type="text" id="id" v-model="usuarioId" readonly />
          </div>

          <button type="submit" :disabled="!usuarioId">Eliminar Usuario</button>
        </form>

        <p v-if="mensaje" :class="{'mensaje-exito': esExito, 'mensaje-error': !esExito}">
          {{ mensaje }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "EliminarUsuarioView",
  data() {
    return {
      nombreUsuario: "",
      usuarioId: "",
      mensaje: "",
      esExito: false
    };
  },
  created() {
    // Configurar axios para incluir el token de sesión en las peticiones
    const sessionToken = localStorage.getItem('session_token');
    if (sessionToken) {
      axios.defaults.headers.common['X-Session-Token'] = sessionToken;
    }
  },
  methods: {
    async buscarUsuario() {
      if (!this.nombreUsuario.trim()) {
        this.mensaje = "❌ Debes ingresar un nombre de usuario.";
        this.esExito = false;
        this.limpiarMensaje(5000);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3002/api/usuarios?buscar=${this.nombreUsuario}`);

        if (response.data && response.data.length > 0) {
          const usuario = response.data.find(u => u.nombres_usuario === this.nombreUsuario);
          if (usuario) {
            this.usuarioId = usuario.id_usuario;
            this.mensaje = "✅ Usuario encontrado.";
            this.esExito = true;
          } else {
            this.usuarioId = "";
            this.mensaje = "❌ Usuario no encontrado.";
            this.esExito = false;
          }
        } else {
          this.usuarioId = "";
          this.mensaje = "❌ Usuario no encontrado.";
          this.esExito = false;
        }

        this.limpiarMensaje(5000);
      } catch (error) {
        console.error("❌ Error al buscar usuario:", error);
        this.mensaje = "❌ Error al comunicarse con el servidor.";
        this.esExito = false;
        this.limpiarMensaje(5000);
      }
    },

    confirmarEliminar() {
      if (!this.usuarioId) {
        this.mensaje = "❌ No hay un usuario seleccionado.";
        this.esExito = false;
        this.limpiarMensaje(5000);
        return;
      }

      if (confirm(`¿Está seguro que desea eliminar el usuario ${this.nombreUsuario}?`)) {
        this.eliminarUsuario();
      }
    },

    async eliminarUsuario() {
      try {
        const response = await axios.delete(`http://localhost:3002/api/usuarios/${this.usuarioId}`);

        if (response.data && response.data.mensaje) {
          this.mensaje = "✅ Usuario eliminado con éxito.";
          this.esExito = true;
          this.nombreUsuario = "";
          this.usuarioId = "";
          // No limpiar el mensaje automáticamente para que el usuario lo vea
        } else {
          this.mensaje = "❌ Error al eliminar el usuario";
          this.esExito = false;
          this.limpiarMensaje(5000);
        }
      } catch (error) {
        console.error("❌ Error al eliminar usuario:", error);
        this.mensaje = "❌ Error al comunicarse con el servidor.";
        this.esExito = false;
        this.limpiarMensaje(5000);
      }
    },

    volver() {
      this.$router.go(-1);
    },

    limpiarMensaje(tiempo = 5000) {
      setTimeout(() => {
        this.mensaje = "";
      }, tiempo);
    }
  }
};
</script>

<style scoped>
/* Título centrado */
.titulo-principal {
  text-align: center;
  font-size: 32px;
  margin-top: 60px;
  margin-bottom: 30px;
  color: #333;
}

/* Contenedor del cuadro gris */
.eliminar-usuario-container {
  max-width: 600px;
  margin: 0 auto;
  background-color: #f5f5f5;
  padding: 30px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* Formulario */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  border: 1px solid #aaa;
  border-radius: 4px;
}

/* Botones */
button {
  padding: 10px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

button:hover:enabled {
  background-color: #004494;
}

/* Mensajes */
.mensaje-exito {
  background-color: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
}

.mensaje-error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-top: 15px;
}

/* Contenedor de botones superiores */
.botones-superior {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 10px;
  position: absolute;
  top: 10px;
  right: 10px;
}

/* Botón Volver */
.boton-volver {
  padding: 8px 12px;
  background-color: #9da89d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.boton-volver:hover {
  background-color: #7e8c7e;
}

.eliminar-usuario {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
}
</style>
