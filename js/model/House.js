const mongoose = require('mongoose');

const houseSchema = new mongoose.Schema({
    id: Number,
    name: String,
    propertyType: String,
    price: Number,
    houseSize: Number,
    landSize: Number,
    roomCount: String,
    location: Object,
    agency: String,
    thumb: String,
    phones: Array,
});

const House = mongoose.model('house', houseSchema);

module.exports = House;