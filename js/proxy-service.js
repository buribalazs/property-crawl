const logger = require('./logger');
const request = require('request');
const cheerio = require('cheerio');

const UPDATE_FREQ = 3600000;
const COOL_TIME = 28800000;

let lastUpdate = undefined;
let currentProxy = undefined;
let proxies = [];

function getProxy() {
    return new Promise((resolve, reject) => {
        if (currentProxy) {
            return resolve(currentProxy)
        }
        if (!lastUpdate || Date.now() > lastUpdate + UPDATE_FREQ) {
            request('https://free-proxy-list.net/', (err, res, html) => {
                if (err){
                    logger.error('proxy list site not available', err.message);
                }
                else {
                    logger.log('downloading proxy list');
                    lastUpdate = Date.now();
                    let $ = cheerio.load(html, {decodeEntities: false});
                    $('#proxylisttable tbody tr').each((index, item) => {
                        let tds = $(item).find('td');
                        let result = {
                            ip: $(tds[0]).text().trim(),
                            port: $(tds[1]).text().trim(),
                            code: $(tds[2]).text().trim(),
                            strikes: 0,
                            lastDead: 0,
                            spent: 0,
                        };
                        if (!$(tds[4]).text().includes('transparent') && !proxies.some(item => item.ip === result.ip)) {
                            proxies.push(result);
                        }
                    });
                }
                findGoodProxy().then(resolve).catch(reject);
            });
        } else {
            findGoodProxy().then(resolve).catch(reject);
        }
    });
}

function findGoodProxy() {
    return new Promise((resolve, reject) => {
        function walk() {
            let proxy = proxies.find(item => item.strikes < 3 && item.lastDead < Date.now() - UPDATE_FREQ && item.spent < Date.now() - COOL_TIME);
            if (!proxy) {
                lastUpdate = 0;
                logger.error('no proxy available');
                return reject('no proxy available');
            }
            request({
                url: 'http://ingatlan.com',
                proxy: 'http://' + proxy.ip + ':' + proxy.port,
                timeout: 5000,
            }, (err, res) => {
                if (err) {
                    proxy.strikes++;
                    proxy.lastDead = Date.now();
                    logger.warn('proxy error ' + err.message, proxyInfo(proxy));
                    walk();
                } else if (res.statusCode !== 200) {
                    proxy.strikes++;
                    proxy.lastDead = Date.now();
                    logger.warn('proxy error ' + res.statusCode, proxyInfo(proxy));
                    walk();
                } else {
                    proxy.strikes = 0;
                    logger.log('proxy found', proxyInfo(proxy));
                    currentProxy = proxy;
                    resolve(proxy);
                }
            });
        }

        walk();
    });
}

function proxyRequest(cfg, fn) {
    function walk() {
        getProxy().then(proxy => {
            cfg.proxy = 'http://' + proxy.ip + ':' + proxy.port;
            cfg.timeout = 10000;
            request(cfg, (err, res, body) => {
                if (err || (res && res.statusCode !== 200)) {
                    logger.warn('proxy spent', proxyInfo(proxy), (err || {}).message, (res || {}).statusCode);
                    proxySpent(proxy);
                    return walk();
                }
                logger.log('good proxy', proxyInfo(proxy));
                fn(err, res, body);
            });

        }).catch(fn);
    }

    walk();
}

function proxySpent(proxy) {
    proxy.spent = Date.now();
    currentProxy = undefined;
}

function proxyInfo(proxy) {
    proxy = proxy || {};
    return proxy.ip + ':' + proxy.port + ' ' + proxy.code;
}

module.exports = {
    proxyRequest,
};
