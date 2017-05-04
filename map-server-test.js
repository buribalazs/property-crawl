const PORT = 5556;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/propertyDB', {user: 'euedge', pass: 'asd'});
const db = mongoose.connection;
const House = require('./js/model/House');

db.on('error', e => console.log('db connection error: ', e.message));

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

let express = require('express');
let app = express();
app.use(express.static('public'));

app.get('/points', function (request, response) {
    try {
        let box = JSON.parse(request.query.q);
        box = !!box.length ? box : [box];
        House.aggregate([
                {$match: {"loc": {"$geoWithin": {"$box": box}}}},
                {$sample: {size: 2500}}
            ], (err, result) => {
            response.send(result.map(house => house.loc));
        });
    } catch (e) {
        console.log(e.message);
        response.send([0]);
    }
});

app.listen(PORT, function () {
    console.log(`Example app listening on port ${PORT}!`)
});

House.count({}, (err, res) => console.log(err, res));