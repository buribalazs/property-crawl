const mongoose = require('mongoose');
const House = require('./js/model/House');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/propertyDB', {user: 'app', pass: 'kalap'});

House.find({
    $and: [
        {location: {$exists: true}}
    ]
}, (err, res) => {
    console.log(res.length);
    let count = 1;
    res.forEach(item => {
        if (!item.location.error) {
            item.loc = [item.location.longitude, item.location.latitude];
        } else {
            delete item.loc;
        }
        item.save();
        console.log(count++);
    })
});

