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
exports.Server = void 0;
const express_1 = require("express");
const body_parser_1 = require("body-parser");
class Server {
    constructor(client, spawn) {
        this.client = client;
        this.app = (0, express_1.default)();
        if (!spawn)
            this.startServer(client);
    }
    startServer(e) {
        return __awaiter(this, void 0, void 0, function* () {
            const r = this.app;
            r.use((0, body_parser_1.urlencoded)({ extended: false })),
                r.use((0, body_parser_1.json)()),
                r.listen((8000), function () {
                    console.log("Server listening at port %d");
                }),
                r.get("/fetchserver", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const t = r.query.server, a = r.query.asking, n = (yield e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                                const s = e.guilds.get(r.serv);
                                if (!s)
                                    return null;
                                let t = yield e.database.resolve(s.id), a = e.queue.get(s.id), n = false, u = s.members.get(r.user) || (yield s.getRESTMember(r.user)), o = yield e.database.getUser(r.user), c = true, l = yield e.database.checkPremium(r.serv, r.user);
                                return (u && (u.permissions.has("manageGuild") && (n = true), t.djroles && t.djroles.length && u.roles.find((e) => t.djroles.includes(e)), a && a.metadata.dj.id === r.id && (n = true)),
                                    {
                                        data: { id: s.id, name: s.name, image: s.iconURL, settings: t },
                                        exists: { server: true, dj: !(!u || !u.permissions.has("manageGuild")) || n, voice: (u && !!u.voiceState.channelID) || null, db: o, hasVoted: !!l || !!c || null, premium: l },
                                        shardId: e.cluster.id,
                                        queue: a ? { current: a.current, paused: a.player.paused, incoming: a.queue, loop: a.repeat, recent: a.previousTracks } : null,
                                    });
                            }), { context: { serv: t, user: a } })).find((e) => e);
                            s.send(n || { error: "Server not found", code: 404 });
                        }
                        catch (e) {
                            console.log(e), s.send({ error: "Server not found", code: 404 });
                        }
                    });
                }),
                r.get("/removeSong", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.shard, n = r.query.songId, u = r.query.user, o = r.query.avatar;
                        yield e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            if (!s)
                                return;
                            const t = e.queue.get(r.serv);
                            if (!t)
                                return;
                            const a = t.queue.find((e) => e.info.uri == r.songId);
                            t.remove(a, true);
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (channel && channel.type !== 2)
                                return null;
                            if (!channel)
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just removed ${a.info.title.slice(0, 50)} from the queue using the dashboard`, icon_url: r.avatar } }] });
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just removed ${a.info.title.slice(0, 50)} from the queue using the dashboard`, icon_url: r.avatar } }] });
                            return true;
                        }), { context: { songId: n, serv: t, user: u, avatar: o }, cluster: a }),
                            s.send({ done: true });
                    });
                }),
                r.post("/remove_pl_track", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { song: t, playlist: a } = r.body, n = yield e.database.getUser(r.query.user);
                        if ("Liked Song" === a)
                            (n.songs = n.songs.filter((e) => e.info.uri !== t)), n.save();
                        else {
                            const e = n.playlists.find((e) => e.name === a);
                            if (!e)
                                return console.log("No pl found");
                            (e.tracks = e.tracks.filter((e) => e.info.uri !== t)), (n.playlists = n.playlists.filter((e) => e.name !== a)), n.playlists.push(e), n.save();
                        }
                        s.send({ msg: "Done", code: 404 });
                    });
                }),
                r.post("/handle_like", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const { song: t } = r.body, a = yield e.database.getUser(r.query.user);
                        a.songs.find((e) => e.info.uri === t.info.uri) ? (a.songs = a.songs.filter((e) => e.info.uri !== t.info.uri)) : a.songs.push(t), a.save(), s.send({ msg: "Done", code: 404 });
                    });
                }),
                r.get("/addServer", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.socket, n = r.query.voice, u = r.query.shard, o = r.query.userId;
                        e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            s && (e.queue.addWaiting({ serverId: r.serv, id: r.socket, userId: r.userId }), e.queue.addWaitingUser(s.id, r.socket, r.userId, r.voice));
                        }), { context: { socket: a, serv: t, userId: o, voice: n }, cluster: u }),
                            s.send({ done: true });
                    });
                }),
                r.get("/cleanSocket", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.socket, a = r.query.shard;
                        if (!t)
                            return s.send({ error: true, message: "No socket option provided" });
                        yield e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () { return e.queue.cleanSocket(r.socket); }), { context: { socket: t }, cluster: a }), s.send({ done: true });
                    });
                }),
                r.get("/exists", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const t = r.query.server, a = (yield e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                                if (e.guilds.get(r.serv))
                                    return true;
                            }), { context: { serv: t } })).find((e) => e);
                            s.send(a ? { exists: true } : { error: "Server not found", code: 404 });
                        }
                        catch (e) {
                            return s.send({ code: 3 });
                        }
                    });
                }),
                r.get("/on_db", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const t = r.query.server, a = yield e.client.database.resolve(t);
                            s.send(a ? { exists: true } : { exists: false });
                        }
                        catch (e) {
                            return s.send({ code: 3 });
                        }
                    });
                }),
                r.get("/del_db", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        try {
                            const t = r.query.server, a = yield e.client.database.suppr(t);
                            s.send(a ? { exists: true } : { exists: false });
                        }
                        catch (e) {
                            return s.send({ code: 3 });
                        }
                    });
                }),
                r.get("/pause", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = r.query.shard, u = r.query.avatar;
                        e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            if (!s)
                                return;
                            const t = e.queue.get(r.serv);
                            if (!t)
                                return;
                            t.pause(!t.player.paused);
                            t.lastMessage &&
                                e.editMessage(t.channelId, t.lastMessage, {
                                    embeds: t.lastMessage.embeds,
                                    components: [
                                        {
                                            components: [
                                                { custom_id: "back_button", label: "Back", style: 3, type: 2 },
                                                { custom_id: "stop", label: "Stop", style: 4, type: 2 },
                                                { custom_id: "pause_btn", label: t.player.paused ? "Resume" : "Pause", style: 1, type: 2 },
                                                { custom_id: "skip", label: "Skip", style: 3, type: 2 },
                                                { custom_id: "like", emoji: { name: "❤", id: null }, style: 2, type: 2 },
                                            ],
                                            type: 1,
                                        },
                                    ],
                                });
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just ${t.player.paused ? "paused" : "unpaused"} the current song using the dashboard`, icon_url: r.avatar } }] });
                            }
                            if (channel && channel.type !== 2)
                                return null;
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just ${t.player.paused ? "paused" : "unpaused"} the current song using the dashboard`, icon_url: r.avatar } }] });
                            return true;
                        }), { context: { serv: t, user: a, avatar: u }, cluster: n }),
                            s.send({ done: true });
                    });
                }),
                r.get("/skip", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = r.query.shard, u = r.query.avatar;
                        e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            if (!s)
                                return null;
                            const t = e.queue.get(r.serv);
                            if (!t)
                                return null;
                            t.skip();
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just skipped the current song using the dashboard`, icon_url: r.avatar } }] });
                            }
                            if (channel && channel.type !== 2)
                                return null;
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just skipped the current song using the dashboard`, icon_url: r.avatar } }] });
                            return true;
                        }), { context: { serv: t, user: a, avatar: u }, cluster: n }),
                            s.send({ done: true });
                    });
                }),
                r.get("/back", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = r.query.shard, u = r.query.avatar;
                        e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            if (!s)
                                return;
                            const t = e.queue.get(r.serv);
                            if (!t)
                                return;
                            const song = t.previousTracks[t.previousTracks.length - 1];
                            t.queue.unshift(song);
                            t.previousTracks = t.previousTracks.filter((r) => r.info.uri !== song.info.uri);
                            t.backed = true;
                            t.skip();
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just played ${song.readableName} using the dashboard`, icon_url: r.avatar } }] });
                            }
                            if (channel && channel.type !== 2)
                                return null;
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just played ${song.readableName} using the dashboard`, icon_url: r.avatar } }] });
                            return true;
                        }), { context: { serv: t, user: a, avatar: u }, cluster: n }),
                            s.send({ done: true });
                    });
                }),
                r.get("/shuffle", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = r.query.shard, u = r.query.avatar;
                        e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            if (!s)
                                return null;
                            const t = e.queue.get(r.serv);
                            if (!t)
                                return;
                            t.queue = t.queue.sort(() => Math.random() - 0.5);
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just shuffled the queue using the dashboard!`, icon_url: r.avatar } }] });
                            }
                            if (channel && channel.type !== 2)
                                return null;
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just shuffled the queue using the dashboard!`, icon_url: r.avatar } }] });
                            return true;
                        }), { context: { serv: t, user: a, avatar: u }, cluster: n }),
                            s.send({ done: true });
                    });
                }),
                r.get("/loop", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = r.query.shard, u = r.query.avatar;
                        e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            if (!s)
                                return null;
                            const t = e.queue.get(r.serv);
                            if (!t)
                                return;
                            t.repeat = "queue" === t.repeat ? "off" : "queue";
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just set the repeat mode to ${t.repeat} using the dashboard`, icon_url: r.avatar } }] });
                            }
                            if (channel && channel.type !== 2)
                                return null;
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just set the repeat mode to ${t.repeat} using the dashboard`, icon_url: r.avatar } }] });
                            return true;
                        }), { context: { serv: t, user: a, avatar: u }, cluster: n }),
                            s.send({ done: true });
                    });
                }),
                r.get("/recent", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = r.query.shard, u = r.query.songId, o = r.query.avatar;
                        e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            if (!s)
                                return null;
                            const t = e.queue.get(r.serv);
                            if (!t)
                                return null;
                            const a = t.previousTracks.find((e) => e.info.uri === r.songId);
                            t.previousTracks = t.previousTracks.filter((e) => e.info.uri !== a.info.uri);
                            t.queue.splice(0, 0, a);
                            t.playing ? t.skip() : t.play();
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just played ${a.info.title.slice(0, 40)} using the dashboard`, icon_url: r.avatar } }] });
                            }
                            if (channel && channel.type !== 2)
                                return null;
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just played ${a.info.title.slice(0, 40)} using the dashboard`, icon_url: r.avatar } }] });
                            return true;
                        }), { context: { serv: t, user: a, avatar: o, songId: u }, cluster: n }),
                            s.send({ done: true });
                    });
                }),
                r.get("/jump", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = r.query.shard, u = r.query.avatar, o = r.query.songId;
                        e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                            const s = e.guilds.get(r.serv);
                            if (!s)
                                return;
                            const t = e.queue.get(r.serv);
                            if (!t)
                                return;
                            const a = t.queue.find((e) => e.info.uri === r.songId);
                            t.remove(a, true);
                            t.queue.splice(0, 0, a);
                            t.skip();
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just jumped to ${a.info.title.slice(0, 150)} using the dashboard`, icon_url: r.avatar } }] });
                            }
                            if (channel && channel.type !== 2)
                                return null;
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just jumped to ${a.info.title.slice(0, 150)} using the dashboard`, icon_url: r.avatar } }] });
                            return true;
                        }), { context: { serv: t, user: a, avatar: u, songId: o }, cluster: n }),
                            s.send({ done: true });
                    });
                }),
                r.post("/add_result", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = "null" !== r.query.top || null, u = r.query.shard, o = r.body.playlist, c = r.query.avatar, l = r.body.name, userId = r.body.userId;
                        if (o) {
                            const r = e.client.shoukaku.getNode();
                            yield r.rest.resolve();
                        }
                        else
                            e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                                const s = e.guilds.get(r.serv);
                                if (!s)
                                    return;
                                let t = e.queue.get(r.serv);
                                if (!t) {
                                    const m = s.members.get(r.userId);
                                    const db = yield e.database.resolve(s.id);
                                    t = yield e.queue.create({
                                        guild: s,
                                        author: m,
                                        member: m,
                                        getVoiceChannel: () => __awaiter(this, void 0, void 0, function* () {
                                            return yield e.getRESTChannel(m.voiceState.channelID);
                                        }),
                                        guildDB: db,
                                        channel: s.channels.find(ch => ch.permissionsOf(e.user.id).has("sendMessages") && ch.permissionsOf(e.user.id).has("embedLinks"))
                                    }, e.shoukaku.getNode());
                                }
                                let tr;
                                const node = e.shoukaku.getNode("search");
                                const a = (yield node.rest.resolve(`${r.song}`));
                                if (!a || !a.tracks)
                                    return console.log("hahdzhdazhd");
                                tr = a.tracks[0];
                                tr.info.requester = { name: r.user, avatar: r.avatar, id: r.userId };
                                r.top
                                    ? t.addTrack(a, null, true)
                                    : t.addTrack(a);
                                t.playing || t.play();
                                const channel = s.channels.get(t.player.connection.channelId);
                                if (!channel) {
                                    return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${tr.info.title.slice(0, 40)} from the dashboard`, icon_url: r.avatar } }] });
                                }
                                if (channel.type == 2)
                                    channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                        e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${tr.info.title.slice(0, 40)} from the dashboard`, icon_url: r.avatar } }] });
                            }), { context: { serv: t, user: a, avatar: c, song: l, top: n, userId: userId }, cluster: u });
                        s.send({ done: true });
                    });
                }),
                r.post("/add_pl_track", function (r, s) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const t = r.query.server, a = r.query.user, n = r.query.shard, u = r.query.avatar, o = r.body.name;
                        console.log("Loading pl track"),
                            console.log(o),
                            e.cluster.broadcastEval((e, r) => __awaiter(this, void 0, void 0, function* () {
                                const s = e.guilds.get(r.serv);
                                if (!s)
                                    return null;
                                console.log(r.song);
                                const t = e.queue.get(r.serv);
                                if (!t)
                                    return;
                                t.addTrack(r.song);
                                t.playing || t.play();
                                const channel = s.channels.get(t.player.connection.channelId);
                                if (!channel) {
                                    return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${r.song.info.title.slice(0, 40)} from the dashboard`, icon_url: r.avatar } }] });
                                }
                                if (channel && channel.type !== 2)
                                    return null;
                                channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                    e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${r.song.info.title.slice(0, 40)} from the dashboard`, icon_url: r.avatar } }] });
                            }), { context: { serv: t, user: a, avatar: u, song: o }, cluster: n }),
                            s.send({ done: true });
                    });
                });
        });
    }
}
exports.Server = Server;
