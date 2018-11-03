const webpack = require('webpack');
const config = require('./config');

function build({
  root,
  env = 'production',
  sourceMaps = true,
}) {
  config({
    root,
    env,
    sourceMaps,
  })
    .then((webpackConfig) => {
      webpack(webpackConfig, (err, stats) => {
        if (err) {
          console.error(err);
        } else {
          console.log(stats.toString({
            chunks: false,
            colors: true,
          }));
        }
      });
    });
}

module.exports = build;
