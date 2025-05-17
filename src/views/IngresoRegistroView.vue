<template>
  <div>
      <div class="botones-superior">
        <button @click="volver" class="boton-volver">Volver</button>
      </div>

       <h1 class="titulo-principal">REGISTRO ANÁLISIS FORENSE</h1>

       <div class="crear-usuario-container">
      <div v-if="idLocal" class="mensaje-id">
        <p><strong>Nro. Registro:</strong> {{ idLocal }}</p>
      </div>

      <form @submit.prevent="registrarIngreso" class="crear-usuario">
        <div class="form-grid">
          <div class="input-group">
            <label for="nro_registro">NRO. REGISTRO</label>
            <input type="text" id="nro_registro" :value="idLocal || 'Pendiente...'" readonly />
          </div>

          <div class="input-group" v-for="clave in ordenCampos" :key="clave">
            <label :for="clave">{{ formLabels[clave] || clave }}</label>

            <template v-if="getInputType(clave) === 'select'">
              <select :id="clave" v-model="form[clave]">
                <option value="">Seleccione...</option>
                <option v-for="opcion in selectFields[clave]" :key="opcion" :value="opcion">
                  {{ opcion }}
                </option>
              </select>
            </template>

            <template v-else>
              <input
                :type="getInputAttributes(clave).type"
                :id="clave"
                v-model="form[clave]"
                v-bind="getInputAttributes(clave)"
              />
            </template>
          </div>

          <div class="input-group observaciones-group">
            <label for="observaciones">OBSERVACIONES</label>
            <textarea id="observaciones" v-model="form.observaciones"></textarea>
          </div>
        </div>

        <button type="submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? "Procesando..." : (idLocal ? "Actualizar" : "Registrar") }}
        </button>
      </form>

      <p v-if="message" :class="{ 'mensaje-exito': success, 'mensaje-error': !success }">
        {{ message }}
      </p>
    </div>
  </div>
</template>


<script>
import axios from "axios";

export default {
  props: ['id_ingreso'],
  data() {
    return {
      idLocal: null,
      form: {
        orden_judicial: "",
        fecha_recepcion: "",
        nombre_perito: "",
        grado_perito: "",
        oficio_remisor: "",
        fecha_oficio: "",
        ruc: "",
        fecha_instruccion_particular: "",
        fiscalia: "",
        tribunal_garantia: "",
        fecha_autorizacion_orden_judicial: "",
        nombre_juez_autoriza: "",
        nue: "",
        seccion: "",
        nro_parte: "",
        fecha_parte: "",
        delito: "",
        marca: "",
        modelo: "",
        nombre_imputado: "",
        cedula_identidad: "",
        nro_telefono: "",
        tipo_extraccion: "",
        nro_informe_extraccion: "",
        fecha_informe_extraccion: "",
        nro_informe_analisis: "",
        fecha_informe_analisis: "",
        tipo_solicitud: "",
        region: "",
        dia_plazo: null,
        prorroga: "",
        cant_celular: null,
        cant_extracciones: null,
        estado_evidencia: "",
        resultado: "",
        observaciones: ""
      },
      message: "",
      success: false,
      loading: false,
      formLabels: {
        orden_judicial: "ORDEN JUDICIAL",
        fecha_recepcion: "FECHA RECEPCIÓN",
        nombre_perito: "NOMBRE PERITO",
        grado_perito: "GRADO PERITO",
        oficio_remisor: "OFICIO REMISOR",
        fecha_oficio: "FECHA OFICIO",
        ruc: "R.U.C.",
        fecha_instruccion_particular: "FECHA INSTRUCCIÓN PARTICULAR",
        fiscalia: "FISCALÍA",
        tribunal_garantia: "TRIBUNAL DE GARANTÍA",
        fecha_autorizacion_orden_judicial: "FECHA AUTORIZACIÓN ORDEN JUDICIAL",
        nombre_juez_autoriza: "NOMBRE JUEZ AUTORIZA",
        nue: "N.U.E.",
        seccion: "SECCIÓN",
        nro_parte: "N° PARTE",
        fecha_parte: "FECHA PARTE",
        delito: "DELITO",
        marca: "MARCA",
        modelo: "MODELO",
        nombre_imputado: "NOMBRE IMPUTADO",
        cedula_identidad: "CÉDULA IDENTIDAD",
        nro_telefono: "N° TELÉFONO",
        tipo_extraccion: "TIPO EXTRACCIÓN",
        nro_informe_extraccion: "N° INFORME RESUMEN EXTRACCIÓN",
        fecha_informe_extraccion: "FECHA INFORME RESUMEN EXTRACCIÓN",
        nro_informe_analisis: "N° INFORME ANÁLISIS",
        fecha_informe_analisis: "FECHA INFORME ANÁLISIS",
        tipo_solicitud: "TIPO SOLICITUD",
        region: "REGIÓN",
        dia_plazo: "DÍA PLAZO",
        prorroga: "PRÓRROGA",
        cant_celular: "CANT. CELULAR",
        cant_extracciones: "CANT. EXTRACCIONES",
        estado_evidencia: "ESTADO DE LA EVIDENCIA",
        resultado: "RESULTADO"
      },
      ordenCampos: [
        "orden_judicial", "fecha_recepcion", "nombre_perito", "grado_perito",
        "oficio_remisor", "fecha_oficio", "ruc", "fecha_instruccion_particular",
        "fiscalia", "tribunal_garantia", "fecha_autorizacion_orden_judicial", "nombre_juez_autoriza",
        "nue", "seccion", "nro_parte", "fecha_parte",
        "delito", "marca", "modelo", "nombre_imputado",
        "cedula_identidad", "nro_telefono", "tipo_extraccion", "nro_informe_extraccion",
        "fecha_informe_extraccion", "nro_informe_analisis", "fecha_informe_analisis", "tipo_solicitud",
        "region", "dia_plazo", "prorroga", "cant_celular",
        "cant_extracciones", "estado_evidencia", "resultado"
      ],
      selectFields: {
        estado_evidencia: ["Recibida", "En Proceso", "Finalizada", "Entregada"],
        tipo_solicitud: ["Extraccion", "Analisis", "Extraccion/Analisis"],
        resultado: ["Positivo", "Negativo", "Pendiente"],
        region: ["Metropolitana", "Valparaiso"]
      }
    };
  },
  computed: {
    todayDate() {
      const today = new Date();
      return today.toISOString().split("T")[0];
    }
  },
  async mounted() {
    if (this.$route.params.id_ingreso) {
      this.idLocal = this.$route.params.id_ingreso;
      await this.cargarDatosIngreso();
    }
  },
  methods: {
    async cargarDatosIngreso() {
      try {
        const sessionToken = localStorage.getItem('session_token');
        const res = await axios.get(`http://localhost:3002/api/ingresos/${this.idLocal}`, {
          headers: {
            'X-Session-Token': sessionToken || ''
          }
        });
        
        if (res.data) {
          console.log("Datos recibidos del servidor:", res.data);
          
          // Mapear explícitamente los campos del servidor al formulario
          // para asegurar que todos los campos se asignen correctamente
          const mapeo = {
            // Campos de identificación
            id_ingreso: "id_ingreso",
            
            // Campos básicos
            nue: "nue",
            ruc: "ruc",
            orden_judicial: "orden_judicial",
            
            // Fechas
            fecha_recepcion: "fecha_recepcion",
            fecha_oficio: "fecha_oficio",
            fecha_instruccion_particular: "fecha_instruccion_particular",
            fecha_autorizacion_orden_judicial: "fecha_autorizacion_orden_judicial",
            fecha_parte: "fecha_parte",
            fecha_informe_extraccion: "fecha_informe_extraccion",
            fecha_informe_analisis: "fecha_informe_analisis",
            prorroga: "prorroga",
            
            // Personal
            nombre_perito: "nombre_perito",
            grado_perito: "grado_perito",
            nombre_juez_autoriza: "nombre_juez_autoriza",
            
            // Documentación
            oficio_remisor: "oficio_remisor",
            nro_parte: "nro_parte",
            
            // Judicial
            fiscalia: "fiscalia",
            tribunal_garantia: "tribunal_garantia",
            
            // Técnicos
            seccion: "seccion",
            delito: "delito",
            marca: "marca",
            modelo: "modelo",
            nombre_imputado: "nombre_imputado",
            cedula_identidad: "cedula_identidad",
            nro_telefono: "numero_telefono_ingreso", // Corregido: usamos el nombre real de la BD
            tipo_extraccion: "tipo_extraccion",
            nro_informe_extraccion: "nro_informe_extraccion",
            nro_informe_analisis: "nro_informe_analisis",
            tipo_solicitud: "tipo_solicitud",
            region: "region",
            dia_plazo: "dia_plazo",
            cant_celular: "cant_celular",
            cant_extracciones: "cant_extracciones",
            
            // Estado
            estado_evidencia: "estado_evidencia",
            resultado: "resultado",
            
            // Otros
            observaciones: "observaciones"
          };
          
          // Recorrer el mapeo y asignar valores
          Object.keys(mapeo).forEach(campoForm => {
            const campoServer = mapeo[campoForm];
            if (res.data[campoServer] !== undefined) {
              console.log(`✅ Asignando ${campoServer} → ${campoForm}: ${res.data[campoServer]}`);
              
              // Convertir fechas al formato YYYY-MM-DD
              if (typeof res.data[campoServer] === 'string' && res.data[campoServer].includes('T')) {
                const date = new Date(res.data[campoServer]);
                this.form[campoForm] = date.toISOString().split('T')[0];
              } else {
                this.form[campoForm] = res.data[campoServer];
              }
            }
          });
          
          // También guardamos el ID explícitamente (por si acaso)
          this.form.id_ingreso = res.data.id_ingreso;
          
          // Verificamos que no nos falte ningún campo importante
          console.log("✓ Campos cargados en el formulario:", this.form);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        this.message = "Error al cargar los datos del registro.";
        this.success = false;
        
        if (error.response && error.response.status === 404) {
          this.message = "El registro solicitado no existe.";
        }
      }
    },
    getInputType(clave) {
      if (Object.keys(this.selectFields).includes(clave)) return "select";
      const dateFields = [
        "fecha_parte", "fecha_recepcion", "fecha_oficio",
        "fecha_informe_extraccion", "fecha_informe_analisis",
        "fecha_instruccion_particular", "fecha_autorizacion_orden_judicial", "prorroga"
      ];
      const numberFields = ["cant_celular", "cant_extracciones", "dia_plazo"];
      if (dateFields.includes(clave)) return "date";
      if (numberFields.includes(clave)) return "number";
      return "text";
    },
    getInputAttributes(clave) {
      const dateFields = [
        "fecha_parte", "fecha_recepcion", "fecha_oficio",
        "fecha_informe_extraccion", "fecha_informe_analisis",
        "fecha_instruccion_particular", "fecha_autorizacion_orden_judicial", "prorroga"
      ];
      const numberFields = ["cant_celular", "cant_extracciones", "dia_plazo"];
      if (dateFields.includes(clave)) return { type: "date", max: this.todayDate };
      if (numberFields.includes(clave)) return { type: "number" };
      return { type: "text" };
    },
    resetForm() {
      this.form = JSON.parse(JSON.stringify(this.$options.data().form));
      this.idLocal = null;
    },
    async registrarIngreso() {
      this.loading = true;
      this.message = "";
      
      try {
        // Log para depuración - ver valores actuales en el formulario
        console.log("Valores en formulario antes de enviar:");
        console.log("NUE:", this.form.nue);
        console.log("RUC:", this.form.ruc);
        
        // Crear objeto con mapeo de nombres de campos frontend -> backend
        // IMPORTANTE: Usar directamente el formato interno de la base de datos
        const datosEnviar = {
          // Campos de identificación
          id_ingreso: this.idLocal,
          
          // CAMPOS CRÍTICOS - asegurar que estén presentes
          nue_ingreso: this.form.nue || '',
          causa_ruc_ingreso: this.form.ruc || '',
          
          // Campos de estado
          estado_pericia: this.form.estado_evidencia || 'Recibida',
          estado_evidencia: this.form.estado_evidencia || 'Recibida',
          
          // Fechas
          fecha_recepcion_ingreso: this.form.fecha_recepcion || null,
          fecha_oficio: this.form.fecha_oficio || null,
          fecha_ip_ingreso: this.form.fecha_instruccion_particular || null,
          fecha_orden_judicial_ingreso: this.form.fecha_autorizacion_orden_judicial || null,
          fecha_parte: this.form.fecha_parte || null,
          fecha_informe_extraccion: this.form.fecha_informe_extraccion || null,
          fecha_informe_analisis: this.form.fecha_informe_analisis || null,
          prorroga: this.form.prorroga || null,
          
          // Datos personales
          nombre_perito_ingreso: this.form.nombre_perito || '',
          grado_perito_ingreso: this.form.grado_perito || '',
          nombre_juez_ingreso: this.form.nombre_juez_autoriza || '',
          
          // Documentos
          oficio_remisor: this.form.oficio_remisor || '',
          nro_parte: this.form.nro_parte || '',
          
          // Información judicial
          fiscalia_ingreso: this.form.fiscalia || '',
          tribunal_garantia_ingreso: this.form.tribunal_garantia || '',
          orden_judicial: this.form.orden_judicial || '',
          
          // Información técnica
          marca_ingreso: this.form.marca || '',
          modelo_ingreso: this.form.modelo || '',
          numero_telefono_ingreso: this.form.nro_telefono || '', // Agregado campo que faltaba
          tipo_extraccion: this.form.tipo_extraccion || '',
          nro_informe_extraccion: this.form.nro_informe_extraccion || '',
          nro_informe_analisis: this.form.nro_informe_analisis || '',
          tipo_solicitud: this.form.tipo_solicitud || '',
          plazo_pericia_ingreso: this.form.dia_plazo || null,
          cant_celular: this.form.cant_celular || null,
          cant_extracciones: this.form.cant_extracciones || null,
          resultado: this.form.resultado || '',
          
          // Otros datos
          observaciones: this.form.observaciones || '',
          
          // ID de usuario requerido
          id_usuario: 1
        };
        
        // No eliminar valores vacíos, ya que algunos podrían ser campos obligatorios
        // En lugar de eso, establecer valores por defecto arriba
        
        console.log("Enviando datos al servidor:", datosEnviar);
        
        // Verificar campos críticos
        if (!datosEnviar.nue_ingreso || !datosEnviar.causa_ruc_ingreso) {
          console.error("❌ Campos críticos faltantes:", {
            nue_ingreso: datosEnviar.nue_ingreso,
            causa_ruc_ingreso: datosEnviar.causa_ruc_ingreso
          });
          this.message = "Error: Falta NUE o RUC. Por favor, complete estos campos.";
          this.success = false;
          this.loading = false;
          return;
        }
        
        const sessionToken = localStorage.getItem('session_token');
        const response = await axios.post(
          "http://localhost:3002/api/ingresos",
          datosEnviar,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-Session-Token': sessionToken || ''
            }
          }
        );
        
        if (response.data.success) {
          this.success = true;
          this.message = this.idLocal 
            ? "Registro actualizado con éxito." 
            : "Registro creado con éxito.";
            
          // Si es un nuevo registro, actualizar el ID
          if (!this.idLocal && response.data.id_ingreso) {
            this.idLocal = response.data.id_ingreso;
          }
          
          // Si es un nuevo registro, limpiar el formulario después de cierto tiempo
          if (!this.idLocal) {
            setTimeout(() => {
              this.resetForm();
              this.message = "";
            }, 3000);
          }
        } else {
          this.success = false;
          this.message = response.data.message || "Error al procesar el registro.";
        }
      } catch (error) {
        this.success = false;
        console.error("Error en la operación:", error);
        
        if (error.response) {
          console.error("Respuesta de error:", error.response.data);
          this.message = `Error: ${error.response.data.message || "Error de comunicación con el servidor."}`;
        } else {
          this.message = "Error de comunicación con el servidor.";
        }
      } finally {
        this.loading = false;
      }
    },
    volver() {
      this.$router.go(-1);
    }
  }
};
</script>


<style scoped>
.titulo-principal {
  text-align: center;
  font-size: 28px;
  font-weight: bold;
  margin-top: 60px;
  margin-bottom: 30px;
  color: #333;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  width: 100%;
  margin-bottom: 20px;
}

.crear-usuario-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 30px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
}

.title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
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

.boton-volver {
  padding: 8px 12px;
  background-color: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.boton-volver:hover {
  background-color: #5a6268;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 5px;
}

.input-group label {
  font-weight: bold;
  color: #555;
  margin-bottom: 1px;
  font-size: 11px;
  text-transform: uppercase;
}

input[type="text"],
input[type="date"],
input[type="number"],
select,
textarea {
  width: 100%;
  padding: 4px;
  margin-top: 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 12px;
  box-sizing: border-box;
}

input[readonly] {
  background-color: #e9ecef;
  cursor: not-allowed;
}

textarea#delito {
  height: 26px;
  min-height: 26px;
  overflow: hidden;
  resize: none;
}

.observaciones-group {
  grid-column: span 4;
}

.observaciones-group textarea {
  min-height: 40px;
}

button[type="submit"] {
  display: block;
  width: 200px;
  padding: 12px;
  margin: 20px auto 0 auto;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

button[type="submit"]:disabled {
  background-color: #a0c3e0;
  cursor: not-allowed;
}

button[type="submit"]:hover:not(:disabled) {
  background-color: #004494;
}

.mensaje-id {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #333;
}

.mensaje-exito {
  color: green;
  text-align: center;
  margin-top: 15px;
}

.mensaje-error {
  color: red;
  text-align: center;
  margin-top: 15px;
}

@media (max-width: 800px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 500px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
  vertical-align: middle;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
