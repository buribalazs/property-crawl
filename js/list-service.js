const logger = require('./logger');
const request = require('request');
const proxyService = require('./proxy-service');
const cheerio = require('cheerio');
const db = require('./db-service');
const House = require('./model/House');
const DEFAULT_TIMEOUT = 3500, COOL_TIMEOUT = 17000;


let currentPage = 1;
let lastPage = undefined;
let timeout = DEFAULT_TIMEOUT;

function walk() {
    logger.log('LISTSERVICE: processing list page', currentPage);
    request({
        url: 'http://ingatlan.com/lista/elado?page=' + currentPage,
        headers: {
            'Cache-Control': 'no-cache',
            'X-Requested-With': 'XMLHttpRequest',
        },
    }, (err, res, html) => {
        if (err) {
            logger.error('LISTSERVICE: ', err.message);
            timeout = COOL_TIMEOUT;
            nextPage(true);
        } else {
            timeout = DEFAULT_TIMEOUT + parseInt(Math.random() * DEFAULT_TIMEOUT);
            let $ = cheerio.load(html, {decodeEntities: false});
            let lastPageTmp = Math.ceil(parseInt($('.results-num').text().replace(/\D/g, '')) / 20);
            if (!lastPageTmp) {
                logger.dump('LISTSERVICE: lastpage string not found', html);
            }
            lastPage = lastPage || lastPageTmp;
            let houses = [];
            $('.search-results tbody tr.list-row').each((i, item) => {
                item = $(item);
                try {
                    let now = new Date();
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
                        firstSeen: now,
                        lastSeen: now,
                        name: name.text().trim(),
                        price: Number(item.find('.price-huf').text().match(/[0-9.]/g).join('')),
                        houseSize: houseSize,
                        landSize: landSize,
                        roomCount: roomCount,
                        agency: office || undefined,
                        thumb: $(item.find('.ad-thumb')).attr('src'),
                    };
                    houses.push(data);
                } catch (e) {
                    logger.error('LISTSERVICE: ', res.statusCode, e.message);
                    logger.dump('LISTSERVICE: list page parse error', html);
                }
            });

            let idsOnPage = houses.map(d => d.id);
            House.find({id: {$in: idsOnPage}}, (err, res) => {
                let foundIds = res.map(d => d.id);
                let newHouses = houses.filter(d => !foundIds.includes(d.id));
                if (newHouses.length) {
                    House.collection.insert(newHouses, (err, res) => {
                        logger.log('LISTSERVICE: ', res.insertedCount, 'items added to db');
                        nextPage();
                    });
                } else {
                    console.log('nothing new');
                    nextPage();
                }
                res.filter(oldItem => idsOnPage.includes(oldItem.id)).forEach(oldItem => {
                    let newData = houses.find(newItem => newItem.id === oldItem.id);
                    let changed = false;
                    if (!oldItem.firstSeen){
                        oldItem.firstSeen = new Date();
                        changed = true;
                    }
                    oldItem.lastSeen = new Date();
                    if (!oldItem.priceHistory || !oldItem.priceHistory.length){
                        changed = true;
                        oldItem.priceHistory = [{price:oldItem.price, date:new Date()}];
                    }
                    if(oldItem.price !== newData.price){
                        changed = true;
                        oldItem.priceHistory.push({price:newData.price, date:new Date()});
                    }
                    if (changed){
                        logger.log('updated', oldItem.id, oldItem.priceHistory);
                        oldItem.save();
                    }
                });
            });
        }
    });
}

function nextPage(err) {
    if (!err) {
        currentPage++;
    }
    if (currentPage <= lastPage) {
        logger.log('LISTSERVICE: walk after ' + timeout + ' ms');
    } else {
        logger.log('LISTSERVICE: last page reached', lastPage);
        currentPage = 0;
    }
    setTimeout(walk, timeout);
}

walk();

