const path = require('path');
const fs = require('fs');
const find = require('find');
const VirtualModulePlugin = require('virtual-module-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const functionFile = 'function.json';
const mainFile = 'main.js';

module.exports = ({
  root: rootPath,
  env,
  sourceMaps = false,
}) => {
  return new Promise((resolve) => {
    const srcPath = path.resolve(rootPath, './src');
    const buildPath = path.resolve(rootPath, './build');
    const typescriptPath = path.resolve(rootPath, './node_modules/typescript');

    find.file(
      new RegExp(functionFile.replace(/\./, '\\.') + '$'),
      srcPath,
      (functionJsonPaths) => {
        const functions = functionJsonPaths.map((functionJsonPath) => {
          const functionName = path.basename(path.dirname(functionJsonPath));
          const functionPath = path.resolve(functionJsonPath, '../');
          const relativeFunctionPath = './' + functionPath.substring(srcPath.length + 1);
          return {
            name: functionName,
            path: relativeFunctionPath,
          };
        });

        const plugins = [];

        plugins.push(new VirtualModulePlugin({
          moduleName: 'src/index.js',
          contents: `
            module.exports = {
              ${functions.map(({ name, path }) => (`
                "${name}": (function () { var f = require("${path}"); return f.default || f; })(),
              `)).join('\n')}
            };`
        }));

        plugins.push(new CopyPlugin(
          functions.map(({ name, path: functionPath }) => ({
            from: path.join(srcPath, functionPath, functionFile),
            to: `${name}/${functionFile}`,
            transform: (content) => {
              const parsed = JSON.parse(content.toString());
              Object.assign(parsed, {
                _originalEntryPoint: false,
                _originalScriptFile: 'index.js',
                scriptFile: '../' + mainFile,
                entryPoint: name,
              });
              return JSON.stringify(parsed, null, 2);
            },
          }))
        ));

        const jsonFiles = [
          'extensions.csproj',
          'host.json',
          'proxies.json',
          env === 'development' ? 'local.settings.json' : null,
        ].filter(Boolean).filter((jsonFileName) => {
          try {
            const jsonFilePath = path.resolve(rootPath, jsonFileName);
            return fs.existsSync(jsonFilePath);
          } catch (err) {
            return false;
          }
        });

        plugins.push(new CopyPlugin(
          jsonFiles.map(file => ({
            from: file,
            to: file,
          }))
        ));

        const config = {
          mode: env,
          devtool: sourceMaps ? 'source-map' : false,
          target: 'node',
          context: rootPath,
          entry: './src/index.js',
          output: {
            path: buildPath,
            filename: mainFile,
            libraryTarget: 'commonjs',
          },
          resolve: {
            extensions: ['.ts', '.js'],
          },
          module: {
            rules: [
              {
                test: /\.ts$/,
                loader: require.resolve('awesome-typescript-loader'),
                options: {
                  compiler: typescriptPath,
                },
              },
            ],
          },
          plugins,
        };

        resolve(config);
      }
    );
  });
};
