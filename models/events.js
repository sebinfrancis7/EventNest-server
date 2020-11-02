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
    tags: [{
        // obejct id??
        type: String,
    }],
    image_url: {
        type: String,
    },
    description: {
        type: String,
    },
}, { timestamps = true });

const Customers = mongoose.model('Customer', costomerSchema);

module.exports = Customers;