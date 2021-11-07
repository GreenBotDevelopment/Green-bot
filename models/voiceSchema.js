const mongoose = require('mongoose');
const channeldb = new mongoose.Schema({
    serverID: { type: String, required: true },
    channelID: { type: String, required: true },
})
const voiceSchema = module.exports = mongoose.model('voiceSchema', channeldb)