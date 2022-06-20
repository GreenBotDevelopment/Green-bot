class KongouDispatcher {
    constructor({
        client: t,
        metadata: e,
        player: i,
        node: s
    }) {
        i &&
            t &&
            ((this.client = t),
                (this.metadata = e),
                (this.player = i),
                (this.voting = !1),
                (this.skipped = !1),
                (this.queue = []),
                (this.repeat = "off"),
                (this.current = null),
                (this.timeout = null),
                (this.stopped = !1),
                (this.playing = !1),
                (this.lastMessage = null),
                (this.errored = "idk"),
                (this.backed = !1),
                (this.node = s),
                (this.moving = !1),
                (this._attempts = 0),
                (this.filters = []),
                (this.previousTracks = []),
                this.player.on("exception", (t) => {
                    this.metadata.channel.send({
                        embeds: [{
                            color: "#C73829",
                            author: {
                                name: "Track errored",
                                icon_url: this.metadata.guild.icon ? this.metadata.guild.iconURL({
                                    dynamic: !0
                                }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                            },
                            description: `[${this.current.info.title.slice(0, 50)}](https://discord.gg/greenbot) is not available in your country because it's age-restricted!`,
                        }, ],
                    });
                }),
                this.player.on("end", () => {
                    (this.errored = "No"), this.onEnd();
                }),
                this.player.on("start", () => {
                    this.errored = "No";
                }),
                this.player.on("closed", (t) => {

                    if (!this.exists) return this.delete();
                    if (1006 === e.code || 1000 == e.code) {
                        setTimeout(() => {
                            this.player.connection.resendServerUpdate(),
                                setTimeout(() => { this.player.resume(); }, 2000);
                        }, 2000);
                    } else {
                        if (e.code === 4014) {
                            // Most of time that's because shard lost connection
                            // Check: https://github.com/discordjs/discord.js/pull/7626
                            console.log(e)

                            setTimeout(() => {
                                this.player.connection.resendServerUpdate(),
                                    setTimeout(() => { this.player.resume(); }, 2000);
                            }, 2000);
                        }
                        console.log("unknow closure " + e.code + "")
                    }
                }));
    }
    static humanizeTime(t) {
        const e = Math.floor((t / 1e3) % 60);
        return [
            Math.floor((t / 1e3 / 60) % 60)
            .toString()
            .padStart(2, "0"),
            e.toString().padStart(2, "0"),
        ].join(":");
    }
    onEnd() {
        this.skipped ?
            (this.debug && console.log(`[${this.metadata.guild.name} (${this.metadata.guild.id})] return on onEnd for reason: \nQueue is skipped`), (this.skipped = null), !0) :
            this.stopped ?
            (this.debug && console.log(`[${this.metadata.guild.name} (${this.metadata.guild.id})] return on onEnd for reason: \nQueue is stopped`), (this.stopped = null)) :
            "song" === this.repeat ?
            this.current ? this.player.playTrack({ track: this.current.track }) : ((this.playing = null), this.backed ? (this.backed = !1) : this.previousTracks.push(this.current), this.lastMessage && this.lastMessage.delete().catch((e) => {}), this.play()) :
            ("queue" === this.repeat && this.queue.push(this.current),
                "autoplay" === this.repeat && 0 == this.queue.length ?
                this.handleAutoplay(this.current || this.previousTracks[this.previousTracks.length - 2]) :
                ((this.playing = null), this.backed ? (this.backed = !1) : this.previousTracks.push(this.current), this.lastMessage && this.lastMessage.delete().catch((e) => {}), this.play()))
    }
    get exists() {
        return this.client.queue.has(this.metadata.guild.id);
    }
    started() {
            if (
                ((this.playing = !0),
                    this.moving ||
                    (this.metadata.message ?
                        this.metadata.message.edit({
                                embeds: [{
                                            author: {
                                                name: this.metadata.guild.name,
                                                icon_url: this.metadata.guild.icon ? this.metadata.guild.iconURL({
                                                    dynamic: !0
                                                }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
                                                url: "https://discord.gg/greenbot",
                                            },
                                            description: "Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Vote](https://green-bot.app/vote) | [Commands](https://green-bot.app/commands)",
                                            image: {
                                                url: `https://img.youtube.com/vi/${this.current.info.identifier}/default.jpg`
                                            },
                                            footer: {
                                                text: `${this.queue.length} songs in the queue`,
                                                icon_url: this.client.user.displayAvatarURL({
                                                    dynamic: !0,
                                                    size: 512
                                                })
                                            },
                                            color: "#3A871F",
                                            fields: [{
                                                        name: "Now playing",
                                                        value: `${this.current ? this.current.info.title.slice(0, 40) : "Unknown track"} requested by ${this.current.info.requester ? `<@${this.current.info.requester.id}>` : "Unknown"}`,
								inline: !0,
							},],
						},],
					}) :
					this.metadata.guildDB.announce &&
					(this.metadata.guildDB.buttons ?
						this.metadata.channel
							.send({
								embeds: [{
									color: "#3A871F",
									author: {
										name: this.metadata.guild.name + " - Now playing",
										url: "https://green-bot.app",
										icon_url: this.metadata.guild.icon ? this.metadata.guild.iconURL({
											dynamic: !0
										}) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
									},
									description: `[${this.current ? this.current.info.title.slice(0, 40) : "Unknown track"}](https://discord.gg/greenbot) by [${this.current ? this.current.info.author.slice(0, 40) : "Unknow artist"
										}](https://discord.gg/greenbot), requested by [${this.current && this.current.info.requester ? this.current.info.requester.name : "Unknown user"}](https://green-bot.app)`,
								},],
								components: [{
									components: [{
										customId: "back_button",
										label: "Back",
										style: 3,
										type: "BUTTON"
									},
									{
										customId: "stop",
										label: "Stop",
										style: 4,
										type: "BUTTON"
									},
									{
										customId: "pause_btn",
										label: "Pause",
										style: 1,
										type: "BUTTON"
									},
									{
										customId: "skip",
										label: "Skip",
										style: 3,
										type: "BUTTON"
									},
									{
										customId: "like",
										emoji: "❤",
										style: 2,
										type: "BUTTON"
									},
									],
									type: "ACTION_ROW",
								},],
							})
							.then((t) => {
								this.lastMessage = t;
							}) :
						this.metadata.channel
							.send({
								embeds: [{
									color: "#3A871F",
									author: {
										name: " | Now playing",
										icon_url: this.metadata.guild.icon ? this.metadata.guild.iconURL({
											dynamic: !0
										}) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
									},
									description: `[${this.current.info.title.slice(0, 50)}](https://discord.gg/greenbot) by [${this.current.info.author.slice(0, 50)}](https://discord.gg/greenbot)`,
								},],
							})
							.then((t) => {
								this.lastMessage = t;
							}))),
				this.client.queue._sockets.find((t) => t.serverId === this.metadata.guild.id) &&
				this.client.queue._sockets
					.filter((t) => t.serverId === this.metadata.guild.id)
					.forEach((t) => {
						this.client.queue.emitOp({
							changes: ["CURRENT_SONG", "RECENT_SONGS", "NEXT_SONGS"],
							socketId: t.id,
							serverId: this.metadata.guild.id,
							queueData: {
								current: this.current,
								incoming: this.queue,
								paused: this.player.paused,
								loop: "queue" === this.repeat,
								recent: this.previousTracks
							},
						});
					}),
				"No" === this.errored)
		)
			return {
				errored: !1
			};
		"idk" !== this.errored ?
			"Yes" === this.errored &&
			(this.timeout && clearTimeout(this.timeout),
				(this.timeout = setTimeout(() => {
					"No" !== this.errored && (this.player.connection.paused || this.onEnd());
				}, this.current.info.length).unref())) :
			setTimeout(() => {
				"idk" === this.errored && (this.errored = "Yes");
			}, 2500).unref();
	}
	tracksAdded() {
		return (
			this.client.queue._waiting.find((t) => t.serverId === this.metadata.guild.id) &&
			this.client.queue._waiting
				.filter((t) => t.serverId === this.metadata.guild.id)
				.forEach((t) => {
					this.client.queue.emitOp({
						changes: ["NEXT_SONGS"],
						socketId: t.id,
						serverId: this.metadata.guild.id,
						queueData: {
							incoming: this.queue
						}
					}), this.client.queue.removeWaiting(t.id), this.client.queue._sockets.push(t);
				}),
			this.client.queue._sockets.find((t) => t.serverId === this.metadata.guild.id) &&
			this.client.queue._sockets
				.filter((t) => t.serverId === this.metadata.guild.id)
				.forEach((t) => {
					this.client.queue.emitOp({
						changes: ["NEXT_SONGS"],
						socketId: t.id,
						serverId: this.metadata.guild.id,
						queueData: {
							incoming: this.queue
						}
					});
				}), {
				ok: !0
			}
		);
	}
	addTrack(t, e, i) {
		return (
			t.info.requester || (t.info.requester = {
				name: e.username,
				id: e.id,
				avatar: e.displayAvatarURL({
					dynamic: !0
				})
			}),
			i && this.queue.length ? this.queue.splice(0, 0, t) : this.queue.push(t),
			this.playing || this.play(),
			this.client.queue._sockets.find((t) => t.serverId === this.metadata.guild.id) &&
			this.client.queue._sockets
				.filter((t) => t.serverId === this.metadata.guild.id)
				.forEach((t) => {
					this.client.queue.emitOp({
						changes: ["NEXT_SONGS"],
						socketId: t.id,
						serverId: this.metadata.guild.id,
						queueData: {
							incoming: this.queue
						}
					});
				}), {
				ok: !0
			}
		);
	}
	async skip(e) {
		this.skipped = !0;
		let t = this.queue.shift(),
			i = t;
		if (!t) return "autoplay" !== this.repeat || this.queue.length ? this.ended("autplay") : this.handleAutoplay(this.current);
		if (t.info.sp) {
			const e = this.node;
			if (!t.info.author) {
				const { getData: e } = require("spotify-url-info");
				if (!t.info.uri) return this.skip(!0);
				let i = await e(t.info.uri);
				if (!i) return this.skip(!0);
				t = { author: i.artists[0].name, title: i.name, url: t.info.uri, requester: t.info.requester, image: i.image };
			}
			let s = null;
			if (((s = (await e.rest.resolve(`ytsearch:${t.title ? t.title : t.info.title} ${t.author ? t.author : t.info.author}`)).tracks[0]) || (s = (await e.rest.resolve(`ytsearch:${t.title ? t.title : t.info.title}`)).tracks[0]), !s))
				return console.log(`No sources found ${t.title ? t.title : t.info.title} from ${t.author ? t.author : t.info.author}. Extracted data is a ${t.author ? "Playlist" : "Album"}`), this.skip(!0);
			(s.info.title = t.title ? t.title : t.info.title),
				(s.info.image = i.info.image),
				(s.info.author = t.author ? t.author : t.info.author),
				(s.info.requester = t.requester ? t.requester : t.info.requester),
				(s.info.uri = t.url ? t.url : t.info.uri),
				(t = s);
		}
		return (
			"queue" === this.repeat && this.queue.push(this.current),
			setTimeout(() => {
				this.skipped = null;
			}, 2e3),
			this.previousTracks.push(this.current),
			(this.current = t),
			this.timeout && clearTimeout(this.timeout),
			this.lastMessage && this.lastMessage.delete().catch((e) => { }),
			this.current ? this.player.playTrack({ options: { noReplace: e || !1 }, track: this.current.track }) && this.started() : this.skip(!0)
		);
	}
	async play() {
		if (this.stopped) return void (this.stopped = !1);
		if (!this.exists || !this.queue.length || 0 == this.queue.length) return this.ended();
		let t = this.queue.shift(),
			e = t;
		if (!this.queue) return console.log("Wut"), this.destroy();
		if ((t || (e = this.queue[0]), !e)) return console.log("Wut"), this.destroy();
		if (e.info.sp)
			if (e.info.uri && this.client.shoukaku.cache.find((t) => t.uri === e.info.uri)) e = this.client.shoukaku.cache.find((t) => t.uri === e.info.uri).data;
			else {
				const t = this.node;
				if (!e.info.author) {
					const {
						getData: t
					} = require("spotify-url-info");
					if (!e.info.uri) return console.log(e.info), this.skip(!0);
					let i = await t(e.info.uri);
					if (!i) return console.log("not found for " + e.info.uri), this.skip(!0);
					e = {
						author: i.artists[0].name,
						title: i.name,
						url: e.info.uri,
						requester: e.info.requester
					};
				}
				let i = null;
				if (
					((i = (await t.rest.resolve(`ytsearch:${e.title ? e.title : e.info.title} ${e.author ? e.author : e.info.author}`)).tracks[0]) ||
						(i = (await t.rest.resolve(`ytsearch:${e.title ? e.title : e.info.title}`)).tracks[0]),
						!i)
				)
					return console.log(`No sources found ${e.title ? e.title : e.info.title} from ${e.author ? e.author : e.info.author}. Extracted data is a ${e.author ? "Playlist" : "Album"}`), this.skip(!0);
				(i.info.title = e.title ? e.title : e.info.title),
					(i.info.author = e.author ? e.author : e.info.author),
					(i.info.requester = e.requester ? e.requester : e.info.requester),
					(i.info.uri = e.url ? e.url : e.info.uri),
					(e = i),
					this.client.shoukaku.cache.find((t) => t.uri === i.info.uri) || this.client.shoukaku.cache.push({
						uri: i.info.uri,
						data: i
					});
			}
		return (this.current = e || t || this.queue[0]), this.current ? ((this.playing = !0), this.player.playTrack({ track: this.current.track }), this.started()) : this.skip(!0);
	}
	async handleAutoplay(t) {
		if (!t.info) return console.log(t);
		const e = this.node,
			i = await e.rest.resolve(`ytsearch:${t.info.author}`);
		let s = i.tracks[Math.floor(Math.random() * i.tracks.length)];
		return s ?
			(this.previousTracks.find((t) => t.info.url === s.info.url) && (s = i.tracks[Math.floor(Math.random() * i.tracks.length)]),
				(s.info.requester = {
					name: "Autoplay System",
					id: "783708073390112830"
				}),
				this.queue.push(s),
				this.play()) :
			this.destroy();
	}
	remove(t, e) {
		if (
			(this.client.queue._sockets.find((t) => t.serverId === this.metadata.guild.id) &&
				!e &&
				this.client.queue._sockets
					.filter((t) => t.serverId === this.metadata.guild.id)
					.forEach((e) => {
						this.client.queue.emitOp({
							changes: ["TRACK_REMOVED"],
							socketId: e.id,
							serverId: this.metadata.guild.id,
							queueData: {
								uri: isNaN(t) ? t.info.uri : this.queue[t].info.uri
							}
						});
					}),
				isNaN(t))
		)
			this.queue = this.queue.filter((e) => e.info.uri !== t.info.uri);
		else {
			let e = this.queue[t];
			e && (this.queue = this.queue.filter((t) => t.info.uri !== e.info.uri));
		}
		return !0;
	}
	delete(t) {
		return (
			this.client.queue._sockets.find((t) => t.serverId === this.metadata.guild.id) &&
			this.client.queue._sockets
				.filter((t) => t.serverId === this.metadata.guild.id)
				.forEach((t) => {
					this.client.queue.emitOp({
						changes: ["DESTROY"],
						socketId: t.id,
						serverId: this.metadata.guild.id,
						queueData: {
							current: null,
							incoming: [],
							recent: []
						}
					}), this.client.queue.addWaiting(t);
				}),
			t &&
			!this.metadata.message &&
			this.metadata.channel
				.send({
					embeds: [{
						title: "Queue Concluded",
						color: "#F0B02F",
						description: "Queue has ended! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)"
					}]
				})
				.catch(() => null),
			this.player.connection.disconnect(),
			this.lastMessage && this.lastMessage.delete().catch((t) => { }),
			this.client.queue.delete(this.metadata.guild.id),
			this.metadata.message &&
			this.metadata.message.edit({
				embeds: [{
					author: {
						name: this.metadata.guild.name,
						icon_url: this.metadata.guild.icon ? this.metadata.guild.iconURL({
							dynamic: !0
						}) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
						url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=8",
					},
					description: "Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Vote](https://green-bot.app/vote) | [Commands](https://green-bot.app/commands)",
					image: {
						url: "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png"
					},
					footer: {
						text: "Green-bot | Free music for everyone!",
						icon_url: this.client.user.displayAvatarURL({
							dynamic: !0,
							size: 512
						})
					},
					color: "#3A871F",
					fields: [{
						name: "Now playing",
						value: "__**Nothing playing**__",
						inline: !0
					}],
				},],
			}),
			!0
		);
	}
	ended() {
		this.metadata.channel
			.send({
				embeds: [{
					title: "Queue Concluded",
					color: "#F0B02F",
					description: "Queue has ended! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)"
				}]
			})
			.catch(() => null),
			(this.current = null),
			(this.playing = !1),
			this.lastMessage && this.lastMessage.delete().catch((t) => { }),
			this.client.queue._sockets.find((t) => t.serverId === this.metadata.guild.id) &&
			this.client.queue._sockets
				.filter((t) => t.serverId === this.metadata.guild.id)
				.forEach((t) => {
					this.client.queue.emitOp({
						changes: ["NEXT_SONGS", "CURRENT_SONG"],
						socketId: t.id,
						serverId: this.metadata.guild.id,
						queueData: {
							current: null,
							incoming: []
						}
					});
				});
	}
	destroy(t, e) {
		return (
			this.stopped ||
			e ||
			this.metadata.channel
				.send({
					embeds: [{
						title: "Queue Concluded",
						color: "#F0B02F",
						description: "Queue has ended! Enjoying music with me? Consider [Voting for me](https://top.gg/bot/783708073390112830/vote)"
					}]
				})
				.catch(() => null),
			this.client.queue._sockets.find((t) => t.serverId === this.metadata.guild.id) &&
			this.client.queue._sockets
				.filter((t) => t.serverId === this.metadata.guild.id)
				.forEach((t) => {
					this.client.queue.emitOp({
						changes: ["NEXT_SONGS", "RECENT_SONGS", "CURRENT_SONG", `${this.metadata.guildDB.h24 ? "lal" : "DESTROY"}`],
						socketId: t.id,
						serverId: this.metadata.guild.id,
						queueData: {
							current: null,
							incoming: [],
							recent: []
						},
					}),
						this.metadata.guildDB.h24 || this.client.queue.addWaiting(t);
				}),
			t ?
				this.delete() :
				((this.queue.length = 0),
					this.playing && this.player.stopTrack(),
					(this.queue.repeat = "off"),
					(this.current = null),
					(this.backed = !1),
					(this.playing = !1),
					this.lastMessage && this.lastMessage.delete().catch((t) => { })),
			this.metadata.message &&
			this.metadata.message.edit({
				embeds: [{
					author: {
						name: this.metadata.guild.name,
						icon_url: this.metadata.guild.icon ? this.metadata.guild.iconURL({
							dynamic: !0
						}) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128",
						url: "https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=8",
					},
					description: "Send a music name/link bellow this message to play music.\n[Invite me](https://green-bot.app/invite) | [Premium](https://green-bot.app/premium) | [Vote](https://green-bot.app/vote) | [Commands](https://green-bot.app/commands)",
					image: {
						url: "https://cdn.discordapp.com/attachments/893185846876975104/900453806549127229/green_bot_banner.png"
					},
					footer: {
						text: "Green-bot | Free music for everyone!",
						icon_url: this.client.user.displayAvatarURL({
							dynamic: !0,
							size: 512
						})
					},
					color: "#3A871F",
					fields: [{
						name: "Now playing",
						value: "__**Nothing playing**__",
						inline: !0
					}],
				},],
			}),
			t &&
			this.metadata.channel
				.send({
					embeds: [{
						color: "#F0B02F",
						description: "The channel has been empty for more than 10 minutes so I destroyed the player!\nYou can disable this by enabling the [24/7 mode](https://guide.green-bot.app/configuration/24-7-playback)",
					},],
				})
				.catch((t) => { }), {
				sent: t
			}
		);
	}
}
module.exports = KongouDispatcher;