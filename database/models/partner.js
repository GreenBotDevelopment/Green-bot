const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    serverID: { type: String, required: true },
    description: { type: String, required: false },
    argent: { type: String, required: true },
    reason: { type: String, required: false },
    
})
const partner = module.exports = mongoose.model('partner', rrdb)
