const mongoose = require('mongoose');


const channeldb = new mongoose.Schema({
    serverID: { type: String, required: false },
    channelID: { type: String, required: false },
    message_reaction: { type: String, required: false },
    id: { type: String, required: false },
    reaction: { type: String, required: false },
})
const AutoReactions = module.exports = mongoose.model('AutoReactions', channeldb)