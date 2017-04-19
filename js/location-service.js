const request = require('request');
const cheerio = require('cheerio');

const reqHeaders = {
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.110 Safari/537.36',
    'Pragma': 'no-cache',
    'Accept-Encoding': 'gzip, deflate, sdch',
    'Accept-Language': 'hu-HU,hu;q=0.8,en-US;q=0.6,en;q=0.4',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': '*/*',
    'Cache-Control': 'no-cache',
    'X-Requested-With': 'XMLHttpRequest',
    'Referer': 'http://ingatlan.com/'
};

function getLocation(id) {
    console.log(id);
    request({
            url: 'http://ingatlan.com/detailspage/map?id=' + id + '&beforeAction=true',
            headers: reqHeaders,
            gzip: true,
        },
        (err, res, body) => {
            if (body) {
                let $ = cheerio.load(body, {decodeEntities: false});
                let address = '';
                $('a').each((i, d) => address += $(d).text());
                address = address.trim().replace(/ +/g, ' ');
                let bbox = $('#details-map').attr('data-bbox').split(',').map(val => Number(val));
                let midPoint = [bbox[1] + Math.abs(bbox[3] - bbox[1]) / 2, bbox[0] + Math.abs(bbox[2] - bbox[0]) / 2];
                console.log(address, midPoint);
            }
        });
}

module.exports = {
    getLocation
};