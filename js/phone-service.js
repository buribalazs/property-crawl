const request = require('request');
const cheerio = require('cheerio');

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
    request({
            proxy: 'http://5.135.195.166:3128',
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
            if(err){
                console.log(err.message);
            }
            console.log(res.statusCode);
        });
}

module.exports = {
    getPhone
};