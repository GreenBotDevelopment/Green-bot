const { createClientVars } = require("../util/functions")
const { Player } = require("discord-player");
const util = require("util")
const { GiveawaysManager } = require("discord-giveaways");
const vvoice = require("discord-voice");
const config = require("../config")
const dbTemps = require("quick.db");

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
        this.guildInvites = new Map()
        this.wait = util.promisify(setTimeout)
        this.queue = new Map()
        const e = new vvoice(this, config.database.MongoURL);
        this.discordVoice = e
        this.commands = new Collection()
        this.dbTemps = dbTemps;
      
        const manager = new GiveawaysManager(this, {  storage: './giveaways.json', updateCountdownEvery: 19e3, default: { botsCanWin: !1, exemptPermissions: [], embedColorEnd: "#ED360E", embedColor: "#3A871F", reaction: "🎁" } });
        this.manager = manager
    }
}
module.exports = GreenBot;
