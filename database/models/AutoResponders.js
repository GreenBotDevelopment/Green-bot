const mongoose = require('mongoose');


const channeldb = new mongoose.Schema({
    serverID: { type: String, required: false },
    channelID: { type: String, required: false },
    message_reaction: { type: String, required: false },
    id: { type: String, required: false },
    message: { type: String, required: false },
    del: { type: String, required: false },
    inv: { type: String, required: false },
})
const AutoResponders = module.exports = mongoose.model('AutoResponders', channeldb)