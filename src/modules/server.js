const express = require("express"),
    bodyParser = require("body-parser");
class apiManager {
    constructor(e, r) {
        (this.client = e), (this.options = r), 0 !== e.cluster.id || e.spawned || this.startServer(this.client);
    }
    async startServer(e) {
        const r = express();
        (e.spawned = !0),
        r.use(bodyParser.urlencoded({ extended: !1 })),
            r.use(bodyParser.json()),
            r.listen(8e3, function() {
                console.log("Server listening at port %d");
            }),
            r.get("/fetchserver", async function(r, s) {
                try {
                    const t = r.query.server,
                        a = r.query.asking,
                        n = (
                            await e.cluster.broadcastEval(
                                async(e, r) => {
                                    let s = e.guilds.cache.get(r.serv);
                                    if (!s) return null;
                                    let t = await e.mongoDB.getServer(s.id),
                                        a = e.queue.get(s.id),
                                        n = !1,
                                        u = s.voiceStates.cache.get(r.user);
                                    const o = await e.mongoDB.getUser(r.user);
                                    return (
                                        u &&
                                        (u.member.permissions.has("MANAGE_GUILD") && (n = !0),
                                            t.dj_role || (n = !0),
                                            t.dj_role && s.roles.cache.get(t.dj_role) && u.member.roles.cache.has(t.dj_role) && (n = !0),
                                            a && a.metadata.dj.id === r.id && (n = !0)), {
                                            data: { id: s.id, name: s.name, image: s.iconURL(), settings: t },
                                            exists: { server: !0, dj: n, voice: !!u, db: o },
                                            shardId: e.cluster.id,
                                            queue: a ? { current: a.current, paused: a.player.paused, incoming: a.queue, loop: a.repeat, recent: a.previousTracks } : null,
                                        }
                                    );
                                }, { context: { serv: t, user: a } }
                            )
                        ).find((e) => e);
                    s.send(n || { error: "Server not found", code: 404 });
                } catch (e) {
                    s.send({ error: "Server not found", code: 404 });
                }
            }),
            r.get("/removeSong", async function(r, s) {
                const t = r.query.server,
                    a = r.query.shard,
                    n = r.query.songId,
                    u = r.query.user,
                    o = r.query.avatar;
                await e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (!s) return;
                            let t = e.queue.get(r.serv);
                            if (!t) return;
                            let a = t.queue.find((e) => e.info.uri == r.songId);
                            return (
                                t.remove(a, !0),
                                s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} just removed ${a.info.title.slice(0, 50)} from the queue using the dashboard`, icon_url: r.avatar } }] }), { done: !0 }
                            );
                        }, { context: { songId: n, serv: t, user: u, avatar: o }, cluster: a }
                    ),
                    s.send({ done: !0 });
            }),
            r.post("/remove_pl_track", async function(r, s) {
                const { song: t, playlist: a } = r.body,
                    n = await e.mongoDB.getUser(r.query.user);
                if ((console.log(t), console.log(a), console.log(n), "Liked Song" === a)) return (n.songs = n.songs.filter((e) => e.info.uri !== t)), n.save(), !0; {
                    const e = n.playlists.find((e) => e.name === a);
                    if (!e) return console.log(a)((e.tracks = e.tracks.filter((e) => e.info.uri !== t))), (n.playlists = n.playlists.filter((e) => e.name !== a)), n.playlists.push(e), n.save();
                }
                s.send({ msg: "Done", code: 404 });
            }),
            r.get("/addServer", async function(r, s) {
                const t = r.query.server,
                    a = r.query.socket,
                    n = r.query.voice,
                    u = r.query.shard,
                    o = r.query.userId;
                e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            s && (e.queue.addWaiting({ serverId: r.serv, id: r.socket, clusterId: r.cluster }), e.queue.addWaitingUser(s.id, r.socket, r.userId, r.voice));
                        }, { context: { socket: a, serv: t, userId: o, voice: n }, cluster: u }
                    ),
                    s.send({ done: !0 });
            }),
            r.get("/cleanSocket", async function(r, s) {
                const t = r.query.socket,
                    a = r.query.shard;
                if (!t) return s.send({ error: !0, message: "No socket option provided" });
                await e.cluster.broadcastEval(async(e, r) => e.queue.cleanSocket(r.socket), { context: { socket: t }, cluster: a }), s.send({ done: !0 });
            }),
            r.get("/exists", async function(r, s) {
                try {
                    const t = r.query.server,
                        a = (
                            await e.cluster.broadcastEval(
                                async(e, r) => {
                                    if (e.guilds.cache.get(r.serv)) return !0;
                                }, { context: { serv: t } }
                            )
                        ).find((e) => e);
                    s.send(a ? { exists: !0 } : { error: "Server not found", code: 404 });
                } catch (e) {
                    return s.send({ code: 3 });
                }
            }),
            r.get("/pause", async function(r, s) {
                const t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (!s) return;
                            let t = e.queue.get(r.serv);
                            return t ?
                                (t.lastMessage &&
                                    (t.lastMessage.edit({
                                            embeds: t.lastMessage.embeds,
                                            components: [{
                                                components: [
                                                    { customId: "back_button", label: "Back", style: 3, type: "BUTTON" },
                                                    { customId: "stop", label: "Stop", style: 4, type: "BUTTON" },
                                                    { customId: "pause_btn", label: t.player.paused ? "Pause" : "Resume", style: 1, type: "BUTTON" },
                                                    { customId: "skip", label: "Skip", style: 3, type: "BUTTON" },
                                                    { customId: "like", emoji: "❤", style: 2, type: "BUTTON" },
                                                ],
                                                type: "ACTION_ROW",
                                            }, ],
                                        }),
                                        t.player.setPaused(!t.player.paused)),
                                    s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                    t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} has just ${t.player.paused ? "paused" : "unpaused"} the current song using the dashboard`, icon_url: r.avatar } }] }), { done: !0 }) :
                                void 0;
                        }, { context: { serv: t, user: a, avatar: u }, cluster: n }
                    ),
                    s.send({ done: !0 });
            }),
            r.get("/skip", async function(r, s) {
                const t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (!s) return null;
                            let t = e.queue.get(r.serv);
                            return t ?
                                (t.skip(),
                                    s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                    t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} has just skipped the current song using the dashboard`, icon_url: r.avatar } }] }), { done: !0 }) :
                                void 0;
                        }, { context: { serv: t, user: a, avatar: u }, cluster: n }
                    ),
                    s.send({ done: !0 });
            }),
            r.get("/back", async function(r, s) {
                const t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (s) {
                                let t = e.queue.get(r.serv);
                                if (t) {
                                    let e = t.previousTracks[t.previousTracks.length - 1];
                                    return (
                                        t.queue.unshift(e),
                                        (t.previousTracks = t.previousTracks.filter((r) => r.info.uri !== e.info.uri)),
                                        (t.backed = !0),
                                        t.skip(),
                                        s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                        t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} has just played ${e.info.title.slice(0, 30)} using the dashboard`, icon_url: r.avatar } }] }), { done: !0 }
                                    );
                                }
                            }
                        }, { context: { serv: t, user: a, avatar: u }, cluster: n }
                    ),
                    s.send({ done: !0 });
            }),
            r.get("/shuffle", async function(r, s) {
                const t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (!s) return null;
                            let t = e.queue.get(r.serv);
                            return t ?
                                ((t.queue = t.queue.sort(() => Math.random() - 0.5)),
                                    s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                    t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} has just shuffled the queue using the dashboard`, icon_url: r.avatar } }] }), { done: !0 }) :
                                null;
                        }, { context: { serv: t, user: a, avatar: u }, cluster: n }
                    ),
                    s.send({ done: !0 });
            }),
            r.get("/loop", async function(r, s) {
                const t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar;
                e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (!s) return null;
                            let t = e.queue.get(r.serv);
                            return t ?
                                ((t.repeat = "queue" === t.repeat ? "off" : "queue"),
                                    s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                    t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} has just set the repeat mode to ${t.repeat} using the dashboard`, icon_url: r.avatar } }] }), { done: !0 }) :
                                null;
                        }, { context: { serv: t, user: a, avatar: u }, cluster: n }
                    ),
                    s.send({ done: !0 });
            }),
            r.get("/recent", async function(r, s) {
                const t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.songId,
                    o = r.query.avatar;
                console.log(n + "For recent"),
                    e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (!s) return null;
                            let t = e.queue.get(r.serv);
                            if (!t) return null;
                            const a = t.previousTracks.find((e) => e.info.uri === r.songId);
                            return (
                                (t.previousTracks = t.previousTracks.filter((e) => e.info.uri !== a.info.uri)),
                                t.queue.splice(0, 0, a),
                                t.playing ? t.skip() : t.play(),
                                s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} just played ${a.info.title.slice(0, 40)} using the dashboard`, icon_url: r.avatar } }] }), { done: !0 }
                            );
                        }, { context: { serv: t, user: a, avatar: o, songId: u }, cluster: n }
                    ),
                    s.send({ done: !0 });
            }),
            r.get("/jump", async function(r, s) {
                const t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar,
                    o = r.query.songId;
                e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (!s) return;
                            let t = e.queue.get(r.serv);
                            if (!t) return;
                            let a = t.queue.find((e) => e.info.uri === r.songId);
                            return (
                                t.remove(a, !0),
                                t.queue.splice(0, 0, a),
                                t.skip(),
                                s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} just jumped to ${a.info.title.slice(0, 150)} using the dashboard`, icon_url: r.avatar } }] }), { done: !0 }
                            );
                        }, { context: { serv: t, user: a, avatar: u, songId: o }, cluster: n }
                    ),
                    s.send({ done: !0 });
            }),
            r.post("/add_result", async function(r, s) {
                const t = r.query.server,
                    a = r.query.user,
                    n = r.query.shard,
                    u = r.query.avatar,
                    o = r.body.name;
                e.cluster.broadcastEval(
                        async(e, r) => {
                            let s = e.guilds.cache.get(r.serv);
                            if (!s) return;
                            let t = e.queue.get(r.serv);
                            if (!t) return null;
                            let a = (await t.node.rest.resolve(r.song, "youtube")).tracks[0];
                            return (
                                (a.info.requester = { name: r.user, avatar: r.a }),
                                t ?
                                (t.addTrack(a),
                                    t.playing || t.play(),
                                    s.channels.cache.get(t.player.connection.channelId).members.size > 2 &&
                                    t.metadata.channel.send({ embeds: [{ color: "#3A871F", author: { name: `${r.user} has just added ${a.info.title} from the dashboard`, icon_url: r.avatar } }] }), { done: !0 }) :
                                void 0
                            );
                        }, { context: { serv: t, user: a, avatar: u, song: o }, cluster: n }
                    ),
                    s.send({ done: !0 });
            });
    }
}
module.exports = apiManager;