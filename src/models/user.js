const mongoose = require("mongoose"),
    channeldb = new mongoose.Schema({
        userID: { type: String, required: !0 },
        playlists: { type: Array, required: !0 },
        songs: { type: Array, required: false,default:[]},
    }),
   user = (module.exports = mongoose.model("user", channeldb));
