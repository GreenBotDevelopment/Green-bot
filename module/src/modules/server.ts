"use strict";

import { BaseDiscordClient } from "../BaseDiscordClient";
import express, { application } from "express";
import body, { urlencoded, json } from "body-parser";

export class Server {
    client: BaseDiscordClient;
    app: application
    constructor(client: BaseDiscordClient, spawn?: any) {
        this.client = client;
        this.app = express();
        if (!spawn) this.startServer(client)
    }
    async startServer(e) {
        let r = this.app;
        r.use(urlencoded({ extended: false })),
            r.use(json()),
            r.listen((8000), function () {
                console.log("Server listening at port %d");
            }),
            r.get("/fetchserver", async function (r, s) {
                try {
                    let socketData = r.query.socket;
                    let t = r.query.server,
                        a = r.query.asking,
                        n = (
                            await e.cluster.broadcastEval(
                                async (e: BaseDiscordClient, r) => {
                                    let s = e.guilds.get(r.serv);
                                    if (!s) return null;
                                    let member = s.members.get(r.user) || await s.getRESTMember(r.user);
                                    if (!member) return { exists: { server: false } };
                                    if(!member.username) member = await s.getRESTMember(r.user);
                                    let t = await e.database.resolve(s.id),
                                        a = e.queue.get(s.id),
                                        n = false,
                                        u = member,
                                        o = await e.database.getUser(r.user),
                                        c = true,
                                        l = await e.database.checkPremium(r.serv, r.user, true);
                                    e.queue.addWaiting({ serverId: r.serv, id: r.socket, userId: r.user });
                                    e.queue.addWaitingUser(r.serv, r.socket, r.user);

                                    return (
                                        u && (u.permissions.has("manageGuild") && (n = true), t.djroles && t.djroles.length && u.roles.find((e) => t.djroles.includes(e)), a && a.metadata.dj.id === r.user && (n = true)),
                                        {
                                            data: { id: s.id, name: s.name, image: s.iconURL, settings: t },
                                            exists: { server: true, dj: !(!u || !u.permissions.has("manageGuild")) || n, voice: u.voiceState.channelID, db: o, hasVoted: !!l || !!c || null, premium: l },
                                            shardId: e._cluster.id,
                                            queue: a ? { channelId: a.player.connection.channelId,current: a.current, paused: a.player.paused, incoming: a.queue, loop: a.repeat, recent: a.previousTracks } : null,
                                        }
                                    );
                                },
                                { context: { serv: t, user: a, socket: socketData } }
                            )
                        ).flat().find((e) => e);
                    s.send(n || { error: "Server not found", code: 404 });
                } catch (e) {
                    console.log(e), s.send({ error: "Server not found", code: 404 });
                }
            }),
            r.get("/removeSong", async function (r, s) {
                let t = r.query.server,
                    a = r.query.shard,
                    n = r.query.songId,
                    u = r.query.user,
                    o = r.query.avatar;
                await e.cluster.broadcastEval(
                    async (e, r) => {
                        let s = e.guilds.get(r.serv);
                        if (!s) return;
                        let t = e.queue.get(r.serv);
                        if (!t) return;
                        let a = t.queue.find((e) => e.info.uri == r.songId);
                        t.remove(a, true);
                        const channel = s.channels.get(t.player.connection.channelId);
                        if (channel && channel.type !== 2) return null
                        if (!channel) return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just removed ${a.info.title.slice(0, 50)} from the queue using the dashboard`, icon_url: r.avatar } }] })
                        channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                            e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just removed ${a.info.title.slice(0, 50)} from the queue using the dashboard`, icon_url: r.avatar } }] })
                        return true
                    },
                    { context: { songId: n, serv: t, user: u, avatar: o }, cluster: a }
                ),
                    s.send({ done: true });
            }),
            r.post("/remove_pl_track", async function (r, s) {
                let { song: t, playlist: a } = r.body,
                    x = e,
                    n = await e.database.getUser(r.query.user);
                if ("Liked Song" === a) (n.songs = n.songs.filter((e) => e.info.uri !== t)), e.database.updateUser(n);
                else {
                    let e = n.playlists.find((e) => e.name === a);
                    if (!e) return console.log("No pl found");
                    (e.tracks = e.tracks.filter((e) => e.info.uri !== t)), (n.playlists = n.playlists.filter((e) => e.name !== a)), n.playlists.push(e), x.database.updateUser(n)
                }
                s.send({ msg: "Done", code: 404 });
            }),
            r.post("/handle_like", async function (r, s) {
                let { song: t } = r.body,
                    a = await e.database.getUser(r.query.user);
                a.songs.find((e) => e.info.uri === t.info.uri) ? (a.songs = a.songs.filter((e) => e.info.uri !== t.info.uri)) : a.songs.push(t), e.database.updateUser(a), s.send({ msg: "Done", code: 404 });
            }),
 
            r.get("/cleanSocket", async function (r, s) {
                let t = r.query.socket,
                    a = r.query.shard;
                if (!t) return s.send({ error: true, message: "No socket option provided" });
                await e.cluster.broadcastEval(async (e, r) => e.queue.cleanSocket(r.socket), { context: { socket: t }, cluster: a }), s.send({ done: true });
            }),
            r.get("/exists", async function (r, s) {
                try {
                    let t = r.query.server,
                        a = (
                            await e.cluster.broadcastEval(
                                async (e, r) => {
                                    if (e.guilds.get(r.serv)) return true;
                                },
                                { context: { serv: t } }
                            )
                        ).find((e) => e);
                    s.send(a ? { exists: true } : { error: "Server not found", code: 404 });
                } catch (e) {
                    return s.send({ code: 3 });
                }
            }),
            r.get("/on_db", async function (r, s) {
                try {
                    let t = r.query.server,
                        a = await e.client.database.resolve(t);
                    s.send(a ? { exists: true } : { exists: false });
                } catch (e) {
                    return s.send({ code: 3 });
                }
            }),
            r.get("/del_db", async function (r, s) {
                try {
                    let t = r.query.server,
                        a = await e.client.database.suppr(t);
                    s.send(a ? { exists: true } : { exists: false });
                } catch (e) {
                    return s.send({ code: 3 });
                }
            }),
            r.get("/pause", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                    async (e, r) => {
                        let s = e.guilds.get(r.serv);
                        if (!s) return;
                        let t = e.queue.get(r.serv);
                        if (!t) return
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
                            })

                        const channel = s.channels.get(t.player.connection.channelId);
                        if (!channel) {
                            return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just ${t.player.paused ? "paused" : "unpaused"} the current song using the dashboard`, icon_url: r.avatar } }] })
                        }
                        if (channel && channel.type !== 2) return null;
                        channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                            e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just ${t.player.paused ? "paused" : "unpaused"} the current song using the dashboard`, icon_url: r.avatar } }] })
                        return true;
                    },
                    { context: { serv: t, user: a, avatar: u }, cluster: n }
                ),
                    s.send({ done: true });
            }),
            r.get("/skip", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                    async (e, r) => {
                        let s = e.guilds.get(r.serv);
                        if (!s) return null;
                        let t = e.queue.get(r.serv);
                        if (!t) return null
                        t.skip()
                        const channel = s.channels.get(t.player.connection.channelId);
                        if (!channel) {
                            return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just skipped the current song using the dashboard`, icon_url: r.avatar } }] })
                        }
                        if (channel && channel.type !== 2) return null;
                        channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                            e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just skipped the current song using the dashboard`, icon_url: r.avatar } }] })
                        return true;

                    },
                    { context: { serv: t, user: a, avatar: u }, cluster: n }
                ),
                    s.send({ done: true });
            }),
            r.get("/back", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                    async (e, r) => {
                        let s = e.guilds.get(r.serv);
                        if (!s) return
                        let t = e.queue.get(r.serv);
                        if (!t) return
                        let song = t.previousTracks[t.previousTracks.length - 1];
                        t.queue.unshift(song);
                        t.previousTracks = t.previousTracks.filter((r) => r.info.uri !== song.info.uri);
                        t.backed = true;
                        t.skip();
                        const channel = s.channels.get(t.player.connection.channelId);
                        if (!channel) {
                            return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just played ${song.readableName} using the dashboard`, icon_url: r.avatar } }] })
                        }
                        if (channel && channel.type !== 2) return null;
                        channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                            e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just played ${song.readableName} using the dashboard`, icon_url: r.avatar } }] })
                        return true


                    },
                    { context: { serv: t, user: a, avatar: u }, cluster: n }
                ),
                    s.send({ done: true });
            }),
            r.get("/shuffle", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                    async (e, r) => {
                        let s = e.guilds.get(r.serv);
                        if (!s) return null;
                        let t = e.queue.get(r.serv);
                        if (!t) return
                        t.queue = t.queue.sort(() => Math.random() - 0.5);
                        const channel = s.channels.get(t.player.connection.channelId);
                        if (!channel) {
                            return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just shuffled the queue using the dashboard!`, icon_url: r.avatar } }] })
                        }
                        if (channel && channel.type !== 2) return null;
                        channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                            e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just shuffled the queue using the dashboard!`, icon_url: r.avatar } }] })
                        return true
                    },
                    { context: { serv: t, user: a, avatar: u }, cluster: n }
                ),
                    s.send({ done: true });
            }),
            r.get("/loop", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                    async (e, r) => {
                        let s = e.guilds.get(r.serv);
                        if (!s) return null;
                        let t = e.queue.get(r.serv);
                        if (!t) return
                        t.repeat = "queue" === t.repeat ? "off" : "queue";
                        const channel = s.channels.get(t.player.connection.channelId);
                        if (!channel) {
                            return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just set the repeat mode to ${t.repeat} using the dashboard`, icon_url: r.avatar } }] })
                        }
                        if (channel && channel.type !== 2) return null;
                        channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                            e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just set the repeat mode to ${t.repeat} using the dashboard`, icon_url: r.avatar } }] })

                        return true
                    },
                    { context: { serv: t, user: a, avatar: u }, cluster: n }
                ),
                    s.send({ done: true });
            }),
            r.get("/recent", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.songId,
                    o = r.query.avatar;
                e.cluster.broadcastEval(
                    async (e, r) => {
                        let s = e.guilds.get(r.serv);
                        if (!s) return null;
                        let t = e.queue.get(r.serv);
                        if (!t) return null;
                        let a = t.previousTracks.find((e) => e.info.uri === r.songId);
                        t.previousTracks = t.previousTracks.filter((e) => e.info.uri !== a.info.uri);
                        t.queue.splice(0, 0, a);
                        t.playing ? t.skip() : t.play();
                        const channel = s.channels.get(t.player.connection.channelId);
                        if (!channel) {
                            return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just played ${a.info.title.slice(0, 40)} using the dashboard`, icon_url: r.avatar } }] })

                        }
                        if (channel && channel.type !== 2) return null;
                        channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                            e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just played ${a.info.title.slice(0, 40)} using the dashboard`, icon_url: r.avatar } }] })

                        return true
                    },
                    { context: { serv: t, user: a, avatar: o, songId: u }, cluster: n }
                ),
                    s.send({ done: true });
            }),
            r.get("/jump", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar,
                    o = r.query.songId;
                e.cluster.broadcastEval(
                    async (e, r) => {
                        let s = e.guilds.get(r.serv);
                        if (!s) return;
                        let t = e.queue.get(r.serv);
                        if (!t) return;
                        let a = t.queue.find((e) => e.info.uri === r.songId);
                        t.remove(a, true);
                        t.queue.splice(0, 0, a);
                        t.skip();
                        const channel = s.channels.get(t.player.connection.channelId);
                        if (!channel) {
                            return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just jumped to ${a.info.title.slice(0, 150)} using the dashboard`, icon_url: r.avatar } }] })

                        }
                        if (channel && channel.type !== 2) return null;
                        channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                            e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} just jumped to ${a.info.title.slice(0, 150)} using the dashboard`, icon_url: r.avatar } }] })
                        return true
                    },
                    { context: { serv: t, user: a, avatar: u, songId: o }, cluster: n }
                ),
                    s.send({ done: true });
            }),
            r.post("/add_result", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = "null" !== r.query.top || null,
                    u = r.query.shard,
                    o = r.body.playlist,
                    c = r.query.avatar,
                    l = r.body.name,
                    userId = r.body.userId;
                    console.log("Huy wants to play result")
                    console.log(r.query.shard)
                if (o) {
                    console.log("no?")
                    let r = e.client.shoukaku.getNode();
                    await r.rest.resolve();
                } else
                    e.cluster.broadcastEval(
                        async (e: BaseDiscordClient, r) => {
                            let s = e.guilds.get(r.serv);
                            if (!s) return ;
                            let t = e.queue.get(r.serv);
                            let newq = false;
                            if (!t) {
                                newq = true;
                                const m = s.members.get(r.userId) || await s.getRESTMember(r.userId)
                                const db = await e.database.resolve(s.id);
                                const vc = m.voiceState.channelID && (s.channels.get(m.voiceState.channelID) || await e.getRESTChannel(m.voiceState.channelID))
                                let channel_send = db.textchannel ? s.channels.get(db.textchannel) ? s.channels.get(db.textchannel) : vc : vc;
                                t = await e.queue.create(
                                    {
                                        guild: s,
                                        author: m,
                                        me: s.members.get(e.user.id) || await s.getRESTMember(e.user.id),
                                        member: m,
                                        getVoiceChannel: async () => {
                                            return vc
                                        },
                                        successMessage: async (msg) => {
                                            return e.createMessage(vc.id || "", { content: `<@${r.userId}>`, embeds: [{ description: msg, color: 0x3a871f }] });

                                        },
                                        errorMessage: async (msg) => {
                                            return e.createMessage(vc.id, { content: `<@${r.userId}>`, embeds: [{ description: msg, color: 0xc73829 }] });

                                        },
                                        guildDB: db,
                                        channel: channel_send
                                    },
                                    e.shoukaku.getNode())

                            }
                            let a = (await t.node.rest.resolve(`${r.song}`)).tracks[0];
                            a.info.requester = { name: r.user, avatar: r.avatar, id: r.userId };
                            r.top
                                ? t.addTrack(a, null, true, true)
                                : t.addTrack(a, null, null, true)

                            if (newq) return
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${a.info.title.slice(0, 40)} from the dashboard`, icon_url: r.avatar } }] })

                            }
                            if (channel.type == 2) channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${a.info.title.slice(0, 40)} from the dashboard`, icon_url: r.avatar } }] })


                        },
                        { context: { serv: t, user: a, avatar: c, song: l, top: n, userId: userId }, cluster: u }
                    );
                s.send({ done: true });
            }),
            r.post("/pl_play", async function (r, s) {
             
                const serverId = r.query.serverId;
                const name = r.body.name;
                const user = r.body.user;

        console.log(`Play pl ${r.query.shardId}`)
                    e.cluster.broadcastEval(
                        async (e: BaseDiscordClient, r) => {
                            console.log("in broadcast")
                            let s = e.guilds.get(r.serv);
                            if (!s) return
                            let t = e.queue.get(r.serv);
                            let newq = false;
                            if (!t) {
                                newq = true;
                                const m = s.members.get(r.user.id) || await s.getRESTMember(r.user.id)
                                const db = await e.database.resolve(s.id);
                                const vc = m.voiceState.channelID && (s.channels.get(m.voiceState.channelID) || await e.getRESTChannel(m.voiceState.channelID))
                                let channel_send = db.textchannel ? s.channels.get(db.textchannel) ? s.channels.get(db.textchannel) : vc : vc;
                                t = await e.queue.create(
                                    {
                                        guild: s,
                                        author: m,
                                        me: s.members.get(e.user.id) || await s.getRESTMember(e.user.id),
                                        member: m,
                                        getVoiceChannel: async () => {
                                            return vc
                                        },
                                        successMessage: async (msg) => {
                                            return e.createMessage(vc.id || "", { content: `<@${r.user.id}>`, embeds: [{ description: msg, color: 0x3a871f }] });

                                        },
                                        errorMessage: async (msg) => {
                                            return e.createMessage(vc.id, { content: `<@${r.user.id}>`, embeds: [{ description: msg, color: 0xc73829 }] });

                                        },
                                        guildDB: db,
                                        channel: channel_send
                                    },
                                    e.shoukaku.getNode())

                            }
                            t.queue = [];
                           const pl =  await e.database.getUser(r.user.id);
                           if(r.name === "liked-songs"){
                            t.queue.push(...pl.songs)
                           }else{
                            const list = pl.playlists.find(p=> p.name === r.name)
                            t.queue.push(...list.track)
                           }
                           if(t.playing){
                            t.skip(true)
                           }else{
                            t.play()
                           }
                            if (newq) return
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added the playlist ${r.name} from the dashboard`, icon_url: r.avatar } }] })

                            }
                            if (channel.type == 2) channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${r.name} from the dashboard`, icon_url: r.avatar } }] })


                        },
                        { context: { serv: serverId, user: user, name: name  }, cluster: r.query.shardId }
                    );
                s.send({ done: true });
            }),
            r.post("/add_pl_track", async function (r, s) {
                let t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar,
                    o = r.body.name,
                    id = r.body.userId;
                console.log("Loading pl track"),
                    console.log(o),
                    e.cluster.broadcastEval(
                        async (e, r) => {
                            let s = e.guilds.get(r.serv);
                            if (!s) return null;
                            console.log(r.song);
                            let t = e.queue.get(r.serv);
                            let newq = false;
                            if (!t) {
                                newq = true;
                                const m = s.members.get(r.userId) || await s.getRESTMember(r.userId)
                                const db = await e.database.resolve(s.id);
                                const vc = s.channels.get(m.voiceState.channelID) || await e.getRESTChannel(m.voiceState.channelID)
                                let channel_send = db.textchannel ? s.channels.get(db.textchannel) ? s.channels.get(db.textchannel) : vc : vc;
                                t = await e.queue.create(
                                    {
                                        guild: s,
                                        author: m,
                                        me: s.members.get(e.user.id) || await s.getRESTMember(e.user.id),
                                        member: m,
                                        getVoiceChannel: async () => {
                                            return vc
                                        },
                                        successMessage: async (msg) => {
                                            return e.createMessage(vc.id, { content: `<@${r.userId}>`, embeds: [{ description: msg, color: 0x3a871f }] });

                                        },
                                        errorMessage: async (msg) => {
                                            return e.createMessage(vc.id, { content: `<@${r.userId}>`, embeds: [{ description: msg, color: 0xc73829 }] });

                                        },
                                        guildDB: db,
                                        channel: channel_send
                                    },
                                    e.shoukaku.getNode())

                            }
                            setTimeout(() => {
                               t .addTrack(r.song, null, null, true)
                               }, 500);
                           
                            if (newq) return
                            const channel = s.channels.get(t.player.connection.channelId);
                            if (!channel) {
                                return e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${r.song.info.title.slice(0, 40)} from the dashboard`, icon_url: r.avatar } }] })
                            }
                            if (channel && channel.type !== 2) return null;
                            channel.voiceMembers.filter(m => !m.bot).length >= 2 &&
                                e.createMessage(t.channelId, { embeds: [{ color: 0x3A871F, author: { name: `${r.user} has just added ${r.song.info.title.slice(0, 40)} from the dashboard`, icon_url: r.avatar } }] })


                        },
                        { context: { serv: t, user: a, userId: id, avatar: u, song: o }, cluster: n }
                    ),
                    s.send({ done: true });
            });
    }
}

