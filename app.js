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

proxyService.getProxy();
// locationService.getLocation(23040153);
// locationService.getLocation(23129911);
// locationService.getLocation(23135993);
// phoneService.getPhone(20902357);

setTimeout(() => undefined, 100000000);
