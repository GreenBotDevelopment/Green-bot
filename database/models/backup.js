const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    autorID: { type: String, required: false },
    MessageID: { type: String, required: false },
    RealID: { type: String, required: false },
    Date: { type: String, required: false },
    Size: { type: String, required: false },
    ChannelsCount: { type: String, required: false },
    RoleCount: { type: String, required: false },


})
const Backup = module.exports = mongoose.model('backup', rrdb)