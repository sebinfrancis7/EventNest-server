const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const customerSchema = new Schema({
    imageUrl: String,
    display_name: {
        type: String,
        trim: true,
    },
    email: String,
    purcahses: [{
        event: {
            type: Schema.Types.ObjectId,
            ref: 'events',
        },
        tickets: Number,
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'events',
    }],
    facebookId: [{
        type: String,
    }]
}, { timestamps = true });

User.customerSchema(passportLocalMongoose);

const Customers = mongoose.model('Customer', customerSchema);

module.exports = Customers;