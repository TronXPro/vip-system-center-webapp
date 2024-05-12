const CracoLessPlugin = require('craco-less');
const webpack = require('webpack');

// dev环境的配置

module.exports = {
  devServer: {
    port: 8000,
    // proxy: {
    //   '/api': {
    //     target: 'https://api.gas52.com/',
    //     changeOrigin: true,
    //   }
    // }
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
  // devServer: {
  //   port: 8000,
  //   proxy: {
  //     '/api': {
  //       // target: 'https://test-trade.checkcat450.me',
  //       target: 'http://localhost:8081',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/api': '',
  //       },
  //     },
  //   },
  // },
  // webpack: {
  //   configure: (webpackConfig) => {
  //     webpackConfig.plugins.push(
  //       new webpack.DefinePlugin({
  //         'process.env.REACT_APP_API_URL': JSON.stringify('https://test-trade.checkcat450.me/tradebot'),
  //       })
  //     );

  //     return webpackConfig;
  //   },
  // },
  plugins: [{ plugin: CracoLessPlugin }],
};
