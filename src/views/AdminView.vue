<template>
  <div class="admin-menu">
    <!-- 🔧 Barra superior con botones -->
    <div class="barra-superior">
      <button class="boton-volver" @click="volver">Volver</button>
    </div>

    <h1>Panel de Administración</h1>
    <p>Bienvenido, {{ usuario.username }} (Admin)</p>

    <div class="container">
      <button @click="irA('ingreso')">INGRESO REGISTRO</button>
      <button @click="irA('modificar-registro')">MODIFICAR REGISTRO</button>
      <button @click="irA('consulta')">CONSULTAR REGISTRO</button>
      <button @click="irA('crear-usuario')">CREAR USUARIO</button>
      <button @click="irA('eliminar-usuario')">ELIMINAR USUARIO</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "AdminView",
  data() {
    return {
      usuario: JSON.parse(localStorage.getItem("usuario")) || {}
    };
  },
  methods: {
    irA(pagina) {
      this.$router.push(`/${pagina}`);
    },
    volver() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
.admin-menu {
  text-align: center;
  padding: 80px 20px 20px; /* espacio para la barra superior fija */
}

.barra-superior {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  position: fixed;
  top: 0;
  right: 0;
  background-color: transparent;
  z-index: 9999;
}

/* Botón Volver */
.boton-volver {
  padding: 10px 15px;
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

button {
  display: block;
  width: 250px;
  margin: 10px auto;
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
  background: #6e6dca;
  color: white;
  border: none;
  border-radius: 5px;
}

button:hover {
  background: #5d5cb4;
}
</style>
