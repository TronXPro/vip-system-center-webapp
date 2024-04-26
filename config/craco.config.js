const CracoLessPlugin = require("craco-less");
const webpack = require('webpack');

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
      '/api': 'http://localhost:2626/'
    }
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new webpack.DefinePlugin({
          'process.env.REACT_APP_API_URL': JSON.stringify('https://test-trade.checkcat450.me/tradebot'),
        })
      );

      return webpackConfig;
    },
  },
  plugins: [{ plugin: CracoLessPlugin }],
};