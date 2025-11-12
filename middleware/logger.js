let morgan = require('morgan');

morgan.token('time', function (req, res) {
     return new Date(); // Logs current time in ISO format
});

const logger = morgan(':method :url :status :res[content-length] - :response-time ms :time');

module.exports = logger;