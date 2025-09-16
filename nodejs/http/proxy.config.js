  export default {
    server: {
      port: 3000,
      host: 'localhost',
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          pathRewrite: { '^/api': '' },
        },
      },
    }
  }