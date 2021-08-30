const mongoose = require('mongoose');
const rrdb = new mongoose.Schema({
    userID: { type: String, required: false },

    Date: { type: Date, required: false },


})
const birthday = module.exports = mongoose.model('birthday', rrdb)