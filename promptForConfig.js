var prompt = require('prompt');
var gulpconfig = require('./gulpconfig.json');

var schema = {
    properties: {
      wabDeploymentPaths: {
        pattern: /\[.*\]/,
        message: 'Array expected',
        default: "[" + gulpconfig.wabDeploymentPaths + "]",
        required: true
      }
    }
  };
 
  prompt.start();
  prompt.get(schema, function (err, result) {
    console.log('Command-line input received:');
    console.log('  wabDeploymentPaths: ' + result.wabDeploymentPaths);
    gulpconfig.wabDeploymentPaths = result.wabDeploymentPaths;
  });