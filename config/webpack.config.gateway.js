const merge = require('webpack-merge');
const deployedConfig = require('./webpack.config.deployed');

module.exports = merge(deployedConfig, {
  output: {
    publicPath: '/bmo-v0/',
  },
});
