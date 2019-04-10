const prompt = require('prompt');
const jsonfile = require('jsonfile')
const gulpconfigPath = './gulpconfig.json';

function startPrompt(gulpconfig) {
    var schema = {
        properties: {
          wabPaths: {
            pattern: /\[.*\]/,
            message: 'Array expected',
            default: JSON.stringify(gulpconfig.wabPaths),
            required: false
          }
        }
      };
    prompt.start();
    prompt.get(schema, function (err, result) {
        console.log('Command-line input received:');
        console.log('  wabPaths: ' + result.wabPaths);
        try {
            gulpconfig.wabPaths = JSON.parse(result.wabPaths).replace("\\", "/");

            const file = './gulpconfig.json';
            jsonfile.writeFile(file, gulpconfig)
            .then(res => {
                console.log('Write complete')
            })
            .catch(error => console.error("Write error: ", error));
        } catch (err) {
            console.dir(err);
        }
    });
}


// Main
jsonfile.readFile(gulpconfigPath)
    .then(gulpconfig => startPrompt(gulpconfig))
    .catch(error => console.error("Read error: ", error)); 
