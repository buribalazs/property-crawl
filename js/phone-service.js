const logger = require('./logger');
const request = require('request');
const cheerio = require('cheerio');
const House = require('./model/House');

const DEFAULT_TIMEOUT = 500, COOL_TIMEOUT = 2300;

let timeout = DEFAULT_TIMEOUT;

const reqHeaders = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
    'Pragma': 'no-cache',
    'Origin': 'http://ingatlan.com/',
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'hu-HU,hu;q=0.8,en-US;q=0.6,en;q=0.4',
    'Content-Type': 'application/json',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'http://ingatlan.com/'
};

function getPhone(id) {
    return new Promise((resolve, reject) => {
        request({
                url: 'http://ingatlan.com/detailspage/api/' + id,
                method: 'PUT',
                json: {
                    "id": id,
                    "is_favourite": false,
                    "is_hidden": false,
                    "is_phone_number_visible": true,
                    "phone_numbers": []
                },
                headers: reqHeaders,
                gzip: true,
            },
            (err, res, body) => {
                if (err) {
                    timeout = COOL_TIMEOUT;
                    logger.error('phoneService:', err.message);
                    reject('PHONESERVICE:', e.message, id);
                } else {
                    timeout = DEFAULT_TIMEOUT + parseInt(Math.random() * DEFAULT_TIMEOUT / 1.2);
                    try{
                        resolve(body.phone_numbers);
                    }catch(e){
                        reject(e.message);
                    }
                }
            });
    });
}

function walk() {
    House.findOne({phones: {$exists: false}}, (err, house) => {
        console.log('found house without phones', house.id);
        getPhone(house.id).then(phones => {
                house.phones = phones;
                house.save();
                logger.log('PHONESERVICE added phones to', house.id);
                setTimeout(walk, timeout);
            }).catch(e => {
                logger.error('PHONESERVICE error parsing phones', e.message, e.id);
                setTimeout(walk, timeout);
        });
    });
}

walk();