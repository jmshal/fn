module.exports = (options) => {
  console.log(`
Usage: fn [command] [options]

  Commands:

    watch [options] <path>   Starts webpack in development watch mode
    build [options] <path>   Builds the function app for production

  Options:

    -h, --help                   Output usage information
    -e, --env <string>           Sets the environment/mode (eg. production)
    -s, --source-maps <boolean>  Path for output directory
`);
};
