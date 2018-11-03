#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));

const root = process.cwd();
const options = Object.assign({ root }, argv);

// normalize snake casing & booleans
Object.keys(options).forEach((key) => {
  let value = options[key];
  if (value === 'true' || value === 'false') {
    value = value === 'true';
  }
  options[key] = value;
  options[camel(key)] = value;
});
delete options._;

switch (argv._[0]) {
  case 'build': {
    require('./build')(options);
    break;
  }
  case 'watch': {
    require('./watch')(options);
    break;
  }
  default: {
    console.error('Unknown command.');
    break;
  }
}

// utils

function camel(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(letter, index) {
    return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
  }).replace(/-/g, '');
}
