const request = require('request');
const cheerio = require('cheerio');

const UPDATE_FREQ = 3600000;
const COOL_TIME = 28800000;

let lastUpdate = undefined;
let currentProxy = undefined;
let proxies = [];

function getProxy() {

    if (currentProxy) {
        currentProxy.spent = Date.now();
    }

    return new Promise((resolve, reject) => {
        if (!lastUpdate || Date.now() > lastUpdate + UPDATE_FREQ) {
            request('https://free-proxy-list.net/', (err, res, html) => {
                if (!err) {
                    lastUpdate = Date.now();
                    let $ = cheerio.load(html, {decodeEntities: false});
                    $('#proxylisttable tbody tr').each((index, item) => {
                        let tds = $(item).find('td');
                        let result = {
                            ip: $(tds[0]).text().trim(),
                            port: $(tds[1]).text().trim(),
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
        }
    });
}

function findGoodProxy() {
    return new Promise((resolve, reject) => {
        function walk() {
            let proxy = proxies.find(item => item.strikes < 3 && item.lastDead < Date.now() - UPDATE_FREQ && item.spent < Date.now() - COOL_TIME);
            if (!proxy) {
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
                    walk();
                } else if (res.statusCode !== 200) {
                    proxy.strikes++;
                    proxy.lastDead = Date.now();
                    console.log(res.statusCode);
                    walk();
                } else {
                    proxy.strikes = 0;
                    console.log('resolved', proxy);
                    resolve(proxy);
                }
            });
        }

        walk();
    });
}

module.exports = {
    getProxy,
};
