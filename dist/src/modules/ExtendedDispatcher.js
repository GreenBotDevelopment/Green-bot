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
exports.ExtendedDispatcher = exports.humanizeTime = void 0;
const spotify_url_info_1 = require("spotify-url-info");
function humanizeTime(e) {
    const t = Math.floor((e / 1e3) % 60);
    return [
        Math.floor((e / 1e3 / 60) % 60)
            .toString()
            .padStart(2, "0"),
        t.toString().padStart(2, "0"),
    ].join(":");
}
exports.humanizeTime = humanizeTime;
class dispatcherMetadata {
}
class Song {
    constructor(track, user) {
        var _a;
        this.track = track.track;
        this.info = track.info;
        if (!this.info || !this.info.identifier)
            console.log(track.info);
        this.id = Math.trunc((Math.random() * 5) * Date.now());
        this.info ? this.info.image = "https://img.youtube.com/vi/" + ((_a = track.info) === null || _a === void 0 ? void 0 : _a.identifier) + "/hqdefault.jpg" : "";
        if (user)
            this.info.requester = { name: user.username, avatar: user.dynamicAvatarURL(), id: user.id };
    }
    get readableName() {
        return this.info.title
            .slice(0, 50)
            .replace("[", "")
            .replace("]", "")
            .replace("[", "")
            .replace("]", "")
            .replace("(Official Music Video)", "")
            .replace("(Clip Officiel)", "")
            .replace("(Official Lyric Video)", "");
    }
}
class ExtendedDispatcher {
    constructor(client, metadata, player, node) {
        this.client = client;
        this.metadata = metadata;
        this.voting = false;
        this.player = player;
        this.skipped = false;
        this.stopped = false;
        this.reconnects = 0;
        this.reconnecting = false;
        this.queue = [];
        this.debug = client.config.debug;
        this.repeat = "off";
        this.current = null;
        this.noFailureMode = null;
        this.importantCodes = [1006, 4014, 1000];
        this.stopped = false;
        this.playing = false;
        this.backed = false;
        this.node = node;
        this.filters = [];
        this.errored = this.noFailureMode ? "yes" : "idk";
        this.channelId = metadata.channelId;
        this.previousTracks = [];
        this.player.on("exception", (event) => {
            var _a, _b;
            this.errored = "no";
            if (this.debug)
                console.log(`[Dispatcher => ${this.metadata.guild.id}] Track failed to play ( ${(_a = this.current) === null || _a === void 0 ? void 0 : _a.info.title} ) for reason: ${event.error}. Cause: ${(_b = event.exception) === null || _b === void 0 ? void 0 : _b.cause}`);
            if (this.noFailureMode)
                this.onEnd();
            this.deleteLast();
            this.metadata.guildDB.announce &&
                this.client.createMessage(this.channelId, {
                    embeds: [
                        {
                            color: 0xC73829,
                            author: {
                                name: "Track errored",
                                icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                            },
                            description: `[${this.current.info.title.slice(0, 50)}](https://discord.gg/greenbot) is not available in your country because it's age-restricted!`,
                        },
                    ],
                });
        });
        this.player.on("end", (op) => {
            if (this.noFailureMode)
                return;
            this.errored = "no";
            this.onEnd(op);
            if (this.debug)
                console.log(`[Dispatcher => ${this.metadata.guild.id}] Received end event from lavalink websocket (end): ${op}`);
        });
        this.player.on("start", () => {
            if (this.noFailureMode)
                return;
            (this.errored = "no"), this.debug && console.log("OnStart +" + this.metadata.guild.id);
        });
    }
    deleteLast() {
        if (!this.lastMessage)
            return;
        this.client.deleteMessage(this.channelId, this.lastMessage)
            .then(() => {
            this.lastMessage = null;
        })
            .catch(err => {
        });
        return true;
    }
    wait(ms) {
        return new Promise((b) => setTimeout(b, ms).unref());
    }
    close(e) {
        return __awaiter(this, void 0, void 0, function* () {
            /* if (this.reconnecting) return;
             if (!this.metadata.guild.members.get(this.client.user.id) || !this.exists) return
             if (this.metadata.guild.members.get(this.client.user.id).voiceState.channelID) {
                 this.player.resume();
             } else {
                 if (this.importantCodes.includes(e.code)) {
                     if (e.code === 4014) {
                         const logs = await this.metadata.guild.getAuditLog({ limit: 2 }).catch(err => { });
                         if (logs && logs.entries.length && logs.entries.find(en => en.actionType === 27)) return this.delete(true)
                     }
                     this.reconnects++;
                     if (this.reconnects >= 5) return
                     console.log(`[Dispatcher] Closure for ${this.metadata.guild.id} , ${e.code}, ${e.reason}`)
                     if (this.metadata.guild.shard.ready) {
                         try {
                             if(this.reconnecting) return
                             this.reconnecting = true;
                             await this.node.joinChannel({
                                 guildId: this.metadata.guild.id,
                                 shardId: this.metadata.guild.shard.id || 0,
                                 channelId: this.player.connection.channelId,
                                 deaf: true
                             }).then(() => {
                                 this.reconnecting = false;
                             })
                             this.player.resume();
                         } catch (error) {
                             this.delete(true)
                         }
                     } else {
                         this.reconnect(2)
                     }
                 }
             }
             \*/
        });
    }
    reconnect(tries) {
        if (this.reconnecting)
            return;
        this.reconnecting = true;
        let _current = 0;
        for (_current < tries; _current++;) {
            this.wait(1000);
            this.node.joinChannel({
                guildId: this.metadata.guild.id,
                shardId: this.player.connection.shardId,
                channelId: this.player.connection.channelId,
                deaf: true
            }).then(s => {
                this.reconnecting = false;
            });
            this.player.resume();
        }
    }
    onEnd(data) {
        if (data) {
            if (data.reason === "REPLACED")
                return this.debug && console.log("Replaced");
            if (data.reason === "STOPPED")
                return this.debug && console.log("Stopped");
        }
        if (!this.current) {
            this.play();
            this.deleteLast();
            return;
        }
        switch (this.repeat) {
            case "song":
                this.player.playTrack({ track: this.current.track, options: { startTime: this.instantSkipMode ? 700 : 0 } });
                break;
            case "queue":
                this.queue.push(this.current);
                this.play();
                this.deleteLast();
                break;
            case "autoplay":
                if (!this.queue.length && this.previousTracks.length) {
                    this.previousTracks.push(this.current);
                    this.handleAutoplay(this.current || this.previousTracks[this.previousTracks.length - 2]);
                    this.deleteLast();
                    break;
                }
            default:
                this.playing = false;
                this.backed ? (this.backed = false) : this.previousTracks.push(this.current);
                this.play();
                this.deleteLast();
                break;
        }
        return this.repeat;
    }
    get exists() {
        return this.client.queue.has(this.metadata.guild.id);
    }
    started() {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            this.playing = true;
            if (this.errored === "yes" && this.current && this.current.info.isStream)
                return this.skip();
            if (this.metadata.message) {
                this.metadata.message.edit({
                    embeds: [
                        {
                            author: {
                                name: this.metadata.guild.name,
                                icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                                url: "https://discord.gg/greenbot",
                            },
                            description: "Send a music name/link bellow this message to play music.\n[Invite me](https://discord.gg/greenbot/invite) | [Premium](https://discord.gg/greenbot/premium) | [Vote](https://discord.gg/greenbot/vote) | [Commands](https://discord.gg/greenbot/commands)",
                            image: { url: `https://img.youtube.com/vi/${(_a = this.current) === null || _a === void 0 ? void 0 : _a.info.identifier}/default.jpg` },
                            footer: { text: `${this.queue.length} songs in the queue`, icon_url: this.client.user.dynamicAvatarURL() },
                            color: 0x3A871F,
                            fields: [
                                {
                                    name: "Now playing",
                                    value: `${this.current ? this.current.info.title.slice(0, 40) : "Unknown track"} requested by ${((_c = (_b = this.current) === null || _b === void 0 ? void 0 : _b.info) === null || _c === void 0 ? void 0 : _c.requester) ? `<@${(_e = (_d = this.current.info) === null || _d === void 0 ? void 0 : _d.requester) === null || _e === void 0 ? void 0 : _e.id}>` : "Unknown"}`,
                                    inline: true,
                                },
                            ],
                        },
                    ],
                });
            }
            if (this.metadata.guildDB.buttons) {
                this.client.createMessage(this.channelId, {
                    embeds: [
                        {
                            color: 0x3A871F,
                            author: {
                                name: this.metadata.guild.name + " - Now playing",
                                url: "https://discord.gg/greenbot",
                                icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                            },
                            description: `[${this.current
                                ? this.current.readableName ? this.current.readableName : this.current.info.title.slice(0, 50)
                                : "Unknown track"}](https://discord.gg/greenbot) by [${this.current ? this.current.info.author.slice(0, 40) : "Unknow artist"}](https://discord.gg/greenbot), requested by [${this.current && this.current.info.requester ? this.current.info.requester.name : "Unknown user"}](https://discord.gg/greenbot)`,
                        },
                    ],
                    components: [
                        {
                            components: [
                                { custom_id: "back_button", label: "Back", style: 3, type: 2 },
                                { custom_id: "stop", label: "Stop", style: 4, type: 2 },
                                { custom_id: "pause_btn", label: "Pause", style: 1, type: 2 },
                                { custom_id: "skip", label: "Skip", style: 3, type: 2 },
                                { custom_id: "like", emoji: { name: "❤", id: null }, style: 2, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                })
                    .then((message) => {
                    this.lastMessage = message.id;
                })
                    .catch(err => {
                    if (err.toString().includes("Unknown Channel"))
                        return this.delete();
                });
            }
            else {
                this.client.createMessage(this.channelId, {
                    embeds: [
                        {
                            color: 0x3A871F,
                            author: {
                                name: this.metadata.guild.name + " - Now playing",
                                url: "https://discord.gg/greenbot",
                                icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                            },
                            description: `[${this.current
                                ? this.current.readableName
                                : "Unknown track"}](https://discord.gg/greenbot) by [${this.current ? this.current.info.author.slice(0, 40) : "Unknow artist"}](https://discord.gg/greenbot), requested by [${this.current && this.current.info.requester ? this.current.info.requester.name : "Unknown user"}](https://discord.gg/greenbot)`,
                        },
                    ]
                })
                    .then((message) => {
                    this.lastMessage = message.id;
                })
                    .catch(err => {
                    if (err.includes("Unknown Channel"))
                        return this.delete(true);
                });
            }
            this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
                this.client.queue._sockets
                    .filter((e) => e.serverId === this.metadata.guild.id)
                    .forEach((e) => {
                    this.client.queue.emitOp({
                        changes: ["CURRENT_SONG", "RECENT_SONGS", "NEXT_SONGS"],
                        socketId: e.id,
                        serverId: this.metadata.guild.id,
                        queueData: { current: this.current, incoming: this.queue, paused: this.player.paused, loop: "queue" === this.repeat, recent: this.previousTracks },
                    });
                });
            if (!this.current && this.player.track)
                return this.skip();
            if (!this.current && !this.player.track)
                return this.play();
            if (this.errored === "no")
                return;
            if (!this.noFailureMode) {
                switch (this.errored) {
                    case "idk":
                        setTimeout(() => {
                            if ("idk" === this.errored) {
                                this.errored = "yes";
                                this.timeout && clearTimeout(this.timeout);
                                this.timeout = setTimeout(() => {
                                    if (!this.exists)
                                        return;
                                    if (!this.current)
                                        return;
                                    "yes" === this.errored && (this.player.paused || this.onEnd());
                                }, this.current.info.length > 10000000 ? Math.trunc(this.current.info.length / 100000000000) : this.current.info.length).unref();
                            }
                        }, 2500).unref();
                        break;
                    case "yes":
                        this.timeout && clearTimeout(this.timeout);
                        this.timeout = setTimeout(() => {
                            if (!this.exists)
                                return;
                            if (!this.current)
                                return;
                            "yes" === this.errored && (this.player.paused || this.onEnd());
                        }, this.current.info.length > 10000000 ? Math.trunc(this.current.info.length / 100000000000) : this.current.info.length).unref();
                        break;
                    default:
                        break;
                }
            }
            else {
                this.timeout && clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    if (!this.exists || this.stopped)
                        return;
                    if (!this.current)
                        return;
                    "yes" === this.errored && (this.player.paused || this.onEnd());
                }, this.current.info.length > 10000000 ? Math.trunc(this.current.info.length / 100000000000) : this.current.info.length).unref();
            }
            return true;
        });
    }
    pause(mode) {
        this.player.setPaused(mode);
        if (mode === false) {
            if (this.errored = "yes") {
                this.timeout = setTimeout(() => {
                    if (!this.exists || this.stopped)
                        return;
                    if (!this.current)
                        return;
                    "yes" === this.errored && (this.player.paused || this.onEnd());
                }, this.current.info.length - this.player.position);
            }
        }
        else {
            if (this.errored = "yes")
                this.timeout && clearTimeout(this.timeout);
        }
        return mode;
    }
    tracksAdded() {
        return (this.client.queue._waiting.find((e) => e.serverId === this.metadata.guild.id) &&
            this.client.queue._waiting
                .filter((e) => e.serverId === this.metadata.guild.id)
                .forEach((e) => {
                this.client.queue.emitOp({ changes: ["NEXT_SONGS"], socketId: e.id, serverId: this.metadata.guild.id, queueData: { incoming: this.queue } }), this.client.queue.removeWaiting(e.id), this.client.queue._sockets.push(e);
            }),
            this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
                this.client.queue._sockets
                    .filter((e) => e.serverId === this.metadata.guild.id)
                    .forEach((e) => {
                    this.client.queue.emitOp({ changes: ["NEXT_SONGS"], socketId: e.id, serverId: this.metadata.guild.id, queueData: { incoming: this.queue } });
                }),
            { ok: true });
    }
    addTrack(track, user, addTop) {
        const song = new Song(track, user);
        addTop && this.queue.length ? this.queue.splice(0, 0, song) : this.queue.push(song);
        this.playing || this.play();
        this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
            this.client.queue._sockets
                .filter((e) => e.serverId === this.metadata.guild.id)
                .forEach((e) => {
                this.client.queue.emitOp({ changes: ["NEXT_SONGS"], socketId: e.id, serverId: this.metadata.guild.id, queueData: { incoming: this.queue } });
            });
    }
    parseTrack(track, user) {
        return new Song(track, user);
    }
    skip(noReplace) {
        return __awaiter(this, void 0, void 0, function* () {
            if (noReplace && this.debug)
                console.log(`[Dispatcher => ${this.metadata.guild.id}] Skip on noReplace mode after error.`);
            let nextTrack = this.queue.shift();
            let nextTrackTemp;
            if (!nextTrack) {
                if (this.repeat === "autoplay" && this.previousTracks.length || this.repeat === "autoplay" && this.current) {
                    this.current && this.previousTracks.push(this.current);
                    this.handleAutoplay(this.current || this.previousTracks[this.previousTracks.length - 2]);
                }
                else {
                    this.player.stopTrack();
                    this.ended();
                }
                return;
            }
            if (nextTrack.info.sp) {
                if (!nextTrack.info.uri && !nextTrack.info.author)
                    return this.skip(true);
                if (this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri)) {
                    nextTrack = this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri).info;
                }
                else {
                    if (!nextTrack.info.author) {
                        if (!nextTrack.info.uri)
                            return this.skip(true);
                        const scrapedData = yield (0, spotify_url_info_1.getData)(nextTrack.info.uri);
                        if (!scrapedData)
                            return this.skip(true);
                        nextTrackTemp = { author: scrapedData.artists[0].name, title: scrapedData.name, url: nextTrack.info.uri, requester: nextTrack.info.requester, image: scrapedData.image };
                    }
                    const resolve = yield this.node.rest.resolve(`ytsearch:${nextTrackTemp ? nextTrackTemp.title : nextTrack.info.title} ${nextTrackTemp ? nextTrackTemp.author : nextTrack.info.author}`);
                    if (!resolve || !resolve.tracks.length)
                        return this.skip(true);
                    const finnal_track = new Song(resolve.tracks[0]);
                    finnal_track.info.title = nextTrackTemp ? nextTrackTemp.title : nextTrack.info.title;
                    finnal_track.info.image = nextTrack.info.image;
                    finnal_track.info.author = nextTrackTemp ? nextTrackTemp.author : nextTrack.info.author;
                    finnal_track.info.requester = nextTrack.info.requester;
                    finnal_track.info.uri = nextTrackTemp ? nextTrackTemp.url : nextTrack.info.uri;
                    nextTrack = finnal_track;
                    if (!this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri))
                        this.client.shoukaku.cache.push({ id: nextTrack.info.uri, info: nextTrack });
                }
            }
            return ("queue" === this.repeat && this.current && this.queue.push(this.current),
                this.current && this.previousTracks.push(this.current),
                (this.current = nextTrack),
                this.deleteLast(),
                this.current ? this.player.playTrack({ options: { noReplace: noReplace || false, startTime: this.instantSkipMode ? 700 : 0 }, track: this.current.track }) && this.started() : this.skip(true));
        });
    }
    play() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug)
                console.log(`[Dispatcher => ${this.metadata.guild.id}] Handling play function.`);
            if (!this.queue.length)
                return this.debug && console.log(`[${this.metadata.guild.name} (${this.metadata.guild.id})] return on play for reason: \nNo queue`), this.ended();
            let nextTrack = this.queue.shift();
            let nextTrackTemp;
            if (!nextTrack) {
                if (this.repeat === "autoplay" && this.previousTracks.length) {
                    this.current && this.previousTracks.push(this.current);
                    this.handleAutoplay(this.current || this.previousTracks[this.previousTracks.length - 2]);
                }
                else {
                    this.ended();
                }
                return;
            }
            if (nextTrack.info.sp) {
                if (!nextTrack.info.uri && !nextTrack.info.author)
                    return this.skip(true);
                if (this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri)) {
                    nextTrack = this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri).info;
                }
                else {
                    if (!nextTrack.info.author) {
                        if (!nextTrack.info.uri)
                            return this.skip(true);
                        const scrapedData = yield (0, spotify_url_info_1.getData)(nextTrack.info.uri);
                        if (!scrapedData)
                            return this.skip(true);
                        nextTrackTemp = { author: scrapedData.artists[0].name, title: scrapedData.name, url: nextTrack.info.uri, requester: nextTrack.info.requester, image: scrapedData.image };
                    }
                    const resolve = yield this.node.rest.resolve(`ytsearch:${nextTrackTemp ? nextTrackTemp.title : nextTrack.info.title} ${nextTrackTemp ? nextTrackTemp.author : nextTrack.info.author}`);
                    if (!resolve || !resolve.tracks.length)
                        return this.skip(true);
                    const finnal_track = new Song(resolve.tracks[0]);
                    finnal_track.info.title = nextTrackTemp ? nextTrackTemp.title : nextTrack.info.title;
                    finnal_track.info.image = nextTrack.info.image;
                    finnal_track.info.author = nextTrackTemp ? nextTrackTemp.author : nextTrack.info.author;
                    finnal_track.info.requester = nextTrack.info.requester;
                    finnal_track.info.uri = nextTrackTemp ? nextTrackTemp.url : nextTrack.info.uri;
                    nextTrack = finnal_track;
                    if (!this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri))
                        this.client.shoukaku.cache.push({ id: nextTrack.info.uri, info: nextTrack });
                }
            }
            this.current = nextTrack;
            return this.current ? ((this.playing = true), this.player.playTrack({ track: this.current.track, options: { startTime: this.instantSkipMode ? 700 : 0 } }), this.started()) : this.skip(true);
        });
    }
    handleAutoplay(song) {
        return __awaiter(this, void 0, void 0, function* () {
            const resolve = yield this.node.rest.resolve(`ytmsearch:${song.info.author}`);
            if (!resolve || !resolve.tracks.length)
                return this.destroy(true, true);
            let choosed = new Song(resolve.tracks[Math.floor(Math.random() * resolve.tracks.length)], this.client.user);
            if (this.previousTracks.find((e) => e.info.uri === choosed.info.uri))
                choosed = new Song(resolve.tracks[Math.floor(Math.random() * resolve.tracks.length)], this.client.user);
            this.queue.push(choosed);
            return this.player.track ? this.skip() : this.play;
        });
    }
    remove(e, t) {
        if ((this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
            !t &&
            this.client.queue._sockets
                .filter((e) => e.serverId === this.metadata.guild.id)
                .forEach((t) => {
                this.client.queue.emitOp({ changes: ["NEXT_SONGS"], socketId: t.id, serverId: this.metadata.guild.id, queueData: { incoming: this.queue } });
            }),
            isNaN(e)))
            this.queue = this.queue.filter((t) => t.info.uri !== e.info.uri);
        else {
            const t = this.queue[e];
            t && (this.queue = this.queue.filter((e) => e.info.uri !== t.info.uri));
        }
        return true;
    }
    delete(notifiy) {
        return __awaiter(this, void 0, void 0, function* () {
            this.player.connection.disconnect();
            this.timeout && clearTimeout(this.timeout);
            this.timeout = null;
            this.client.queue.delete(this.metadata.guild.id);
            if (notifiy && !this.metadata.message) {
                this.client.createMessage(this.channelId, { embeds: [{ title: "Queue Concluded", color: 0XF0B02F, description: "Queue has ended! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)" }] }).catch(() => null);
            }
            this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
                this.client.queue._sockets
                    .filter((e) => e.serverId === this.metadata.guild.id)
                    .forEach((e) => {
                    this.client.queue.emitOp({ changes: ["DESTROY"], socketId: e.id, serverId: this.metadata.guild.id, queueData: { current: null, incoming: [], recent: [] } }), this.client.queue.addWaiting(e);
                });
            if (this.metadata.message)
                this.metadata.message.edit({
                    embeds: [
                        {
                            author: {
                                name: this.metadata.guild.name,
                                icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                                url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=8",
                            },
                            description: "Send a music name/link bellow this message to play music.\n[Invite me](https://discord.gg/greenbot/invite) | [Premium](https://discord.gg/greenbot/premium) | [Vote](https://discord.gg/greenbot/vote) | [Commands](https://discord.gg/greenbot/commands)",
                            image: { url: "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png" },
                            footer: { text: "Green-bot | Free music for everyone!", icon_url: this.client.user.dynamicAvatarURL() },
                            color: 0x3A871F,
                            fields: [{ name: "Now playing", value: "__**Nothing playing**__", inline: true }],
                        },
                    ],
                });
            this.deleteLast();
            return true;
        });
    }
    ended(source) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.debug)
                console.log(`[Dispatcher => ${this.metadata.guild.id}] Ended received from source ${source} . ${this.queue.length ? "still some" : "no "} tracks in queue`);
            if (this.queue.length)
                return this.play();
            this.current = null;
            this.playing = false;
            this.timeout && clearTimeout(this.timeout);
            this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
                this.client.queue._sockets
                    .filter((e) => e.serverId === this.metadata.guild.id)
                    .forEach((e) => {
                    this.client.queue.emitOp({ changes: ["NEXT_SONGS", "CURRENT_SONG"], socketId: e.id, serverId: this.metadata.guild.id, queueData: { current: null, incoming: [] } });
                });
            this.client.createMessage(this.channelId, { embeds: [{ title: "Queue Concluded", color: 0xF0B02F, description: "Queue has ended! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)" }] }).catch(() => null);
            this.deleteLast();
            return true;
        });
    }
    destroy(force, send) {
        return __awaiter(this, void 0, void 0, function* () {
            this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
                this.client.queue._sockets
                    .filter((e) => e.serverId === this.metadata.guild.id)
                    .forEach((e) => {
                    this.client.queue.emitOp({
                        changes: ["NEXT_SONGS", "RECENT_SONGS", "CURRENT_SONG"],
                        socketId: e.id,
                        serverId: this.metadata.guild.id,
                        queueData: { current: null, incoming: [], recent: [] },
                    }),
                        this.metadata.guildDB.h24 || this.client.queue.addWaiting(e);
                });
            if (force) {
                this.delete(false);
                this.client
                    .createMessage(this.channelId, {
                    embeds: [
                        {
                            color: 0XF0B02F,
                            description: "No one has been listening for the past 5 minute, leaving the channel :wave:\n\nYou can disable this by enabling the **24/7 mode** using the [premium](https://green-bot.app/premium) command `/247`!",
                        },
                    ],
                })
                    .catch((e) => { });
            }
            else {
                this.queue.length = 0;
                this.playing && this.player.stopTrack();
                this.repeat = "off";
                this.current = null;
                this.backed = false;
                this.playing = false;
                this.timeout && clearTimeout(this.timeout);
                this.deleteLast();
            }
            if (!send && !force && !this.metadata.message) {
                this.client
                    .createMessage(this.channelId, { embeds: [{ title: "Queue Concluded", color: 0XF0B02F, description: "Queue has ended! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)" }] })
                    .catch(() => null);
            }
            this.metadata.message &&
                this.metadata.message.edit({
                    embeds: [
                        {
                            author: {
                                name: this.metadata.guild.name,
                                icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                                url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=8",
                            },
                            description: "Send a music name/link bellow this message to play music.\n[Invite me](https://discord.gg/greenbot/invite) | [Premium](https://discord.gg/greenbot/premium) | [Vote](https://discord.gg/greenbot/vote) | [Commands](https://discord.gg/greenbot/commands)",
                            image: { url: "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png" },
                            footer: { text: "Green-bot | Free music for everyone!", icon_url: this.client.user.dynamicAvatarURL() },
                            color: 0x3A871F,
                            fields: [{ name: "Now playing", value: "__**Nothing playing**__", inline: true }],
                        },
                    ],
                });
            return true;
        });
    }
}
exports.ExtendedDispatcher = ExtendedDispatcher;
