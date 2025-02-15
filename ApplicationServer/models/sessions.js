const mongoose = require('mongoose');
const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    }
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const session = mongoose.model('session',sessionSchema);

module.exports = session;