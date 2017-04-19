const request = require('request');
const proxyService = require('./js/proxy-service');
const locationService = require('./js/location-service');
const phoneService = require('./js/phone-service');

// proxyService.getProxy().then(proxy => {
//     let count = 0;
//
//     function walk() {
//         request({
//             url: 'http://ingatlan.com/',
//             proxy: 'http://' + proxy.ip + ':' + proxy.port,
//         }, (err) => {
//             if (!err){
//                 count++;
//                 console.log(count);
//                 walk();
//             }else{
//                 console.log(err);
//             }
//         });
//     }
//
//     walk();
// });


// request({
//     // url: 'http://ingatlan.com/',
//     // proxy: 'http://5.135.195.166:3128',
//     proxy: 'http://80.241.221.23:1081',
//     url: 'http://ingatlan.com',
//     headers: {
//         'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36'
//     },
//     timeout: 5000,
// }, (err, res, body) => {
//     if (err) {
//         console.log(err.message, err.statusCode);
//     } else {
//         console.log(res.statusCode, body.slice(0,512));
//     }
// });

locationService.getLocation(23135993);
// phoneService.getPhone(20902357);




setTimeout(() => undefined, 100000000);
