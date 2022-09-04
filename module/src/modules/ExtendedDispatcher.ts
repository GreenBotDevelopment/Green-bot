import { Collection, Constants, Guild, GuildChannel, Message, Shard, User } from "eris";
import { Node, Player, PlayerEvent, Track, TrackEndEvent, TrackExceptionEvent } from "shoukaku";
import { BaseDiscordClient } from "../BaseDiscordClient";
import fetch from "node-fetch";
import pkgx from "spotify-url-info"
const { getData, getPreview } = pkgx(fetch)

export function humanizeTime(e) {
    const t = Math.floor((e / 1e3) % 60);
    return [
        Math.floor((e / 1e3 / 60) % 60)
            .toString()
            .padStart(2, "0"),
        t.toString().padStart(2, "0"),
    ].join(":");
}


class dispatcherMetadata {
    channelId: string;
    guild: {
        name: string, iconURL: string, id: string, channels?: Collection<GuildChannel>;
    };
    message?: Message;
    guildDB: any;
    dj: string;
}
function readable(title: string) {
    return (title.length > 50 ? title.slice(0, 50) + "..." : title)
        .replace("[", "")
        .replace("]", "")
        .replace("[", "")
        .replace("]", "")
        .replace("(Official Music Video)", "")
        .replace("(Clip Officiel)", "")
        .replace("(Official Lyric Video)", "")
}

class Song implements Track {
    track: string;
    id: number;
    info: {
        identifier: string;
        isSeekable: boolean;
        author: string;
        length: number;
        isStream: boolean;
        leaveTimeout: any;
        position: number;
        sp?: any;
        title: string;
        uri: string;
        sourceName: string;
        image: string;
        requester: { name: string, id?: string, avatar: string }
    }

    constructor(track: any, user?: User) {
        this.track = track.track;
        this.info = track.info;
        if (!this.info || !this.info.identifier) console.log(track.info)
        this.id = Math.trunc((Math.random() * 5) * Date.now())
        this.info ? this.info.image = "https://img.youtube.com/vi/" + track.info?.identifier + "/hqdefault.jpg" : ""
        if (user) this.info.requester = { name: user.username, avatar: user.dynamicAvatarURL(), id: user.id }
    }


    public get readableName(): string {
        return (this.info.title.length > 50 ? this.info.title.slice(0, 50) + "..." : this.info.title)
            .replace("[", "")
            .replace("]", "")
            .replace("[", "")
            .replace("]", "")
            .replace("(Official Music Video)", "")
            .replace("(Clip Officiel)", "")
            .replace("(Official Lyric Video)", "")
    }

}

export class ExtendedDispatcher {
    private importantCodes: Array<Number>;
    private client: BaseDiscordClient;
    public metadata: dispatcherMetadata;
    public player: Player;
    public reconnects: number;
    voting: boolean;
    skipped: boolean;
    queue: Array<Song>;
    current: Song | null;
    node: Node;
    noFailureMode: boolean;
    instantSkipMode: boolean;
    stopped: boolean;
    playing: boolean;
    errors: number;
    lastMessage: string;
    repeat: "queue" | "song" | "autoplay" | "off";
    debug: boolean;
    errored: "idk" | "yes" | "no";
    backed: boolean;
    filters: Array<string>;
    reconnecting: boolean;
    channelId: string;
    timeout: any;
    previousTracks: Array<Song>;
    constructor(client: BaseDiscordClient, metadata: dispatcherMetadata, player: Player, node: Node) {
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
        this.importantCodes = [1006, 4014, 1000]
        this.stopped = false;
        this.playing = false;
        this.backed = false;
        this.node = node;
        this.errors = 0;
        this.filters = [];
        this.errored = this.noFailureMode ? "yes" : "idk";

        this.channelId = metadata.channelId;
        this.previousTracks = [];

        this.player.on("exception", async (event: TrackExceptionEvent) => {
            this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { })
            this.errors++;
            if (this.errors >= 6) {
                this.errors = 0;
                this.player.move([...this.client.shoukaku.nodes].find(n => n[1].name !== this.player.node.name)[1].name)
                return
            }
            if (this.queue.length > 5) return;
            this.errored = "no";
            if (this.debug) console.log(`[Dispatcher => ${this.metadata.guild.id}] Track failed to play ( ${this.current?.info.title} ) for reason: ${event.error}. Cause: ${event.exception?.cause}`)
            if (this.noFailureMode) this.onEnd();
            if (this.metadata.guildDB.announce) {
                this.client.createMessage(this.channelId, {
                    embeds: [
                        {
                            color: 0xC73829,
                            author: {
                                name: "Track errored",
                                icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                            },
                            description: `[${this.current.info.title.slice(0, 50)}](${this.current.info.uri}) is not available in your country because it's age-restricted!`,
                        },
                    ],
                })
            }
        })

        this.player.on("end", (op: TrackEndEvent) => {
            if (this.noFailureMode) return
            this.errored = "no";
            this.onEnd(op);
            if (this.debug) console.log(`[Dispatcher => ${this.metadata.guild.id}] Received end event from lavalink websocket (end): ${op}`)
        })
        this.player.on("start", () => {
            if (this.noFailureMode) return;
            (this.errored = "no"), this.debug && console.log("OnStart +" + this.metadata.guild.id);
        })

    }
    public deleteLast() {
        if (!this.lastMessage) return
        this.client.deleteMessage(this.channelId, this.lastMessage)
            .then(() => {
                this.lastMessage = null;
            })
            .catch(err => {

            });
        return true
    }

    private wait(ms: number) {
        return new Promise((b) => setTimeout(b, ms).unref());
    }

    private async close(e) {
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

    }

    public reconnect(tries: number) {
        if (this.reconnecting) return;
        this.reconnecting = true;
        let _current = 0;
        for (_current < tries; _current++;) {
            this.wait(1000)
            this.node.joinChannel({
                guildId: this.metadata.guild.id,
                shardId: this.player.connection.shardId,
                channelId: this.player.connection.channelId,
                deaf: true
            }).then(s => {
                this.reconnecting = false;
            })
            this.player.resume();
        }

    }

    private onEnd(data?: TrackEndEvent) {
        if (data) {
            if (data.reason === "REPLACED") return this.debug && console.log("Replaced")
            if (data.reason === "STOPPED") return this.debug && console.log("Stopped")
        }


        if (!this.current) {
            this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { })
            this.play();
            return
        }

        switch (this.repeat) {
            case "song":
                this.player.playTrack({ track: this.current.track, options: { startTime: this.instantSkipMode ? 700 : 0 } })
                break;

            case "queue":
                if (!this.queue.find(sg => sg.info.title === this.current.info.title)) this.queue.push(this.current)
                this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { })
                this.play()
                break;

            case "autoplay":
                if (!this.queue.length && this.previousTracks.length) {
                    this.previousTracks.push(this.current);
                    this.handleAutoplay(this.current || this.previousTracks[this.previousTracks.length - 2])
                    this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { })

                    break;
                }
            default:
                this.playing = false;
                this.backed ? (this.backed = false) : this.previousTracks.push(this.current);
                this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { })

                this.play()
                break;
        }

        return this.repeat;
    }
    get exists() {
        return this.client.queue.has(this.metadata.guild.id);
    }
    async started() {
        this.playing = true;
        if (this.errored === "yes" && this.current && this.current.info.isStream) return this.skip();
        let songName = this.current && this.current.info
            ? readable(this.current.info.title)
            : "Unknown track"
        if (!songName || songName === undefined) {
            console.log("Song name undefined")
            console.log(this.current)
        }
        if (this.metadata.guildDB.buttons) {
            this.client.createMessage(this.channelId, {
                embeds: [
                    {
                        color: 0x3a871f,
                        author: {
                            name: this.metadata.guild.name + " - Now playing",
                            url: "https://discord.gg/greenbot",
                            icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                        },
                        description: `[${songName}](https://discord.gg/greenbot) by [${this.current ? this.current.info.author.slice(0, 40) : "Unknow artist"}](${this.current.info.uri}), requested by [${this.current && this.current.info.requester ? this.current.info.requester.name : "Unknown user"
                            }](https://discord.gg/greenbot)`,
                    },
                ],
                components: [
                    {
                        components: [
                            { custom_id: "back_button", label: "Previous", style: 3, type: 2 },
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
                    if (err.toString().includes("Unknown Channel")) return this.delete()
                })
        } else {
            this.client.createMessage(this.channelId, {
                embeds: [
                    {
                        color: 0x3a871f,
                        author: {
                            name: this.metadata.guild.name + " - Now playing",
                            url: "https://discord.gg/greenbot",
                            icon_url: this.metadata.guild.iconURL ? this.metadata.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                        },
                        description: `[${songName}](https://discord.gg/greenbot) by [${this.current ? this.current.info.author.slice(0, 40) : "Unknow artist"}](https://discord.gg/greenbot), requested by [${this.current && this.current.info.requester ? this.current.info.requester.name : "Unknown user"
                            }](https://discord.gg/greenbot)`,
                    },
                ]
            })
                .then((message) => {
                    this.lastMessage = message.id;
                })
                .catch(err => {
                    if (err.toString().includes("Unknown Channel")) return this.delete(true)
                })

        }




        this.client.queue.emitOp({
            changes: ["CURRENT_SONG", "RECENT_SONGS", "NEXT_SONGS"],
            serverId: this.metadata.guild.id,
            queueData: { current: this.current, incoming: this.queue, paused: this.player.paused, loop: "queue" === this.repeat, recent: this.previousTracks },
        });

        if (!this.current && !this.player.track) return this.play()
        if (this.errored === "no") return;
        if (!this.noFailureMode) {
            switch (this.errored) {
                case "idk":
                    setTimeout(() => {
                        if ("idk" === this.errored) {
                            this.errored = "yes";
                            this.timeout && clearTimeout(this.timeout);
                            this.timeout = setTimeout(() => {
                                if (!this.exists) return;
                                if (!this.current) return
                                "yes" === this.errored && (this.player.paused || this.onEnd());
                            }, this.current.info.length > 10000000 ? Math.trunc(this.current.info.length / 100000000000) : this.current.info.length).unref();
                        }
                    }, 2500).unref()
                    break;
                case "yes":
                    this.timeout && clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        if (!this.exists) return;
                        if (!this.current) return
                        "yes" === this.errored && (this.player.paused || this.onEnd());
                    }, this.current.info.length > 10000000 ? Math.trunc(this.current.info.length / 100000000000) : this.current.info.length).unref();
                    break;

                default:
                    break;
            }
        } else {
            this.timeout && clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                if (!this.exists || this.stopped) return;
                if (!this.current) return
                "yes" === this.errored && (this.player.paused || this.onEnd());
            }, this.current.info.length > 10000000 ? Math.trunc(this.current.info.length / 100000000000) : this.current.info.length).unref();
        }
        return true
    }
    pause(mode: boolean) {
        this.player.setPaused(mode);
        if (mode === false) {
            if (this.errored === "yes") {
                this.timeout = setTimeout(() => {
                    if (!this.exists || this.stopped) return;
                    if (!this.current) return
                    "yes" === this.errored && (this.player.paused || this.onEnd());
                }, this.current.info.length - this.player.position)
            }
        } else {
            if (this.errored === "yes") this.timeout && clearTimeout(this.timeout);
        }
        return mode
    }
    tracksAdded() {
        this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
            this.client.queue.emitOp({ changes: ["NEXT_SONGS"], serverId: this.metadata.guild.id, queueData: { incoming: this.queue } });
        return true
    }
    // eslint-disable-next-line
    addTrack(track?: Song, user?: User, addTop?: boolean, dashboard?: boolean) {
        let song = track;
        if (user) song = new Song(track, user);
        addTop && this.queue.length ? this.queue.splice(0, 0, song) : this.queue.push(song);
        if(this.playing){
         if(!dashboard){
            this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
            this.client.queue.emitOp({ changes: ["NEXT_SONGS"], serverId: this.metadata.guild.id, queueData: { incoming: this.queue } });
         }
         }else{
            this.play()
         }
     
        return song
    }

    parseTrack(track: Track, user?: User) {
        return new Song(track, user)
    }

    async skip(noReplace?: boolean) {
        if (noReplace && this.debug) console.log(`[Dispatcher => ${this.metadata.guild.id}] Skip on noReplace mode after error.`)
        let nextTrack = this.queue.shift();
        let nextTrackTemp;
        if (!nextTrack) {
            if (this.repeat === "autoplay" && this.previousTracks.length || this.repeat === "autoplay" && this.current) {
                this.current && this.previousTracks.push(this.current);
                this.handleAutoplay(this.current || this.previousTracks[this.previousTracks.length - 2])
            } else {
                this.player.stopTrack()
                this.ended();
            }
            return
        }
        if (nextTrack.info.sp) {
            if (!nextTrack.info.uri && !nextTrack.info.author) return this.skip(true);

            if (this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri)) {
                let x = nextTrack.info.requester;

                nextTrack = this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri).info
                nextTrack.info.requester = x;


            } else {
                if (!nextTrack.info.author) {
                    if (!nextTrack.info.uri) return this.skip(true);
                    let scrapedData = await getPreview(nextTrack.info.uri);
                    if (!scrapedData) return this.skip(true);
                    nextTrackTemp = { author: scrapedData.artist, title: scrapedData.title, url: nextTrack.info.uri, requester: nextTrack.info.requester, image: scrapedData.image };
                }
                let title = nextTrackTemp ? nextTrackTemp.title : nextTrack.info.title;
                const resolve = await this.node.rest.resolve(`ytmsearch:${title} ${nextTrackTemp ? nextTrackTemp.author : nextTrack.info.author}`);

                if (!resolve || !resolve.tracks.length) return this.skip(true)
                let song = resolve.tracks.slice(0, 6).find(tr => (tr.info.title.includes("lyrics") || tr.info.title.includes("music")) && tr.info.title.toLowerCase().includes(title.toLowerCase()))
                let finnal_track = new Song(song || resolve.tracks[0]);
                finnal_track.info.title = nextTrackTemp ? nextTrackTemp.title : nextTrack.info.title;
                finnal_track.info.image = nextTrack.info.image;
                finnal_track.info.author = nextTrackTemp ? nextTrackTemp.author : nextTrack.info.author;
                finnal_track.info.requester = nextTrack.info.requester;
                finnal_track.info.uri = nextTrackTemp ? nextTrackTemp.url : nextTrack.info.uri;
                nextTrack = finnal_track;
                if (!this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri)) this.client.shoukaku.cache.push({ id: nextTrack.info.uri, info: nextTrack })
            }
        }
        if ("queue" === this.repeat && this.current) {
            if (!this.queue.find(sg => sg.info.title === this.current.info.title)) {
                this.queue.push(this.current)
            }
        }
        return (

            this.current && this.previousTracks.push(this.current),
            this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { }),
            (this.current = nextTrack),
            this.current ? this.player.playTrack({ options: { noReplace: noReplace || false, startTime: this.instantSkipMode ? 700 : 0 }, track: this.current.track }) && this.started() : this.skip(true)
        );
    }
    async play() {
        if (this.debug) console.log(`[Dispatcher => ${this.metadata.guild.id}] Handling play function.`)
        if (!this.queue.length) return this.debug && console.log(`[${this.metadata.guild.name} (${this.metadata.guild.id})] return on play for reason: \nNo queue`), this.ended();
        let nextTrack = this.queue.shift();
        if (!nextTrack) return this.ended()
        let nextTrackTemp;
        if (!nextTrack) {
            if (this.repeat === "autoplay" && this.previousTracks.length) {
                this.current && this.previousTracks.push(this.current);
                this.handleAutoplay(this.current || this.previousTracks[this.previousTracks.length - 2])
            } else {
                this.ended()
            }
            return
        }
        if (nextTrack.info.sp) {
            if (!nextTrack.info.uri && !nextTrack.info.title) return this.skip(true);

            if (this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri)) {
                let x = nextTrack.info.requester;
                nextTrack = this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri).info
                nextTrack.info.requester = x;
            } else {
                if (!nextTrack.info.author || !nextTrack.info.title) {
                    if (!nextTrack.info.uri) return this.skip(true);
                    let scrapedData = await getPreview(nextTrack.info.uri);
                    if (!scrapedData) return this.skip(true);
                    nextTrackTemp = { author: scrapedData.artist, title: scrapedData.title, url: nextTrack.info.uri, requester: nextTrack.info.requester, image: scrapedData.image };
                }
                const resolve = await this.node.rest.resolve(`ytmearch:${nextTrackTemp ? nextTrackTemp.title : nextTrack.info.title} ${nextTrackTemp ? nextTrackTemp.author : nextTrack.info.author} audio`);
                if (!resolve || !resolve.tracks.length) return this.skip(true)
                let finnal_track = new Song(resolve.tracks[0]);
                finnal_track.info.title = nextTrackTemp ? nextTrackTemp.title : nextTrack.info.title;
                finnal_track.info.image = nextTrack.info.image;
                finnal_track.info.author = nextTrackTemp ? nextTrackTemp.author : nextTrack.info.author;
                finnal_track.info.requester = nextTrack.info.requester;
                finnal_track.info.uri = nextTrackTemp ? nextTrackTemp.url : nextTrack.info.uri;
                nextTrack = finnal_track;
                if (!this.client.shoukaku.cache.find(item => item.id === nextTrack.info.uri)) this.client.shoukaku.cache.push({ id: nextTrack.info.uri, info: nextTrack })
            }
        }
        this.current = nextTrack;
        return this.current ? ((this.playing = true), this.player.playTrack({ track: this.current.track, options: { startTime: this.instantSkipMode ? 700 : 0 } }), this.started()) : this.skip(true);
    }
    async handleAutoplay(song: Song) {
        const resolve = await this.node.rest.resolve(`ytmsearch:${song.info.author}`);
        if (!resolve || !resolve.tracks.length) return this.destroy(null, true)
        let choosed = new Song(resolve.tracks[Math.floor(Math.random() * resolve.tracks.length)], this.client.user);
        if (this.previousTracks.find((e) => e.info.uri === choosed.info.uri)) choosed = new Song(resolve.tracks[Math.floor(Math.random() * resolve.tracks.length)], this.client.user);
        this.queue.push(choosed);
        return this.player.track ? this.skip() : this.play;
    }
    remove(e, t) {

        if (!t && isNaN(e)) {
            this.queue = this.queue.filter((t) => t.info.uri !== e.info.uri);
        } else {
            let t = this.queue[e];
            t && (this.queue = this.queue.filter((e) => e.info.uri !== t.info.uri));
        }
        if (this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id)) {
            this.client.queue.emitOp({ changes: ["NEXT_SONGS"], serverId: this.metadata.guild.id, queueData: { incoming: this.queue } });
        }

        return true;
    }
    async delete(notifiy?: boolean) {
        this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { })
        this.player.connection.disconnect();
        this.timeout && clearTimeout(this.timeout);
        this.timeout = null;
        this.client.queue.delete(this.metadata.guild.id)
        if (notifiy && !this.metadata.message) {
            this.client.createMessage(this.channelId, { embeds: [{ title: "Queue Concluded", color: 0XF0B02F, description: "Your music queue is now ended, you can add music again using" + this.client.printCmd("play") + "! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)" }] }).catch(() => null)
        }
        this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
            this.client.queue.emitOp({ changes: ["DESTROY"], serverId: this.metadata.guild.id, queueData: { current: null, incoming: [], recent: [] } })
        return true

    }
    async ended(source?: string) {
        this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { })

        if (this.debug) console.log(`[Dispatcher => ${this.metadata.guild.id}] Ended received from source ${source} . ${this.queue.length ? "still some" : "no "} tracks in queue`)
        if (this.queue.length) return this.play();
        this.current = null
        this.playing = false
        this.timeout && clearTimeout(this.timeout)
        this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&

            this.client.queue.emitOp({ changes: ["NEXT_SONGS", "CURRENT_SONG"], serverId: this.metadata.guild.id, queueData: { current: null, incoming: [] } });
        this.client.createMessage(this.channelId, { embeds: [{ title: "Queue Concluded", color: 0XF0B02F, description: "Your music queue is now ended, you can add music again using" + this.client.printCmd("play") + "! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)" }] }).catch(() => null)
        if (this.metadata.guildDB.leave_settings.no_music === true) {
            this.player.connection.disconnect();

            this.client.queue.delete(this.metadata.guild.id)


        }
        return true;
    }
    async destroy(force?: boolean, send?: boolean) {
        this.client.deleteMessage(this.channelId, this.lastMessage).catch(err => { })

        this.client.queue._sockets.find((e) => e.serverId === this.metadata.guild.id) &&
            this.client.queue.emitOp({
                changes: ["NEXT_SONGS", "RECENT_SONGS", "CURRENT_SONG"],
                serverId: this.metadata.guild.id,
                queueData: { current: null, incoming: [], recent: [] },
            })
        if (force) {
            this.delete(false);
            this.client
                .createMessage(this.channelId, {
                    embeds: [
                        {
                            color: 0XF0B02F,
                            description: "No one has been listening for the past 5 minute, leaving the channel :wave:\n\nYou can disable this by enabling the **24/7 mode** using the " + this.client.printCmd("247") + " command!",
                        },
                    ],
                })
                .catch((e) => { })
        } else {
            this.queue.length = 0;
            this.playing && this.player.stopTrack();
            this.repeat = "off";
            this.current = null;
            this.backed = false;
            this.playing = false;
            this.timeout && clearTimeout(this.timeout);
             if (this.metadata.guildDB.leave_settings.no_music === true) {
            this.player.connection.disconnect();

            this.client.queue.delete(this.metadata.guild.id)


        }
        }

        if (!send && !force && !this.metadata.message) {
            this.client.createMessage(this.channelId, { embeds: [{ title: "Queue Concluded", color: 0XF0B02F, description: "Your music queue is now ended, you can add music again using" + this.client.printCmd("play") + "! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)" }] }).catch(() => null)
                .catch(() => null)
        }


        return true
    }
}
