const mongoose = require('mongoose');


const channeldb = new mongoose.Schema({
    serverID: { type: String, required: true },
    channelID: { type: String, required: true },
    categoryID: { type: String, required: false },
    size: { type: String, required: false },

})
const temp = module.exports = mongoose.model('temps', channeldb)