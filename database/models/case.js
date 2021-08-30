const mongoose = require('mongoose');
const channeldb = new mongoose.Schema({
    serverID: { type: String, required: false },
    id: { type: String, required: false },
    targetID: { type: String, required: false },
    sanction: { type: String, required: false },
    reason: { type: String, required: false },
    mod: { type: String, required: false },

})
const Case = module.exports = mongoose.model('case', channeldb)