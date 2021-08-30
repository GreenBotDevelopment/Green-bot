const mongoose = require('mongoose');
const channeldb = new mongoose.Schema({
    userID: { type: String, required: false },
    time: { type: String, required: false },
    reason: { type: String, required: false },
    ends_at: { type: String, required: false },
    lang: { type: String, required: false },

})
const Rmd = module.exports = mongoose.model('remind', channeldb)