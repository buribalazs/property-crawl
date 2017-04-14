const request = require('request');
const proxyService = require('./js/proxy-service');

proxyService.getProxy().then(proxy => {
    console.log(proxy);
    request({
        url: 'http://' + proxy.ip + ':' + proxy.port,
        timeout: 5000,
    }, (err, res, html) => {

        console.log(err, res, html);
    });
}).catch(m => console.log(m));
