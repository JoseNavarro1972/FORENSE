const webpack = require('webpack');

module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Apunta al backend de Node.js
        changeOrigin: true
      }
    },
    client: {
      overlay: false, // 🔥 Evita mostrar errores de WebSocket en la interfaz
      webSocketURL: {
        protocol: 'ws',
        hostname: 'localhost',
        port: 8080, // Puerto para frontend
        pathname: '/ws'
      }
    },
    port: 8080, // Puerto para frontend
    allowedHosts: "all",
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
    ]
  }
};
