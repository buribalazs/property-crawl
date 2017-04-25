const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');


const houseSchema = new mongoose.Schema({
    id: Number,
    firstSeen: Date,
    lastSeen: Date,
    name: String,
    propertyType: String,
    price: Number,
    priceHistory: [{
        price:Number,
        date:Date,
    }],
    houseSize: Number,
    landSize: Number,
    roomCount: String,
    location: Object,
    loc: Array,
    agency: String,
    thumb: String,
    phones: Array,
});

houseSchema.plugin(mongoosastic);

const House = mongoose.model('house', houseSchema);

module.exports = House;