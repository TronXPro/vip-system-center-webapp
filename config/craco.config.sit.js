const CracoLessPlugin = require('craco-less');

// dev环境的配置
module.exports = {
  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    },
  },
  plugins: [{ plugin: CracoLessPlugin }],
};
