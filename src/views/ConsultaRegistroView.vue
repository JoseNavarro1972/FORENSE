<template>
  <div class="consulta-registro-container">
    <!-- Botones en la parte superior -->
    <div class="botones-superior">
      <button @click="volver" class="boton-volver">Volver</button>
    </div>
    
    <h1 class="title">CONSULTA DE REGISTROS FORENSES</h1>

    <form @submit.prevent="consultaRegistros" class="consulta-form">
      <div class="bloque-busqueda">
        <!-- FILA -->
        <div class="fila-busqueda" v-for="(label, key) in campos" :key="key">
          <div class="columna-izquierda">
            <label :for="key">{{ label }}</label>
          </div>
          <div class="columna-derecha">
            <template v-if="key === 'fecha_desde_hasta'">
              <input type="date" v-model="criterios.fecha_desde" />
              <span style="margin: 0 5px;">hasta</span>
              <input type="date" v-model="criterios.fecha_hasta" />
            </template>
            <template v-else>
              <input
                :type="key === 'anio' ? 'number' : 'text'"
                :placeholder="label"
                v-model="criterios[key]"
              />
              <button type="button" @click="buscarPor(key)">Buscar</button>
            </template>
          </div>
        </div>

        <!-- Botón para mostrar todos los registros -->
        <div class="fila-botones">
          <button type="button" @click="mostrarTodos" class="boton-mostrar-todos">
            Mostrar Todos los Registros
          </button>
        </div>
      </div>
    </form>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando resultados...</p>
    </div>

    <div v-else-if="resultados.length > 0" class="resultados-container">
      <h2 class="subtitle">Resultados Encontrados:</h2>
      <table class="tabla-resultados">
        <thead>
          <tr>
            <th>NRO. ORDEN</th>
            <th>ID FORENSE</th>
            <th>ESTADO DE LA EVIDENCIA</th>
            <th>FECHA RECEPCION</th>
            <th>CAUSA RUC</th>
            <th>FISCALIA</th>
            <th>FECHA I.P.</th>
            <th>TRIBUNAL DE GARANTIA</th>
            <th>N.U.E</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="resultado in resultados" :key="resultado.id_forense">
            <td>{{ resultado.nro_orden }}</td>
            <td>
              <a :href="`/ingreso_formulario?id=${resultado.id_forense}`">
                {{ resultado.id_forense }}
              </a>
            </td>
            <td>{{ resultado.estado_evidencia }}</td>
            <td>{{ resultado.fecha_recepcion }}</td>
            <td>{{ resultado.causa_ruc }}</td>
            <td>{{ resultado.fiscalia }}</td>
            <td>{{ resultado.fecha_ip }}</td>
            <td>{{ resultado.tribunal_garantia }}</td>
            <td>{{ resultado.nue }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p v-else-if="busquedaRealizada && !loading">
      No se encontraron registros con los criterios especificados.
    </p>

    <p v-if="message" :class="{ 'mensaje-error': !success }">{{ message }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      criterios: {
        fecha_desde: "",
        fecha_hasta: "",
        anio: "",
        estado_evidencia: "",
        nue: "",
        ruc: "",
        marca: "",
        seccion: "",
        fiscalia: ""
      },
      campos: {
        fecha_desde_hasta: "BÚSQUEDA POR FECHA INGRESO",
        anio: "BÚSQUEDA POR AÑO",
        estado_evidencia: "BÚSQUEDA POR ESTADO DE LA EVIDENCIA",
        nue: "BÚSQUEDA POR N.U.E",
        ruc: "BÚSQUEDA POR R.U.C",
        marca: "BÚSQUEDA POR MARCA",
        seccion: "BÚSQUEDA POR SECCIÓN",
        fiscalia: "BÚSQUEDA POR FISCALÍA"
      },
      resultados: [],
      loading: false,
      message: "",
      success: true,
      busquedaRealizada: false
    };
  },
  methods: {
    async consultaRegistros() {
      this.loading = true;
      this.message = "";
      this.resultados = [];
      this.busquedaRealizada = true;

      try {
        // Crear parámetros de consulta
        const params = Object.entries(this.criterios)
          .filter(([, v]) => v !== "")
          .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

        // Obtener el token de sesión
        const sessionToken = localStorage.getItem('session_token');
        
        // URL de la API
        const url = "http://localhost:3002/api/consulta";
        
        console.log("📊 Consultando API con parámetros:", params);
        
        // Realizar la petición
        const response = await axios.get(url, {
          params,
          headers: {
            'X-Session-Token': sessionToken || '',
            'Content-Type': 'application/json'
          }
        });

        console.log("📊 Respuesta recibida:", response.data);

        if (Array.isArray(response.data)) {
          // Procesar resultados si es un array
          this.resultados = response.data;
          this.success = true;
          
          if (this.resultados.length === 0) {
            this.message = "No se encontraron registros con los criterios especificados.";
          }
        } else {
          // Manejar respuesta no esperada
          this.message = "Formato de respuesta inesperado del servidor.";
          this.success = false;
          console.error("Formato de respuesta inesperado:", response.data);
        }
      } catch (error) {
        // Manejar errores de forma más detallada
        console.error("❌ Error en consulta:", error);
        
        this.message = "Error de comunicación con el servidor.";
        
        if (error.response) {
          // Error con respuesta del servidor
          console.error("❌ Datos del error:", error.response.data);
          console.error("❌ Estado:", error.response.status);
          
          if (error.response.data && error.response.data.mensaje) {
            this.message += `: ${error.response.data.mensaje}`;
          }
        } else if (error.request) {
          // Error sin respuesta (no se pudo conectar)
          console.error("❌ No se recibió respuesta. Posible error de conexión.");
          this.message += ": No se pudo conectar con el servidor.";
        } else {
          // Error en la configuración de la solicitud
          console.error("❌ Error al configurar la petición:", error.message);
          this.message += `: ${error.message}`;
        }
        
        this.success = false;
      } finally {
        this.loading = false;
      }
    },
    buscarPor(key) {
      Object.keys(this.criterios).forEach(k => {
        if (k !== key && k !== "fecha_desde" && k !== "fecha_hasta") {
          this.criterios[k] = "";
        }
      });
      this.consultaRegistros();
    },
    mostrarTodos() {
      this.criterios = {
        fecha_desde: "",
        fecha_hasta: "",
        anio: "",
        estado_evidencia: "",
        nue: "",
        ruc: "",
        marca: "",
        seccion: "",
        fiscalia: ""
      };
      this.consultaRegistros();
    },
    volver() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.bloque-busqueda {
  background-color: #f2f2f2;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
}

.fila-busqueda {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.columna-izquierda {
  width: 35%;
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
  color: #333;
}

.columna-derecha {
  width: 65%;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

input[type="text"],
input[type="date"],
input[type="number"] {
  padding: 6px;
  font-size: 13px;
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

button {
  padding: 6px 12px;
  font-size: 13px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #004494;
}

.fila-botones {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.boton-mostrar-todos {
  padding: 8px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.boton-mostrar-todos:hover {
  background-color: #218838;
}

.mensaje-error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

@media (max-width: 800px) {
  .fila-busqueda {
    flex-direction: column;
    align-items: flex-start;
  }
  .columna-izquierda, .columna-derecha {
    width: 100%;
  }
}

.volver-container {
  text-align: right;
  margin-bottom: 10px;
}

.boton-volver {
  position: absolute;
  top: 20px;
  right: 200px; /* Modificado para separarlo del botón de cerrar sesión */
  padding: 8px 12px;
  background-color: #5a6268;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  z-index: 10;
}

.boton-volver:hover {
  background-color: #5a6268;
}

.title {
  text-align: center;
}

.consulta-registro-container {
  padding: 20px 40px; /* espacio a izquierda y derecha */
  max-width: 1200px;
  margin: 0 auto; /* centra todo */
}

.bloque-busqueda {
  background-color: #f2f2f2;
  padding: 20px 30px;
  border-radius: 10px;
  border: 1px solid #ccc;
  max-width: 700px;
  margin: 0 auto 20px auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}

.fila-busqueda {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.columna-izquierda {
  width: 35%;
  font-weight: bold;
  font-size: 13px;
  text-transform: uppercase;
  color: #333;
}

.columna-derecha {
  width: 65%;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

input[type="text"],
input[type="date"],
input[type="number"] {
  padding: 6px;
  font-size: 13px;
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
}

button {
  padding: 6px 12px;
  font-size: 13px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #004494;
}

.fila-botones {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

.mensaje-error {
  color: red;
  font-weight: bold;
  margin-top: 20px;
}

.resultados-container {
  margin-top: 30px;
  padding: 20px 30px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
  padding-left: 10px;
}

.tabla-resultados {
  width: 100%;
  border-collapse: collapse;
  margin-left: 10px;
}

.tabla-resultados th,
.tabla-resultados td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.tabla-resultados th {
  background-color: #e6f0ff;
  font-weight: bold;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  margin-top: 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0056b3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 800px) {
  .fila-busqueda {
    flex-direction: column;
    align-items: flex-start;
  }
  .columna-izquierda,
  .columna-derecha {
    width: 100%;
  }
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
  z-index: 100;
}
</style>
