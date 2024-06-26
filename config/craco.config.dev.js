const CracoLessPlugin = require('craco-less');

// dev环境的配置
module.exports = {
  devServer: {
    port: 8000,
    proxy: {
      '/api': {
        target: 'https://test-trade.checkcat450.me/tradebot',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
  plugins: [{ plugin: CracoLessPlugin }],
};
