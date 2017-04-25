const mongoose = require('mongoose'),
    mongoosastic = require('mongoosastic'),
    House = require('./js/model/House');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/propertyDB', {user:'app', pass:'kalap'});


let stream = House.synchronize();
let count = 0;

stream.on('data', function(err, doc){
    count++;
    console.log(count);
});
stream.on('close', function(){
    console.log('indexed ' + count + ' documents!');
});
stream.on('error', function(err){
    console.log(err);
});