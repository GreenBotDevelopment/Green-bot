const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    serverID: { type: String, required: true },
    description: { type: String, required: false },
    content: { type: String, required: true },
    reason: { type: String, required: true },
})
const guild = module.exports = mongoose.model('guild', rrdb)