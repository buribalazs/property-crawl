const mongoose = require('mongoose');
const fs = require('fs');
const fsUtil = require('./js/fs-util');
const db = require('./js/db-service');
const House = require('./js/model/House');
const ProgressBar = require('progress');

const QUERY = {location: {$exists: true}, propertyType: {$exists:true}};

const colDef = [
    {id: d => d.id},
    {propertyType: d => d.propertyType},
    {name: d => d.name},
    {thumb: d => d.thumb},
    {price: d => d.price},
    {houseSize: d => d.houseSize},
    {landSize: d => d.landSize},
    {roomCount: d => d.roomCount},
    {agency: d => d.agency},
    {county: d => d.location.county},
    {city: d => d.location.city},
    {district: d => d.location.district},
    {zone: d => d.location.zone},
    {street: d => d.location.street},
    {latitude: d => d.location.latitude},
    {longitude: d => d.location.longitude},
];

function writeLn(fd, arr) {
    fs.write(fd, arr.join('\t') + '\n', null, 'utf8');
}

function writeHeader(fd, colDef) {
    writeLn(fd, colDef.map(col => Object.keys(col)[0]));
}

function writeData(fd, colDef, row) {
    writeLn(fd, colDef.map(col => col[Object.keys(col)[0]](row)));
}

fsUtil.touchFileOnPath('/temp/export.tsv').then(() => {
    fs.open('./temp/export.tsv', 'w', (err, fd) => {
        if (err) {
            console.log(err.message);
        } else {
            writeHeader(fd, colDef);
            House.count(QUERY, (err, count) => {
                let bar = new ProgressBar('  writing [:bar] :current / :total', {
                    complete: '=',
                    incomplete: ' ',
                    width: 70,
                    total: count,
                });
                let stream = House.find(QUERY).cursor();

                stream.on('data', function (doc) {
                    writeData(fd, colDef, doc);
                    bar.tick();
                }).on('error', function (err) {
                    // handle the error
                }).on('close', function () {
                    console.log('DONE');
                    fs.close(fd);
                    process.exit(0);
                });
            });
        }
    });
}).catch(e => console.log);



