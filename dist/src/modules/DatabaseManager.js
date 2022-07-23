"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseManager = void 0;
const mongoose_1 = require("mongoose");
const b = require("mongoose");
const guildData_1 = require("../models/guildData");
const user_1 = require("../models/user");
const node_fetch_1 = require("node-fetch");
class DatabaseManager {
    constructor(client) {
        this.client = client;
        this.connectionManager = new mongoose_1.Mongoose();
        this.knownGuilds = [];
        this.premiumCache = [];
        this.state = 3;
    }
    _close(reason, reconnect) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.connectionManager.disconnect();
            console.log("[Mongo] Closed with reason: " + reason || "Connection reset by peer" + "");
            this.state = reconnect ? 2 : 3;
            if (reconnect) {
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    this.connect();
                }));
            }
            return state;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                b.connect(this.client.config.mongo.url, this.client.config.mongo.options, () => {
                });
            }
            catch (error) {
                console.log(error);
                this._close("Failed to connect");
            }
            return b;
        });
    }
    checkPremiumUser(userId, cache) {
        return __awaiter(this, void 0, void 0, function* () {
            let is = false;
            if (this.premiumCache.includes(userId) && cache)
                return this.premiumCache.find(g => g === userId);
            try {
                const data = yield (0, node_fetch_1.default)(this.client.config.premiumUrl + "premiumUser?userId=" + userId);
                if (data) {
                    const json = yield data.json();
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
        });
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
    createServer(serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new guildData_1.guildSchema({ serverID: serverId, prefix: "*", lang: "en", color: 0x3A871F }).save();
        });
    }
    resolve(serverId, includeCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (includeCache && this.getCache(serverId))
                return this.getCache(serverId);
            let data = yield guildData_1.guildSchema.findOne({ serverID: serverId });
            if (!data)
                data = yield this.createServer(serverId);
            this.handleCache(data, true);
            return data;
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            let data = yield user_1.userSchema.findOne({ userID: userId });
            if (!data)
                data = yield new user_1.userSchema({ userID: userId, playlists: [], songs: [] }).save();
            return data;
        });
    }
    suppr(serverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.knownGuilds.includes(serverId) && delete this.knownGuilds[serverId], yield guildData_1.guildSchema.findOneAndDelete({ serverID: serverId }), true;
        });
    }
    checkPremium(guildId, userId, cache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.premiumCache.includes(guildId) && cache)
                return true;
            if (userId && (yield this.checkPremiumUser(userId, true)))
                return true;
            try {
                const data = yield (0, node_fetch_1.default)(this.client.config.premiumUrl + "premiumGuild?guildId=" + guildId);
                if (data) {
                    const json = yield data.json();
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
        });
    }
}
exports.DatabaseManager = DatabaseManager;
