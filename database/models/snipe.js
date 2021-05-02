const { Schema, model } = require("mongoose");
const snipeSchema = Schema({
    guildID: String,
    channel: String, // channel NAME
    id: String,
    channelID: String, // channel ID
    content: String,
    author: {
        tag: String,
        avatar: String,
    },
    embeds: Array,
    attachments: Array,
    createdTimestamp: Number
});
module.exports = model("snipe", snipeSchema);