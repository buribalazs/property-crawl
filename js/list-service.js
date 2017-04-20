const logger = require('./logger');
const request = require('request');
const proxyService = require('./proxy-service');
const cheerio = require('cheerio');
const db = require('./db-service');
const House = require('./model/House');

House.find({id: {$in: [1, 2]}}, 'id', (err, res) => {
    console.log(err, res);
});

let currentPage = 1;
let lastPage = 1;

// proxyService.proxyRequest({
function walk() {
    logger.log('processing list page', currentPage);
    request({
        url: 'http://ingatlan.com/lista/elado+lakas+obuda?page=' + currentPage,
        headers: {
            'Cache-Control': 'no-cache',
            'X-Requested-With': 'XMLHttpRequest',
        },
    }, (err, res, html) => {
        if (err) {
            logger.error(err.message);
        } else {
            let $ = cheerio.load(html, {decodeEntities: false});
            lastPage = Math.ceil(parseInt($('.results-num').text().replace(/\D/g, '')) / 20);
            let houses = [];
            $('.search-results tbody tr.list-row').each((i, item) => {
                item = $(item);

                let name = item.find('td.address');
                name.find('div').html('');
                name.find('span').text((i, d) => d + ' ');
                let nums = item.find('td.centered');
                let houseSize = Number($(nums[1]).text().match(/[0-9.]/g).join(''));
                let landSize = $(nums[2]).text();
                landSize = landSize.includes(' m') ? Number(landSize.match(/[0-9.]/g).join('')) || undefined : undefined;
                let roomCount = item.find('td.roomcount').text().trim();
                let office = item.find('.office-logo-link');
                office = (($(office).attr('href') || '').match(/\/\/[^.]*\./) || [''])[0].replace('//', '').replace('.', '');

                let data = {
                    id: parseInt(item.attr('data-id')),
                    name: name.text().trim(),
                    price: Number(item.find('.price-huf').text().match(/[0-9.]/g).join('')),
                    houseSize: houseSize,
                    landSize: landSize,
                    roomCount: roomCount,
                    agency: office || undefined,
                    thumb: $(item.find('.ad-thumb')).attr('src'),
                };
                houses.push(data);
            });

            let idsOnPage = houses.map(d => d.id);
            House.find({id: {$in: idsOnPage}}, 'id', (err, res) => {
                res = res.map(d => d.id);
                houses = houses.filter(d => !res.includes(d.id));
                if (houses.length) {
                    House.collection.insert(houses, (err, res) => {
                        logger.log(res.insertedCount, 'items added to db');
                        nextPage();
                    });
                } else {
                    console.log('nothing new'); //todo check for price changes!
                    nextPage();
                }
            });
        }
    });
}

function nextPage(){
    currentPage++;
    if (currentPage <= lastPage){
        walk();
    }
}

walk();

