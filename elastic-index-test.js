const mongoose = require('mongoose'),
    mongoosastic = require('mongoosastic'),
    ProgressBar = require('progress');
House = require('./js/model/House');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/propertyDB', {user: 'app', pass: 'kalap'});


let stream = House.synchronize();
let count = 0;
House.count({}, (err, res) => {
    if (res) {
        console.log(res + ' total documents');
        let bar = new ProgressBar('  indexing [:bar]', {
            complete: '=',
            incomplete: ' ',
            width: 70,
            total: res
        });

        stream.on('data', function (err, doc) {
            count++;
            bar.tick();
        });
        stream.on('close', function () {
            console.log(' indexed ' + count + ' documents!');
            process.exit(0);
        });
        stream.on('error', function (err) {
            console.log(err);
        });
    }
});
