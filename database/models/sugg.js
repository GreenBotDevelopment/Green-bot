const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    autorID: { type: String, required: false },
    messageID: { type: String, required: false },
    serverID: { type: String, required: false },

    content: { type: String, required: false },
    Date: { type: String, required: false },



})
const sugg = module.exports = mongoose.model('sugg', rrdb)