const mongoose = require('mongoose');


const channeldb = new mongoose.Schema({
    serverID: { type: String, required: true },

    roleID: { type: String, required: false },
    level: { type: String, required: false },

    reason: { type: String, required: true },
})
const rolesRewards = module.exports = mongoose.model('rolesRewards', channeldb)