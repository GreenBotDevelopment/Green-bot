import { Schema, model } from "mongoose";

const guildSchemaData = new Schema({
    serverID: { type: String, required: true },
    prefix: { type: String, required: true, default: "*" },
    auto_autoplay: { type: Boolean, required: false, default: false },
    vote_skip: { type: Boolean, required: false, default: true },
    buttons: { type: Boolean, required: false, default: true },
    goodPremium: { type: String, required: false, },
    requestChannel: { type: String, required: false, },
    requestMessage: { type: String, required: false, },
    defaultVolume: { type: String, required: false, default: 50 },
    vcs: { type: Array, required: false, default: [] },
    txts: { type: Array, required: false, default: [] },
    auto_shuffle: { type: String, required: false, },
    djroles: { type: Array, required: false, default: [] },
    h24: { type: String, required: false, },
    announce: { type: String, required: false, default: true },
    socket: { type: [], required: false, default: [] },
    noticed_slash: { type: Number, required: false, default: 0 },
    dj_commands: {
        type: Array,
        required: false,
        default: ["autoplay", "back", "clearqueue", "forceskip", "forward", "givedj", "jump", "leavecleanup", "loop", "move", "pause", "resume", "remove", "removedupes", "leave", "replay", "rewind", "seek", "shuffle", "stop", "volume"],
    },
    textchannel: { type: String, required: false, default: true },
});

const guildSchema = model("guildData", guildSchemaData);
export { guildSchema }
