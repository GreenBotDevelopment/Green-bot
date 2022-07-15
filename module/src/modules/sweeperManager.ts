import { ChannelTypes } from "discord.js/typings/enums";
import { Guild } from "eris";
import { BaseDiscordClient } from "../BaseDiscordClient";

interface sweeperOptions {
    sweep: Array<"guildMembers" | "stickers" | "emojis" | "useless" | "guildCategories" | "client">;
    timeout: number;
    changeStatus: string;
}

export class sweeperManager {
    private client: BaseDiscordClient;
    public options: sweeperOptions;
    constructor(client: BaseDiscordClient, options: sweeperOptions) {
        this.client = client;
        this.options = options;
        this._setup()
    }

    private _setup() {
        if (this.options.timeout === 0) return;
        setInterval(() => {
            this.sweep();
            this.client.shards.forEach(shard => {
                shard.editStatus("online", { name: this.options.changeStatus, type: 3 })
            })
        }, this.options.timeout)
    }

    private sweep() {
        if (this.options.sweep.includes("guildMembers")) this.sweepMembers();
        if (this.options.sweep.includes("emojis")) this.sweepMembers();
        if (this.options.sweep.includes("stickers")) this.sweepStickers();
        if (this.options.sweep.includes("useless")) this.sweepUseless();
        if (this.options.sweep.includes("guildCategories")) this.sweepGuildCategories();
        if (this.options.sweep.includes("client")) this.sweepClient();
    }

    private _baseSweep(func: Function) {
        this.client.guilds.forEach(guild => {
            func(guild)
        })
    }


    public sweepMembers() {
        return this._baseSweep((g: Guild) => {
            g.members.forEach(m => {
                if (!m.voiceState.channelID && m.id !== this.client.user.id) g.members.delete(m.id)
            })
        })
    }

    public sweepStickers() {
        return this._baseSweep((g: Guild) => {
            g.stickers.length = 0;
        })
    }

    public sweepEmojis() {
        return this._baseSweep((g: Guild) => {
            g.emojis.length = 0;
        })
    }

    public sweepUseless() {
        return this._baseSweep((g: Guild) => {
            g.afkChannelID = null;
            g.afkTimeout = null;
            g.description = null;
            g.features = null;
        })
    }

    public sweepGuildCategories() {
        return this._baseSweep((g: Guild) => {
            g.channels.forEach(c => {
                if (c.type === ChannelTypes.GUILD_CATEGORY) return g.channels.delete(c.id)
            })
        })
    }

    public sweepClient() {
        this.client.relationships.limit = 0;
        this.client.shoukaku.cooldowns.length = 0;
        this.client.database.premiumCache.length = 0;
        return true
    }


}