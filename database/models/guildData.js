const mongoose = require('mongoose');
const { Prefix, Color, defaultLanguage, categories } = require('../../config');
const channeldb = new mongoose.Schema({
    serverID: { type: String, required: true },
    prefix: { type: String, required: true, default: Prefix },
    lang: { type: String, required: false, default: defaultLanguage.toLowerCase() },
    premium: { type: String, required: false, default: null },
    premiumUserID: { type: String, required: false, default: null },
    chatbot: { type: String, required: false, default: null },
    ignored_channel: { type: String, required: false, default: null },
    admin_role: { type: String, required: false, default: null },
    games_enabled: { type: Boolean, required: false, default: null },
    util_enabled: { type: Boolean, required: false, default: true },
    autorole: { type: String, required: false, default: null },
    autorole_bot: { type: String, required: false, default: null },
    dj_role: { type: String, required: false, default: null },
    count: { type: String, required: false, default: null },
    autopost: { type: String, required: false, default: null },
    suggestions: { type: String, required: false, default: null },
    color: { type: String, required: false, default: Color },
    backlist: { type: String, required: false, default: false },
    autonick: { type: String, required: false, default: null },
    autonick_bot: { type: String, required: false, default: null },
    autoplay: { type: String, required: false, default: null },
    song: { type: String, required: false, default: null },
    plugins: {
        type: Object,
        default: {
            welcome: {
                status: false,
                message: null,
                channel: null,
                image: false
            },
            goodbye: {
                status: false,
                message: null,
                channel: null,
                image: false
            },
            autoping: {
                status: false,
                message: null,
                channel: null,
                image: false
            },
        }
    },
    protections: {
        type: Object,
        default: {
            anti_maj: {
                status: false,
                message: null,
                channel: null,
                image: false
            },
            anti_spam: {
                status: false,
                message: null,
                channel: null,
                image: false
            },
            anti_mentions: {
                status: false,
                message: null,
                channel: null,
                image: false
            },
            anti_dc: {
                status: false,
                message: null,
                channel: null,
                image: false
            },
            anti_pub: null,
            antiraid_logs: null
        }
    },
})
const guildData = module.exports = mongoose.model('guildData', channeldb)