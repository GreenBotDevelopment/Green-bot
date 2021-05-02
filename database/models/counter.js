const mongoose = require('mongoose');
const counterdb = new mongoose.Schema({
    serverID: { type: String, required: false },
    MembersID: { type: String, required: false },
    BotsID: { type: String, required: false },
    totalID: { type: String, required: false },


})
const counter = module.exports = mongoose.model('counter', counterdb)