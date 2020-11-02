// ********** 
//
// build a custom recommendation engine, how??
// 
// **********

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const costomerSchema = new Schema({
    organizer: {
        type: Schema.Types.ObjectId,
        ref: 'organizer',
        required: true
    },
    title: {
        type: String,
    },
    category: {
        type: String,
    },
    city: {
        type: String,
    },
    venue_addr: {
        type: String,
    },
    image_url: {
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    facebook_page: {
        type: String,
    },
    attendees: {
        type: Number,
        default: 0,
    }
}, { timestamps = true });

const Customers = mongoose.model('Customer', costomerSchema);

module.exports = Customers;