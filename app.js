const logger = require('./js/logger');
const proxyService = require('./js/proxy-service');
const listService = require('./js/list-service');
const locationService = require('./js/location-service');
const phoneService = require('./js/phone-service');

        // proxyService.proxyRequest({
        //     url: 'http://ingatlan.com/elado+haz?page=2',
        //     headers: {
        //         'Cache-Control': 'no-cache',
        //         'X-Requested-With': 'XMLHttpRequest',
        //     },
        // }, (err, res, body) => {
        //     if (err){
        //         logger.error(err.message);
        //     }else{
        //         console.log(body.slice(0,255));
        //     }
        // });

// locationService.getLocation(23040153);
// locationService.getLocation(23129911);
// locationService.getLocation(23135993);
// phoneService.getPhone(20902357);