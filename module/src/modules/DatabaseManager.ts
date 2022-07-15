import mongoose, { Mongoose } from "mongoose";
const b = require("mongoose");
import { guildSchema } from "../models/guildData";
import { userSchema } from "../models/user";
import fetch from 'node-fetch';
import { BaseDiscordClient } from "../BaseDiscordClient";
import { Guild } from "eris";

export class DatabaseManager {
    client: BaseDiscordClient;
    knownGuilds: Array<string>;
    blacklist: Array<string>;
    connectionManager: Mongoose;
    state: 1 | 2 | 3;
    premiumCache: Array<string>;
    constructor(client: BaseDiscordClient) {
        this.client = client;
        this.connectionManager = new Mongoose()
        this.knownGuilds = [];
        this.premiumCache = [];
        this.state = 3;
    }

    async _close(reason?: string, reconnect?: boolean) {
        const state = await this.connectionManager.disconnect();
        console.log("[Mongo] Closed with reason: " + reason || "Connection reset by peer" + "")
        this.state = reconnect ? 2 : 3;
        if (reconnect) {
            setTimeout(async () => {
                this.connect()
            })
        }
        return state;
    }


    async connect() {
        try {
            b.connect(this.client.config.mongo.url, this.client.config.mongo.options, () => {
            })
        } catch (error) {
            console.log(error)
            this._close("Failed to connect")
        }
        return b
    }
    async checkPremiumUser(userId: string, cache?: boolean) {
        let is = false;
        if (this.premiumCache.includes(userId) && cache) return this.premiumCache.find(g => g === userId)
        try {
            const data = await fetch(this.client.config.premiumUrl + "premiumUser?userId=" + userId)
            if (data) {
                const json = await data.json()
                if (json) {
                    cache && this.premiumCache.push(userId, json)
                    is = json
                }
            }
        } catch (err) {
           is = false;
        }
        return is
    }
    handleCache(data: any, noUpdate?: boolean) {
        this.knownGuilds[data.serverID] = data;
        if (!noUpdate) data.save();
        return data;
    }

    getCache(serverId: string) {
        return this.knownGuilds[serverId]
    }

    async createServer(serverId: string) {
        return await new guildSchema({ serverID: serverId, prefix: "*", lang: "en", color: 0x3A871F }).save()
    }
    async resolve(serverId: string, includeCache?: boolean) {
        if (includeCache && this.getCache(serverId)) return this.getCache(serverId)
        let data = await guildSchema.findOne({ serverID: serverId });
        if (!data) data = await this.createServer(serverId);
        this.handleCache(data, true)
        return data;
    }
    async getUser(userId: string) {
        let data = await userSchema.findOne({ userID: userId });
        if (!data) data = await new userSchema({ userID: userId, playlists: [], songs: [] }).save()
        return data
    }
    async suppr(serverId: string) {
        return this.knownGuilds.includes(serverId) && delete this.knownGuilds[serverId], await guildSchema.findOneAndDelete({ serverID: serverId }), true;
    }
    async checkPremium(guildId: string, userId?: string, cache?: boolean) {
        if (this.premiumCache.includes(guildId) && cache) return true
        if (userId && (await this.checkPremiumUser(userId, true))) return true;
        try {
            const data = await fetch(this.client.config.premiumUrl + "premiumGuild?guildId=" + guildId)
            if (data) {
                const json = await data.json();
                if (json) {
                    cache && this.premiumCache.push(guildId, json);
                    return true
                }
            }
        } catch (err) {
            console.error(err)
            return false;
        }
    }
}
