const winston = require('winston');
const logger = new (winston.Logger)({
    level: 'info',
    colorize: true,
    transports: [
        new (winston.transports.Console)({colorize: true}),
        new (winston.transports.File)({filename: 'property-crawl.log'})
    ]
});

module.exports = {
    log: (...a) => {
        logger.info(a.join(', '))
    },
    error: (...a) => {
        logger.error(a.join(', '))
    },
    warn: (...a) => {
        logger.warn(a.join(', '))
    },
};

