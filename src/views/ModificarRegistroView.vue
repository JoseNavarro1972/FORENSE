<template>
  <div>
    <!-- Botón volver fijo en la esquina superior derecha -->
    <button class="boton-volver" @click="volver">Volver</button>

    <!-- Título centrado y fuera del recuadro -->
    <h1 class="titulo-modificar">Actualizar Registro para Modificar</h1>

    <!-- Contenedor del formulario y resultados -->
    <div class="modificar-container">
      <form @submit.prevent="buscar">
        <input type="text" v-model="criterio" placeholder="Ingrese ID o RUC" required />
        <button type="submit">Buscar</button>
      </form>

      <table v-if="resultados.length">
        <thead>
          <tr>
            <th>ID Ingreso</th>
            <th>RUC</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="registro in resultados" :key="registro.id_ingreso">
            <td @click="editarRegistro(registro.id_ingreso)" style="cursor: pointer; color: blue;">
              {{ registro.id_ingreso }}
            </td>
            <td>{{ registro.causa_ruc_ingreso }}</td>
            <td>{{ registro.estado }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      criterio: "",
      resultados: [],
    };
  },
  methods: {
    async buscar() {
      try {
        const sessionToken = localStorage.getItem('session_token');
        const response = await axios.post("http://localhost:3002/api/buscar-modificar", {
          criterio: this.criterio
        }, {
          headers: {
            'Content-Type': 'application/json',
            'X-Session-Token': sessionToken || ''
          }
        });
        this.resultados = response.data.resultados;
      } catch (error) {
        console.error("Error al buscar:", error);
        alert("Error al comunicarse con el servidor. Verifique que el servidor esté activo.");
      }
    },
    editarRegistro(id) {
      this.$router.push({ name: "EditarIngreso", params: { id_ingreso: id } });
    },
    volver() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
/* 🔹 Botón volver fijo arriba a la derecha */
.boton-volver {
  position: absolute;
  top: 20px;
  right: 200px; /* Modificado para separarlo del botón de cerrar sesión */
  padding: 8px 12px;
  background-color: #9da89d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  z-index: 9999;
}

.boton-volver:hover {
  background-color: #0056b3;
}

/* 🔹 Título fuera del recuadro, centrado */
.titulo-modificar {
  text-align: center;
  font-size: 36px;
  font-weight: bold;
  color: #333;
  margin-top: 60px;
  margin-bottom: 30px;
}

/* 🔹 Recuadro gris con contenido */
.modificar-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* 🔹 Formulario */
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

input[type="text"] {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

button[type="submit"] {
  padding: 12px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button[type="submit"]:hover {
  background-color: #004494;
}

/* 🔹 Tabla */
table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
}

thead {
  background-color: #0056b3;
  color: white;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

td:hover {
  background-color: #f1f1f1;
  cursor: pointer;
}
</style>
