"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const tslib_1 = require("tslib");
const mongoose_1 = require("mongoose");
const b = require("mongoose");
const guildData_1 = require("../models/guildData");
const user_1 = require("../models/user");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
class DatabaseManager {
    client;
    knownGuilds;
    blacklist;
    connectionManager;
    state;
    premiumCache;
    constructor(client) {
        this.client = client;
        this.connectionManager = new mongoose_1.Mongoose();
        this.knownGuilds = [];
        this.premiumCache = [];
        this.state = 3;
    }
    async _close(reason, reconnect) {
        const state = await this.connectionManager.disconnect();
        console.log("[Mongo] Closed with reason: " + reason || "Connection reset by peer" + "");
        this.state = reconnect ? 2 : 3;
        if (reconnect) {
            setTimeout(async () => {
                this.connect();
            });
        }
        return state;
    }
    async connect() {
        try {
            b.connect(this.client.config.mongo.url, this.client.config.mongo.options, () => {
            });
        }
        catch (error) {
            console.log(error);
            this._close("Failed to connect");
        }
        return b;
    }
    async checkPremiumUser(userId, cache) {
        let is = false;
        if (this.premiumCache.includes(userId) && cache)
            return this.premiumCache.find(g => g === userId);
        try {
            const data = await (0, node_fetch_1.default)(this.client.config.premiumUrl + "premiumUser?userId=" + userId);
            if (data) {
                const json = await data.json();
                if (json) {
                    cache && this.premiumCache.push(userId, json);
                    is = json;
                }
            }
        }
        catch (err) {
            is = false;
        }
        return is;
    }
    handleCache(data, noUpdate) {
        this.knownGuilds[data.serverID] = data;
        if (!noUpdate)
            data.save();
        return data;
    }
    getCache(serverId) {
        return this.knownGuilds[serverId];
    }
    async createServer(serverId) {
        return await new guildData_1.guildSchema({ serverID: serverId, prefix: "*", lang: "en", color: 0x3A871F }).save();
    }
    async resolve(serverId, includeCache) {
        if (includeCache && this.getCache(serverId))
            return this.getCache(serverId);
        let data = await guildData_1.guildSchema.findOne({ serverID: serverId });
        if (!data)
            data = await this.createServer(serverId);
        this.handleCache(data, true);
        return data;
    }
    async getUser(userId) {
        let data = await user_1.userSchema.findOne({ userID: userId });
        if (!data)
            data = await new user_1.userSchema({ userID: userId, playlists: [], songs: [] }).save();
        return data;
    }
    async suppr(serverId) {
        return this.knownGuilds.includes(serverId) && delete this.knownGuilds[serverId], await guildData_1.guildSchema.findOneAndDelete({ serverID: serverId }), true;
    }
    async checkPremium(guildId, userId, cache) {
        if (this.premiumCache.includes(guildId) && cache)
            return true;
        if (userId && (await this.checkPremiumUser(userId, true)))
            return true;
        try {
            const data = await (0, node_fetch_1.default)(this.client.config.premiumUrl + "premiumGuild?guildId=" + guildId);
            if (data) {
                const json = await data.json();
                if (json) {
                    cache && this.premiumCache.push(guildId, json);
                    return true;
                }
            }
        }
        catch (err) {
            console.error(err);
            return false;
        }
    }
}
exports.DatabaseManager = DatabaseManager;
