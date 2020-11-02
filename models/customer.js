const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const costomerSchema = new Schema({
    profile: {
        imageUrl: String,
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    tags: {
        type
    }
    //facebook auth?? 
}, { timestamps = true });

const Customers = mongoose.model('Customer', costomerSchema);

module.exports = Customers;