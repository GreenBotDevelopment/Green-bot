const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    serverID: { type: String, required: false },
    name: { type: String, required: false },

})
const reactPanel = module.exports = mongoose.model('reactPanel', rrdb)