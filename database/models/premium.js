    const mongoose = require('mongoose');


    const channeldb = new mongoose.Schema({
        userID: { type: String, required: true },
        date: { type: String, required: false },
        expires: { type: Number, default: new Date().getTime() },
        count: { type: Number, required: false },

    })
    const premium = module.exports = mongoose.model('premium', channeldb)