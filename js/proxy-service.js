const request = require('request');
const cheerio = require('cheerio');

const UPDATE_FREQ = 3600000;

let lastUpdate = undefined;
let proxies = [];

function getProxy() {
    return new Promise((resolve, reject) => {
        if (!lastUpdate || new Date().getTime > lastUpdate + UPDATE_FREQ) {
            request('https://free-proxy-list.net/', (err, res, html) => {
                if (!err) {
                    let $ = cheerio.load(html, {decodeEntities: false});
                    $('#proxylisttable tbody tr').each((index, item) => {
                        let tds = $(item).find('td');
                        let result = {
                            ip: $(tds[0]).text().trim(),
                            port: $(tds[1]).text().trim(),
                        };
                        if (!proxies.some(item => item.ip === result.ip)) {
                            proxies.push(result);
                        }
                    });
                }
                findGoodProxy().then(resolve).catch(reject);
            });
        }
    });
}

function findGoodProxy(){
    return new Promise((resolve, reject) => {

    });
}

module.exports = {
    getProxy,
};
