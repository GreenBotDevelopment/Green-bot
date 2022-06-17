const EventEmitter = require("events"),
    userSchema = require("../models/user"),
    SlashContext = require("../modules/SlashContext");
ms = require("ms");
class CommandHandler extends EventEmitter {
    constructor(e) {
        super(), (this.client = e);
    }
    build() {
        const e = this.exec.bind(this);
        return this.client.on("interactionCreate", e), this;
    }
    async exec(e) {
            if ((e.deferred || e.replied || "vote" === e.customId || (await e.deferReply()), e.isButton())) {
                if ("back_queue" === e.customId || "next_queue" === e.customId) return;
                if ("edit_pl" === e.customId) {
                    const t = await userSchema.findOne({ userID: e.member.id });
                    return void(t ?
                            e
                            .editReply({
                                    embeds: [{
                                                author: { name: "Playlist Selection", icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) },
                                                description: `Just send the number of the playlist you want to edit in this channel.\n${t.playlists.map((e, t) => `**${t + 1}**. [${e.name}](https://green-bot.app)`).join(" ")}`,
                                    color: "#3A871F",
                                },
                            ],
                            ephemeral: !0,
                        })
                        .then(async (s) => {
                            let a;
                            const n = e.channel.createMessageCollector({ filter: (t) => t.author.id === e.member.id, time: 6e4 });
                            n.on("collect", async (s) => {
                                "cancel" === s.content.toLowerCase() && (n.stop(), e.deleteReply()),
                                    isNaN(s.content) &&
                                    e.channel.send({ embeds: [{ description: "You must send a valid playlist number.", color: "#C73829" }], ephemeral: !0 }).then((e) => setTimeout(() => e.delete().catch((e) => { }), 4e3)),
                                    (a = t.playlists[s.content - 1])
                                        ? (s.delete(),
                                            n.stop(),
                                            e
                                                .editReply({
                                                    embeds: [
                                                        {
                                                            author: { name: "Playlist Name", icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) },
                                                            description: "Please choose a new name for this playlist. Just send the new name you want in this channel.",
                                                            color: "#3A871F",
                                                        },
                                                    ],
                                                    ephemeral: !0,
                                                })
                                                .then(async (s) => {
                                                    const n = e.channel.createMessageCollector({ filter: (t) => t.author.id === e.member.id, time: 6e4 });
                                                    n.on("collect", async (s) => {
                                                        "cancel" === s.content.toLowerCase() && (n.stop(), e.deleteReply()),
                                                            (a.name = s.content),
                                                            s.delete(),
                                                            n.stop(),
                                                            (t.playlists = t.playlists.filter((e) => e.name !== a.name)),
                                                            t.playlists.push(a),
                                                            t.save(),
                                                            e.editReply({
                                                                embeds: [
                                                                    {
                                                                        author: { name: "Playlist Edited", icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) },
                                                                        description: `Succesfully changed the name to **${a.name}**`,
                                                                        color: "#3A871F",
                                                                    },
                                                                ],
                                                                ephemeral: !0,
                                                            });
                                                    });
                                                }))
                                        : e.channel.send({ embeds: [{ description: "You must send a valid playlist number.", color: "#C73829" }], ephemeral: !0 }).then((e) => setTimeout(() => e.delete().catch((e) => { }), 4e3));
                            });
                        })
                        .catch((e) => { })
                    : e
                        .editReply({ embeds: [{ description: "You don't have any playlist yet", color: "#C73829" }], ephemeral: !0 })
                        .then(() => {
                            setTimeout(() => {
                                e.deleteReply().catch(null);
                            }, 3e3);
                        })
                        .catch((e) => { }));
            }
            const t = this.client.queue.get(e.guildId);
            if (!t || !t.queue || !t.playing)
                return e
                    .editReply({ embeds: [{ description: "No music is being playing on this server", color: "#C73829" }], ephemeral: !0 })
                    .then(() => {
                        setTimeout(() => {
                            e.deleteReply().catch(null);
                        }, 3e3);
                    })
                    .catch((e) => { });
            if ("like" === e.customId) {
                const s = await userSchema.findOne({ userID: e.member.id });
                if (s) {
                    if (s.songs.find((e) => e.info.uri === t.current.info.uri))
                        return (
                            (s.songs = s.songs.filter((e) => e.info.uri !== t.current.info.uri)),
                            s.save(),
                            e
                                .editReply({
                                    embeds: [
                                        {
                                            author: { name: "Song unliked", icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) },
                                            description: `Removed [${t.current.info.title}](https://green-bot.app) from your liked songs`,
                                            color: "#3A871F",
                                        },
                                    ],
                                    ephemeral: !0,
                                })
                                .catch((e) => { })
                        );
                    s.songs.push(t.current), s.save();
                } else new userSchema({ userID: e.member.id, playlists: [], songs: [t.current] }).save();
                return e
                    .editReply({
                        embeds: [
                            {
                                author: { name: "Song liked", icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) },
                                description: `Successfuly added [${t.current.info.title}](https://green-bot.app) to your liked songs${s ? (s.songs.length < 5 ? "\nYou can play your liked songs using `/pl-play liked-songs` " : "") : "\nYou can play your liked songs using `/pl-play liked-songs` "
                                    }`,
                                color: "#3A871F",
                            },
                        ],
                        ephemeral: !0,
                    })
                    .catch((e) => { });
            }
            if (!e.member.voice.channelId)
                return e
                    .editReply({ embeds: [{ description: "Please join a voice channel first", color: "#C73829" }], ephemeral: !0 })
                    .then(() => {
                        setTimeout(() => {
                            e.deleteReply().catch(null);
                        }, 3e3);
                    })
                    .catch((e) => { });
            const s = await this.client.mongoDB.getServer(e.guildId);
            if ("save_pl" === e.customId) {
                if (0 == t.queue.length)
                    return e
                        .editReply({ embeds: [{ description: "There is no track in your queue.", color: "#C73829" }], ephemeral: !0 })
                        .then(() => {
                            setTimeout(() => {
                                e.deleteReply().catch(null);
                            }, 3e3);
                        })
                        .catch((e) => { });
                const s = await userSchema.findOne({ userID: e.member.id });
                let a = `${e.guild.name}'s queue | #0`;
                if (s) {
                    if (s.playlists.find((e) => e.name === a)) {
                        let t = s.playlists.find((e) => e.name === a).name;
                        const n = Number(t.charAt(t.length - 1));
                        if (((a = `${e.guild.name}'s queue | #${n + 1}`), s.playlists.find((e) => e.name === a))) {
                            let t = s.playlists.find((e) => e.name === a).name;
                            const n = Number(t.charAt(t.length - 1));
                            if (((a = `${e.guild.name}'s queue | #${n + 1}`), s.playlists.find((e) => e.name === a))) {
                                let t = s.playlists.find((e) => e.name === a).name;
                                const n = Number(t.charAt(t.length - 1));
                                a = `${e.guild.name}'s queue | #${n + 1}`;
                            }
                        }
                    }
                    s.playlists.push({ name: a, tracks: t.queue }), s.save();
                } else new userSchema({ userID: e.member.id, playlists: [{ name: a, tracks: t.queue }] }).save();
                return e
                    .editReply({
                        embeds: [
                            {
                                author: { name: "Queue Saved", icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) },
                                description: `Your queue has been succesfully saved as a playlist.\nName: **${a}**`,
                                color: "#3A871F",
                            },
                        ],
                        ephemeral: !0,
                    })
                    .catch((e) => { });
            }
            if ("vote" !== e.customId && s.dj_role && !this.checkDJ(e, s, t))
                return e
                    .editReply({ embeds: [{ description: "You must have the DJ permissions to use this command", color: "#C73829" }], ephemeral: !0 })
                    .then(() => {
                        setTimeout(() => {
                            e.deleteReply().catch(null);
                        }, 3e3);
                    })
                    .catch((e) => { });
            if ("back_button" === e.customId) {
                if (0 == t.previousTracks.length)
                    return e
                        .editReply({ embeds: [{ description: "There is no previous track in your queue", color: "#C73829" }], ephemeral: !0 })
                        .then(() => {
                            setTimeout(() => e.deleteReply(), 5e3);
                        })
                        .catch((e) => { });
                t.queue.unshift(t.previousTracks[t.previousTracks.length - 1]),
                    (t.previousTracks = t.previousTracks.filter((e) => e.info.uri !== t.previousTracks[t.previousTracks.length - 1].info.uri)),
                    e.guild.channels.cache.get(t.player.connection.channelId).members.size > 2
                        ? e
                            .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just used the back button!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                            .then(() => {
                                setTimeout(() => e.deleteReply(), 5e3);
                            })
                            .catch((e) => { })
                        : e.deleteReply(),
                    (t.backed = !0),
                    t.skip();
            }
            if ("clear_queue" === e.customId) {
                if (0 == t.queue.length)
                    return e
                        .editReply({ embeds: [{ description: "There is no track in your queue.", color: "#C73829" }], ephemeral: !0 })
                        .then(() => {
                            setTimeout(() => e.deleteReply(), 5e3);
                        })
                        .catch((e) => { });
                (t.queue.length = 0),
                    (t.previousTracks = []),
                    e
                        .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just cleared the queue!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                        .then(() => {
                            setTimeout(() => e.deleteReply(), 5e3);
                        })
                        .catch((e) => { });
            }
            if ("seek_back_button" === e.customId) {
                let s = ms("10s");
                t.player.seekTo(parseInt(t.player.position - s)),
                    e
                        .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has forwarded the current song of 15s!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                        .then(() => {
                            setTimeout(() => e.deleteReply(), 5e3);
                        })
                        .catch((e) => { });
            }
            if ("seek_button" === e.customId) {
                let s = ms("10s");
                t.player.seekTo(t.player.position + s),
                    e
                        .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has advanced the current song of 15s!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                        .then(() => {
                            setTimeout(() => e.deleteReply(), 5e3);
                        })
                        .catch((e) => { });
            }
            if ("shuffle" === e.customId) {
                if (t.queue.length < 2) return e.editReply({ embeds: [{ description: "There are no enough tracks in the queue to shuffle it!", color: "#C73829" }], ephemeral: !0 }).catch((e) => { });
                (t.queue = t.queue.sort(() => Math.random() - 0.5)),
                    e
                        .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just shuffled the current queue!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                        .then(() => {
                            e.fetchReply().then((e) => {
                                setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                            });
                        })
                        .catch((e) => { });
            }
            if (
                ("pause_btn" === e.customId &&
                    (e.client.queue._sockets.find((t) => t.serverId === e.guild.id) &&
                        e.client.queue._sockets
                            .filter((t) => t.serverId === e.guild.id)
                            .forEach((s) => {
                                this.client.queue.emitOp({
                                    changes: ["CURRENT_SONG"],
                                    socketId: s.id,
                                    serverId: e.guild.id,
                                    queueData: { current: t.current, paused: !t.player.paused, loop: "queue" === t.repeat, recent: this.previousTracks },
                                });
                            }),
                        t.player.paused
                            ? (t.player.setPaused(!1),
                                t.lastMessage &&
                                t.lastMessage.edit({
                                    embeds: t.lastMessage.embeds,
                                    components: [
                                        {
                                            components: [
                                                { customId: "back_button", label: "Back", style: 3, type: "BUTTON" },
                                                { customId: "stop", label: "Stop", style: 4, type: "BUTTON" },
                                                { customId: "pause_btn", label: "Pause", style: 1, type: "BUTTON" },
                                                { customId: "skip", label: "Skip", style: 3, type: "BUTTON" },
                                                { customId: "like", emoji: "❤", style: 2, type: "BUTTON" },
                                            ],
                                            type: "ACTION_ROW",
                                        },
                                    ],
                                }),
                                e.guild.channels.cache.get(t.player.connection.channelId).members.size > 2
                                    ? e
                                        .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just unpaused the current song`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                                        .then(() => {
                                            e.fetchReply().then((e) => {
                                                setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                                            });
                                        })
                                        .catch((e) => { })
                                    : e.deleteReply())
                            : (t.player.setPaused(!0),
                                t.lastMessage &&
                                t.lastMessage.edit({
                                    embeds: t.lastMessage.embeds,
                                    components: [
                                        {
                                            components: [
                                                { customId: "back_button", label: "Back", style: 3, type: "BUTTON" },
                                                { customId: "stop", label: "Stop", style: 4, type: "BUTTON" },
                                                { customId: "pause_btn", label: "Resume", style: 1, type: "BUTTON" },
                                                { customId: "skip", label: "Skip", style: 3, type: "BUTTON" },
                                                { customId: "like", emoji: "❤", style: 2, type: "BUTTON" },
                                            ],
                                            type: "ACTION_ROW",
                                        },
                                    ],
                                }),
                                e.guild.channels.cache.get(t.player.connection.channelId).members.size > 2
                                    ? e
                                        .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just paused the current song`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                                        .then(() => {
                                            e.fetchReply().then((e) => {
                                                setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                                            });
                                        })
                                        .catch((e) => { })
                                    : e.deleteReply())),
                    "pause" === e.customId &&
                    (t.player.paused
                        ? e.editReply({ embeds: [{ description: "The player is already paused in this server", color: "#C73829" }], ephemeral: !0 })
                        : (t.player.setPaused(!0),
                            e
                                .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just paused the current song`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                                .then(() => {
                                    e.fetchReply().then((e) => {
                                        setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                                    });
                                })
                                .catch((e) => { }))),
                    "resume" === e.customId &&
                    (0 == t.player.paused
                        ? e.editReply({ embeds: [{ description: "The player is not already paused in this server", color: "#C73829" }], ephemeral: !0 })
                        : (t.player.setPaused(!1),
                            e
                                .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just resumed the current song`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                                .then(() => {
                                    e.fetchReply().then((e) => {
                                        setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                                    });
                                })
                                .catch((e) => { }))),
                    "autoplay" === e.customId &&
                    ("autoplay" === t.repeat
                        ? ((t.repeat = "off"),
                            e
                                .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just disabled the autoplay mode!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                                .then(() => {
                                    e.fetchReply().then((e) => {
                                        setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                                    });
                                })
                                .catch((e) => { }))
                        : ((t.repeat = "autoplay"),
                            e
                                .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just enabled the autoplay mode!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                                .then(() => {
                                    e.fetchReply().then((e) => {
                                        setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                                    });
                                })
                                .catch((e) => { }))),
                    "loop" === e.customId &&
                    ("queue" === t.repeat
                        ? ((t.repeat = "off"),
                            e
                                .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just disabled the loop mode!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                                .then(() => {
                                    e.fetchReply().then((e) => {
                                        setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                                    });
                                })
                                .catch((e) => { }))
                        : ((t.repeat = "queue"),
                            e
                                .editReply({ embeds: [{ color: "#3A871F", author: { name: `${e.user.username} has just enabled the loop mode!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) } }] })
                                .then(() => {
                                    e.fetchReply().then((e) => {
                                        setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                                    });
                                })
                                .catch((e) => { }))),
                    "skip" === e.customId)
            ) {
                if (0 == t.queue.length && "autoplay" !== t.repeat)
                    return e
                        .editReply({ embeds: [{ description: "There is nothing after this track in the queue", color: "#C73829" }], ephemeral: !0 })
                        .then(() => {
                            setTimeout(() => {
                                e.deleteReply().catch(null);
                            }, 3e3);
                        })
                        .catch((e) => { });
                e.guild.me.voice.channel.members.filter((e) => !e.user.bot).size >= 2 && s.vote_skip
                    ? t && t.voting
                        ? e.editReply({ embeds: [{ description: "There's already a vote in this server", color: "#C73829" }], ephemeral: !0 }).then(() => {
                            setTimeout(() => {
                                e.deleteReply().catch(null);
                            }, 3e3);
                        })
                        : e
                            .editReply({
                                embeds: [
                                    {
                                        author: { name: `${e.user.username} requested to skip the current track! Vote!`, icon_url: e.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://discord.gg/synAXZtQHM" },
                                        color: "#3A871F",
                                    },
                                ],
                                components: [{ components: [{ customId: "vote", style: 3, type: "BUTTON", label: "Vote to skip!" }], type: "ACTION_ROW" }],
                            })
                            .then(async () => {
                                t.voting = !0;
                                let s = 0,
                                    a = [];
                                const n = (function (e) {
                                    return Math.round((e + 1) / 2);
                                })(e.guild.me.voice.channel.members.filter((e) => !e.user.bot).size),
                                    r = e.channel.createMessageComponentCollector({ filter: (e) => "vote" === e.customId, time: 6e4 });
                                r.on("collect", async (o) => {
                                    if ((await o.deferReply(), a.includes(o.member.id)))
                                        return o.editReply({ embeds: [{ description: "You have already voted!", color: "#C73829" }], ephemeral: !0 }).then(() => {
                                            setTimeout(() => {
                                                e.deleteReply().catch(null);
                                            }, 3e3);
                                        });
                                    a.push(o.member.id),
                                        s++,
                                        o.deleteReply(),
                                        o.channel
                                            .send({
                                                embeds: [
                                                    {
                                                        author: {
                                                            name: `${o.member.user.username} voted to skip! (${s}/${n})`,
                                                            icon_url: o.member.user.displayAvatarURL({ size: 512, format: "png" }),
                                                            url: "https://discord.gg/synAXZtQHM",
                                                        },
                                                        color: "#3A871F",
                                                    },
                                                ],
                                            })
                                            .catch((e) => { }),
                                        s === n &&
                                        (r.stop(),
                                            (t.voting = !1),
                                            t.skip(),
                                            e
                                                .editReply({
                                                    embeds: [
                                                        { author: { name: `Skipped the current track! (${s}/${n} votes)`, icon_url: e.guild.iconURL({ size: 512, format: "png" }), url: "https://discord.gg/synAXZtQHM" }, color: "#3A871F" },
                                                    ],
                                                    components: [{ components: [{ customId: "vote", style: 3, type: "BUTTON", label: "Vote Ended!", disabled: !0 }], type: "ACTION_ROW" }],
                                                })
                                                .catch((e) => { })
                                                .then(() => { }),
                                            o.deleteReply().catch((e) => { }));
                                }),
                                    r.on("end", (a) => {
                                        t.voting && (t.voting = !1), s !== n && e.deleteReply();
                                    });
                            })
                    : (e.guild.channels.cache.get(t.player.connection.channelId).members.size > 2
                        ? e.editReply({
                            embeds: [
                                {
                                    color: "#3A871F",
                                    author: { name: `${e.user.username} has just skipped ${t.current.info.title.slice(0, 20)} using a button`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) },
                                },
                            ],
                        })
                        : e.deleteReply().catch((e) => { }),
                        t.skip());
            }
            "stop" === e.customId &&
                ((t.stopped = !0),
                    t.destroy(!1, !0),
                    e
                        .editReply({ embeds: [{ author: { name: `${e.user.username} has just stopped the playback using a button!`, icon_url: e.user.displayAvatarURL({ size: 512, dynamic: !0, format: "png" }) }, color: "#3A871F" }] })
                        .catch((e) => { }));
        } else
            try {
                if (!e.channel || "DM" === e.channel.type)
                    return e.editReply("You can't use interaction on private messages!\n\nYou need to invite me to a discord server to get started!\nJoin our discord server for more help: discord.gg/greenbot");
                const t = this.client.interactions.commands.get(e.commandName);
                if (!t) return;
                const s = await this.client.mongoDB.getServer(e.guildId),
                    a = new SlashContext(this.client, e, e.options.data, s);
                if (t.playerCheck && t.playerCheck.vote) {
                    const t = await this.client.mongoDB.checkPremium(e.guild.id, e.user.id),
                        s = await this.checkVoted(e.member.id);
                    if (!t && !s)
                        return a.reply({
                            embeds: [
                                {
                                    footer: { text: "You can bypass this restriction by purchasing our premium (green-bot.app/premium)" },
                                    color: "#C73829",
                                    description: "You need to vote the bot [here](ttps://green-bot.app/vote) to access this command.\nClick here to vote: [**green-bot.app/vote**](https://top.gg/bot/783708073390112830/vote)",
                                },
                            ],
                            components: [
                                {
                                    components: [
                                        { url: "https://green-bot.app/vote", label: "Vote", style: 5, type: "BUTTON" },
                                        { url: "https://green-bot.app/premium", label: "Premium", style: 5, type: "BUTTON" },
                                    ],
                                    type: "ACTION_ROW",
                                },
                            ],
                        });
                }
                return e.channel.permissionsFor(e.guild.me).has("EMBED_LINKS")
                    ? s.txts && 0 !== s.txts.length && !s.txts.includes(`${e.channel.id}`) && "textchannels" !== t.name
                        ? a.errorMessage(
                            `I am not allowed to answer to commands in this channel.\n${s.txts.length > 1 ? `Please use one of the following channels: ${s.txts.map((e) => `<#${e}>`).join(",")}` : `Please use the <#${s.txts[0]}> channel`}`
                        )
                        : t.permissions && !e.channel.permissionsFor(e.member).has(t.permissions)
                            ? a.errorMessage(`You need to have the \`${t.permissions[0].replace("MANAGE_GUILD", "Manage Guild")}\` permission to use this command`)
                            : t.playerCheck && t.playerCheck.premium && !(await this.client.mongoDB.checkPremiumUser(e.user.id)) && !(await this.client.mongoDB.checkPremium(e.guild.id))
                                ? a.reply({
                                    embeds: [
                                        {
                                            color: "#3A871F",
                                            author: { name: "Premium command", icon_url: this.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://green-bot.app/premium" },
                                            description:
                                                "This command is locked behind premium because it uses more CPU than the other commands.\n\nYou can purchase the premium on the [Patreon Page](https://green-bot.app/premium) to access this command",
                                        },
                                    ],
                                    components: [{ components: [{ url: "https://green-bot.app/premium", label: "Premium", style: 5, type: "BUTTON" }], type: "ACTION_ROW" }],
                                })
                                : t.playerCheck && t.playerCheck.voice && !e.member.voice.channelId
                                    ? a.errorMessage("You have to be connected in a voice channel before you can use this command!")
                                    : (t.playerCheck && t.playerCheck.dispatcher && !a.dispatcher) || (t.playerCheck && t.playerCheck.dispatcher && a.dispatcher && !a.dispatcher.playing)
                                        ? a.errorMessage("I am not currently playing music in this server. So it's impossible to do that")
                                        : t.playerCheck && t.playerCheck.dj && !this.checkDJC(a)
                                            ? a.errorMessage("You have to have the `Manage Messages` permissions or the DJ role to use this command!")
                                            : t.playerCheck && t.playerCheck.channel && e.guild.me.voice.channelId && e.guild.me.voice.channelId !== e.member.voice.channelId
                                                ? a.errorMessage(
                                                    "You need to be in the same voice channel as me (<#" +
                                                    e.guild.me.voice.channelId +
                                                    ">)! Want to listen music with another Green-bot? Consider inviting [Green-bot 2](https://discord.com/oauth2/authorize?client_id=913065900125597706&scope=applications.commands&permissions=3165184)!"
                                                )
                                                : void t.run({ ctx: a })
                    : e.editReply("❌ The bot must have the `Embed links` Discord permission to work properly! \n Please have someone from the staff give me this permission.");
            } catch (t) {
                return (
                    console.log(t),
                    console.log(`Erorr with ${e.commandName}`),
                    e.editReply({
                        embeds: [
                            {
                                color: "#3A871F",
                                author: { name: "Unexpected Error", icon_url: this.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://green-bot.app/premium" },
                                description: "An unexpected error has occured! Just try again!",
                            },
                        ],
                    })
                );
            }
    }
    async checkVoted(e) {
        let t = null;
        try {
            t = await this.client.dbl.hasVoted(e);
        } catch (e) {
            console.log("Aborted. is top.gg down??"), (t = !0);
        }
        return t;
    }
    checkDJC(e) {
        return !(e.guildDB.dj_role && (!e.dispatcher || e.dispatcher.metadata.dj !== e.member.id) && !e.member.roles.cache.has(e.guildDB.dj_role) && !e.member.permissions.has("MANAGE_GUILD"));
    }
    checkDJ(e, t, s) {
        return !t.dj_role || s.metadata.dj === e.member.id || !!e.member.roles.cache.has(t.dj_role) || !!e.member.permissions.has("MANAGE_GUILD");
    }
}
module.exports = CommandHandler;