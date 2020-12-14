const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    serverID: { type: String, required: false },
    roleID: { type: String, required: false },
    reaction: { type: String, required: true },
    level: { type: String, required: false },
    messagec: { type: String, required: false },

})
const RRModel = module.exports = mongoose.model('rr', rrdb)