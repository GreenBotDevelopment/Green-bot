const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    UnserID: { type: String, required: false },
    bio: { type: String, required: false },
    credits: { type: String, required: false },
    premium: { type: String, required: false },
    rep: { type: String, required: false },
})
const UserRpg = module.exports = mongoose.model('aserrpg', rrdb)
