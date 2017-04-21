const fsUtil = require('./fs-util');
const winston = require('winston');
const logger = new (winston.Logger)({
    level: 'info',
    colorize: true,
    transports: [
        new (winston.transports.Console)({colorize: true}),
        new (winston.transports.File)({filename: './logs/property-crawl.log'})
    ]
});

fsUtil.mkdir('logs/dump');

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
    dump: (msg, body) => {
        logger.warn('DUMP: ' + msg + ' on ' + new Date());
        let dumpLogger = new (winston.Logger)({
            level: 'info',
            transports: [
                new (winston.transports.File)({filename: './logs/dump/' + encodeURI(msg) + '-' + new Date().toISOString() + '.log'}),
            ]
        });
        dumpLogger.info(body.slice(0,512));
    },
};

