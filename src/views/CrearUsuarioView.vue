<template>
  <div>
    <!-- Botones en la parte superior -->
    <div class="botones-superior">
      <button class="boton-volver" @click="volver">Volver</button>
    </div>

    <!-- Título principal centrado y fuera del contenedor gris -->
    <h1 class="titulo-principal">Crear Usuario</h1>

    <!-- Cuadro gris con el formulario -->
    <div class="crear-usuario-container">
      <div class="crear-usuario">
        <form class="form-container" @submit.prevent="crearUsuario">
          <div class="input-group">
            <label for="usuario">Nombre de Usuario:</label>
            <input type="text" id="usuario" v-model="nuevoUsuario.usuario" required />
          </div>

          <div class="input-group">
            <label for="clave">Contraseña:</label>
            <input type="password" id="clave" v-model="nuevoUsuario.clave" required />
          </div>

          <div class="input-group">
            <label for="rol">Rol:</label>
            <select id="rol" v-model="nuevoUsuario.rol">
              <option value="admin">Admin</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>

          <button type="submit">Crear Usuario</button>
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
  name: "CrearUsuarioView",
  data() {
    return {
      nuevoUsuario: {
        usuario: "",
        clave: "",
        rol: "usuario"
      },
      mensaje: "",
      esExito: false
    };
  },
  methods: {
    async crearUsuario() {
      try {
        this.mensaje = "";
       await axios.post("usuarios", this.nuevoUsuario);

        this.mensaje = "✅ Usuario creado con éxito.";
        this.esExito = true;
        this.nuevoUsuario = { usuario: "", clave: "", rol: "usuario" };

        setTimeout(() => {
          this.mensaje = "";
        }, 3000);

        alert("Usuario creado con éxito");
      } catch (error) {
        this.mensaje = error.response?.data?.mensaje || "❌ Error al crear usuario.";
        this.esExito = false;
      }
    },
    volver() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
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

/* 🔹 Título centrado fuera del recuadro */
.titulo-principal {
  text-align: center;
  font-size: 32px;
  margin-top: 60px;
  margin-bottom: 30px;
  color: #333;
}

/* 🔹 Contenedor del formulario */
.crear-usuario-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* 🔹 Estilos internos */
.crear-usuario {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.crear-usuario label {
  font-weight: bold;
}

.crear-usuario input,
.crear-usuario select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.crear-usuario button {
  padding: 12px;
  margin-top: 10px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}

.crear-usuario button:hover {
  background-color: #004494;
}

/* 🔹 Mensajes */
.mensaje-exito {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}

.mensaje-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
}
</style>
