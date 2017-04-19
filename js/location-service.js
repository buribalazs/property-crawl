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
            // proxy: 'http://5.135.195.166:3128',
            url: 'http://ingatlan.com/detailspage/map?id=' + id + '&beforeAction=true',
            headers: reqHeaders,
            gzip: true,
        },
        (err, res, body) => {
            if (body) {
                let $ = cheerio.load(body, {decodeEntities: false});
                let locationTypes = extractLocationTypes(body);
                let address = {};
                let addressItems = $('a');
                addressItems.each((i, d) => {
                    let addressItem = locationTypes.find(item => item.locationId + '' === d.attribs['data-location-id']);
                    address[addressItem.category.toLowerCase()] = $(d).text().trim();
                    if (i === addressItems.length - 1) {
                        // console.log(addressItem.geometry.coordinates, addressItem.type, addressItem.bbox);
                        if (!addressItem.bbox) {
                            address.longitude = addressItem.geometry.coordinates[0];
                            address.latitude = addressItem.geometry.coordinates[1];
                        } else {
                            let bbox = addressItem.bbox.split(',').map(val => Number(val));
                            address.latitude = bbox[1] + Math.abs(bbox[3] - bbox[1]) / 2;
                            address.longitude = bbox[0] + Math.abs(bbox[2] - bbox[0]) / 2;
                        }
                    }
                });
                console.log(address);
            }
        });
}


function extractLocationTypes(body) {
    let json = body.slice(body.indexOf('"features":') + 11);
    json = json.slice(0, json.indexOf('});'));
    return JSON.parse(json).filter(i => i.properties.locationId).map(i => ({
        name: i.name,
        category: i.category,
        locationId: i.locationId,
        geometry: i.geometry,
        type: i.properties.type,
        bbox: i.properties.bbox,
    }));
}

module.exports = {
    getLocation
};