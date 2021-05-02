const mongoose = require('mongoose');
const cmddb = new mongoose.Schema({
    serverID: { type: String, required: true },
    text: { type: String, required: true },
    name: { type: String, required: true },
    displayHelp: { type: String, required: true },
    deleteMessage: { type: String, required: true },

})
const CmdModel = module.exports = mongoose.model('cmd', cmddb)