import { Mongoose } from "mongoose";
const b = require("mongoose");
import { guildSchema } from "../models/guildData";
import { userSchema } from "../models/user";
import fetch from 'node-fetch';
import { BaseDiscordClient } from "../BaseDiscordClient";

export class DatabaseManager {
    client: BaseDiscordClient;
    knownGuilds: Array<string>;
    userCache: Array<any>;
    blacklist: Array<string>;
    connectionManager: Mongoose;
    requests: Array<any>;
    state: 1 | 2 | 3;
    premiumCache: Array<string>;
    constructor(client: BaseDiscordClient) {
        this.client = client;
        this.connectionManager = new Mongoose()
        this.userCache = [];
        this.requests = [];
        this.knownGuilds = [];
        this.premiumCache = [];
        this.state = 3;

    }


    async proceeedQueue() {
        this.premiumCache = [];
        this.knownGuilds = [];
        let currentPosition = 0;
        const interval = setInterval(() => {
            console.log(`${currentPosition}/${this.requests.length}`)
            if (currentPosition >= this.requests.length) {
                clearInterval(interval);
                return console.log("Finished procesing queue")
            }
            const req = this.requests[currentPosition];
            currentPosition++
            req.temp ? new userSchema(req).save() : req.save();
            let id = req.serverID || req.userID;
            this.requests = this.requests.filter(d => (d.serverID || d.userID) !== id)


        }, 1000 * 40).unref()
    }

    async enqueue(process) {
        let id = process.serverID || process.userID;
        const idQ = this.requests.findIndex(d => (d.serverID || d.userID) === id)

        if (idQ !== -1) {
            this.requests[idQ] = process;
        } else {
            setTimeout(() => {
                const req = this.requests.find(d => (d.serverID || d.userID) === id)
                if(!req) return
                
                req.temp ? new userSchema(req).save() : req.save();
                this.requests = this.requests.filter(d => (d.serverID || d.userID) !== id)
            }, 1000 * 60 * 10);
            this.requests.push(process)
        }
        return process
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
                if (json && !json.error) {
                    cache && this.premiumCache.push(userId, json)
                    is = json
                }
            }
        } catch (err) {
            is = false;
        }
        return is
    }
    async handleCache(data: any, noUpdate?: boolean) {
        if (data.temp) {
            data = await new guildSchema(data).save()
        } else {
            if (!noUpdate) this.enqueue(data)
        }
        this.knownGuilds[data.serverID] = data;
        return data;
    }

    getCache(serverId: string) {
        return this.knownGuilds[serverId]
    }

    burnDog(dogId: string) {
        return {
            serverID: dogId,
            temp: true,
            auto_autoplay: false,
            vote_skip: true,
            buttons: true,
            defaultVolume: 40,
            vcs: [],
            txts: [],
            auto_shuffle: false,
            djroles: [],
            leave_settings: {no_music: false, channel_empty: false},
            h24: false,
            announce: true,
            max_songs: { user: - 1, guild: 10000 },
            dj_commands: ["autoplay", "back", "clearqueue", "forceskip", "forward", "givedj", "jump", "leavecleanup", "loop", "move", "pause", "resume", "remove", "removedupes", "leave", "replay", "rewind", "seek", "shuffle", "stop", "volume"],
            textchannel: null,
        }
    }

    async createServer(serverId: string) {
        return "bannoz is gay, real"
    }
    async resolve(serverId: string, includeCache?: boolean) {
        if (this.getCache(serverId)) return this.getCache(serverId)
        let data = await guildSchema.findOne({ serverID: serverId });
        if (!data) data = this.burnDog(serverId)
        this.knownGuilds[data.serverID] = data;
        return data;
    }
    async getUser(userId: string) {
        if (this.userCache[userId]) return this.userCache[userId]
        let data = await userSchema.findOne({ userID: userId });
        if (!data) {
            data = {
                userID: userId,
                playlists: [],
                songs: [],
                temp: true,
                played_music: []
            }
        }
        data.getTopSongs = function () {
            const songs = this.getUser(userId).then(user => user.played_music);
            let _songs = [];
            for (const song of songs) {
                let index = _songs.findIndex(m => m.info.uri === song.info.uri || m.info.title.toLowerCase().includes(m.info.title.toLowerCase()))
                if (index !== -1) {
                    _songs[index].count++
                } else {
                    song.count = 0;
                    _songs.push(song)
                }
            }
            _songs = _songs.sort((a, b) => a.count - b.count)
            return songs
        }

        this.userCache[userId] = data;

        return data
    }
    getTopSongs = function (songs, write) {
        let _songs = [];
        for (const song of songs) {
            if (!song.info) console.log(song)
            let songUri = song.info ? song.info.uri : song.scraped ? song.track.external_urls.spotify : song.originURL;
            let songName = song.info ? song.info.title : song.scraped ? song.track.name : song.title;
            if (!song.info) song.info = {}
            if (songName) {

                let index = _songs.findIndex(m => m.info && ((m.info.uri === songUri) || (m.info.title.toLowerCase().includes(songName.toLowerCase()))))
                if (index !== -1) {
                    _songs[index].count++
                } else {
                    _songs.push({
                        track: song.track,
                        info: song.info,
                        count: 1
                    })
                }

            }

        }

        _songs = _songs.sort((a, b) => a.count - b.count)
        if (write) return _songs.sort((a, b) => a.count - b.count).map(m => `[${m.info.title.length >= 25 ? m.info.title.slice(0, 25) + "..." : m.info.title}](${m.info.uri}) : played **${m.count}** times`).reverse()
        return _songs
    }

    async updateUser(user) {
        this.userCache[user.userID] = user;
        this.enqueue(user);
        return user;
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
                if (json && !json.error) {
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
