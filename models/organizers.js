var mongoose = require('mongoosee');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const organizerSchema = new Schema({
    profile: {
        imageUrl: String,
        name: {
            type: String,
            required: true,
            trim: true,
        },
        events: [{
            type: Schema.Types.ObjectId,
            ref: 'events',
        }],
    },
    // more details
});

organizerSchema.plugin(passportLocalMongoose);

const Organizers = mongoose.model('Organizer', organizerSchema);

module.exports = Organizers;