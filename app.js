const request = require('request');
const proxyService = require('./js/proxy-service');

proxyService.getProxy().then(proxy => {
    let count = 0;

    function walk() {
        request({
            url: 'http://ingatlan.com/',
            proxy: 'http://' + proxy.ip + ':' + proxy.port,
        }, (err) => {
            if (!err){
                count++;
                console.log(count);
                walk();
            }else{
                console.log(err);
            }
        });
    }

    walk();
});
