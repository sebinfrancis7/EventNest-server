const Schema = mongoose.Schema;

const organizerSchema = new Schema({
    profile: {
        imageUrl: String,
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    // more details
})

const Organizers = mongoose.model('Customer', organizerSchema);

module.exports = Organizers;