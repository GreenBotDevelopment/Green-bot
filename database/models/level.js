const { number } = require('mathjs');
const mongoose = require('mongoose');
const leveldb = new mongoose.Schema({
    serverID: { type: String, required: true },
    userID: { type: String, required: true },
    xp: { type: Number, required: true },
    level: { type: Number, required: true },
    messagec: { type: Number, required: true },

})
const levelModel = module.exports = mongoose.model('level', leveldb)