const webpack = require('webpack');
const config = require('./config');

function watch({
  root,
  env = 'development',
  sourceMaps = false,
}) {
  config({
    root,
    env,
    sourceMaps,
  })
    .then((webpackConfig) => {
      webpack(webpackConfig).watch({}, (err, stats) => {
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

module.exports = watch;
