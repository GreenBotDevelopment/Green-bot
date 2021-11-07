const { createClientVars } = require("../util/functions")
const { Player } = require("discord-player");
const util = require("util")
const { Client, Collection } = require("discord.js")
class GreenBot extends Client {
    constructor(options) {
        super(options);
        createClientVars(this);
        this.player = new Player(this, {
            leaveOnEnd: !1,
            leaveOnStop: !0,
            leaveOnEmpty: !0,
            enableLive: !0,
            ytdlDownloadOptions: {
                quality: 'highest',
                filter: 'audioonly',
            },
            timeout: 0,
            volume: 65,
            quality: "high"
        });
        this.wait = util.promisify(setTimeout)
        this.queue = new Map()
        this.commands = new Collection()
    }
}
module.exports = GreenBot;