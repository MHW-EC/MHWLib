const path = require('path');

const packageJson = require('./package.json');

const PATHS = {
  app: path.join(__dirname, "src"),
  build: path.join(__dirname, "dist")
}

module.exports = {
  target: 'node',
  entry: './src/index.js',
  output: {
    path: PATHS.build,
    library: packageJson.name,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    filename: `${packageJson.name.toLowerCase()}.js`,
  },
  node: {
    fs: 'empty',
    child_process: 'empty'
  }
};
