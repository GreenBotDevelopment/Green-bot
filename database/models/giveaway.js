const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    serverID: { type: String, required: false },
    MessageID: { type: String, required: false },
    requiredRole: { type: String, required: false },
    requiredInvites: { type: String, required: false },
    requiredMessages: { type: String, required: false },
})
const giveawayModel = module.exports = mongoose.model('giveaway', rrdb)