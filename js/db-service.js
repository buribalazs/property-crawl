const logger = require('./logger');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/propertyDB');
const db = mongoose.connection;

db.on('error', logger.error.bind(logger, 'connection error:'));

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        logger.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports = db;