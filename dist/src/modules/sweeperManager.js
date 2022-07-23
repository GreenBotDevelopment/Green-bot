"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sweeperManager = void 0;
class sweeperManager {
    constructor(client, options) {
        this.client = client;
        this.options = options;
        this._setup();
    }
    _setup() {
        if (this.options.timeout === 0)
            return;
        setInterval(() => {
            this.sweep();
            this.client.shards.forEach(shard => {
                shard.editStatus("online", { name: this.options.changeStatus, type: 3 });
            });
        }, this.options.timeout);
    }
    sweep() {
        if (this.options.sweep.includes("guildMembers"))
            this.sweepMembers();
        if (this.options.sweep.includes("emojis"))
            this.sweepMembers();
        if (this.options.sweep.includes("stickers"))
            this.sweepStickers();
        if (this.options.sweep.includes("useless"))
            this.sweepUseless();
        if (this.options.sweep.includes("guildCategories"))
            this.sweepGuildCategories();
        if (this.options.sweep.includes("client"))
            this.sweepClient();
    }
    _baseSweep(func) {
        this.client.guilds.forEach(guild => {
            func(guild);
        });
    }
    sweepMembers() {
        return this._baseSweep((g) => {
            g.members.forEach(m => {
                if (!m.voiceState.channelID && m.id !== this.client.user.id)
                    g.members.delete(m.id);
            });
        });
    }
    sweepStickers() {
        return this._baseSweep((g) => {
            g.stickers.length = 0;
        });
    }
    sweepEmojis() {
        return this._baseSweep((g) => {
            g.emojis.length = 0;
        });
    }
    sweepUseless() {
        return this._baseSweep((g) => {
            g.afkChannelID = null;
            g.afkTimeout = null;
            g.description = null;
            g.features = null;
        });
    }
    sweepGuildCategories() {
        return this._baseSweep((g) => {
            g.channels.forEach(c => {
                if (c.type === 4 /* ChannelTypes.GUILD_CATEGORY */)
                    return g.channels.delete(c.id);
            });
        });
    }
    sweepClient() {
        this.client.relationships.limit = 0;
        this.client.shoukaku.cooldowns.length = 0;
        this.client.database.premiumCache.length = 0;
        return true;
    }
}
exports.sweeperManager = sweeperManager;
