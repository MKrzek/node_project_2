const path = require('path');

console.log('paaa', path.dirname(process.mainModule.filename));

module.exports = path.dirname(process.mainModule.filename);
