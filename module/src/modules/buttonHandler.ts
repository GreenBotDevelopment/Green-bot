
import { BaseDiscordClient } from "../BaseDiscordClient";
import { SlashContext } from "../modules/SlashContext";
import { Constants } from "eris";
import { ExtendedDispatcher } from "./ExtendedDispatcher";

export class SlashManager {
    client: BaseDiscordClient;
    constructor(client: BaseDiscordClient) {
        this.client = client;
    }

    async resolvePartials(message: any) {
        let channel, guild, member, me;
        channel = this.client.getChannel(message.channel.id) || await this.client.getRESTChannel(message.channel.id);
        member = message.member && message.member.username ? message.member : channel.guild && channel.guild.name ? channel.guild.members.get(message.member.id) ? channel.guild.members.get(message.member.id) : await this.client.getRESTGuildMember(message.guildID, message.member.id) : await this.client.getRESTGuildMember(message.guildID, message.member.id);
        guild = this.client.guilds.get(message.guildID) && this.client.guilds.get(message.guildID).name ? this.client.guilds.get(message.guildID) : channel.guild.name ? channel.guild : member.guild.name ? member.guild : await this.client.getRESTGuild(message.guildID);
        me = guild.members.get(this.client.user.id) || await this.client.getRESTGuildMember(message.guildID, this.client.user.id);
        message.channel = channel;
        message.channel.guild = guild;
        message.member = member;
        return { channel, guild, member, me }
    }

    async handle(e: any) {
        if (!this.client.cluster.ready && this.client.cluster.maintenance) return
        if (this.client.collectors.handle(e, "button")) return
        if (!e.acknowledged && e.data.custom_id !== "vote") await e.defer();
        if (!e.guildID) return e.editOriginalMessage("You can't use slash commands on private messages!\n\nYou need to invite me to a discord server to get started!\nJoin our discord server for more help: discord.gg/greenbot");

        const { channel, guild, member, me } = await this.resolvePartials(e)
        if (e.type === 3) {
            const eligigle = this.client.shoukaku.checkEligible({ author: { id: e.member.id } })
            if (!eligigle && !(await this.client.database.checkPremium(e.guildID, e.member.id, true))) {
                return e.editOriginalMessage({
                    embeds: [{ description: "**Oops!** You need to wait 2 seconds beetween each button click! \n\n Want to bypass this? Become a [Premium](https://green-bot.app/premium) user " }],
                    ephemeral: true,
                })
                    .then(() => {
                        setTimeout(() => {
                            e.deleteOriginalMessage().catch(null);
                        }, 6000);
                    })
                    .catch((e) => { });
            }
            if (e.data && "back_queue" === e.data.custom_id || "next_queue" === e.data.custom_id) return;
            if ("edit_pl" === e.data.custom_id) {
                const t = await this.client.database.getUser(e.member.id)
                return void (t
                    ? e
                        .editOriginalMessage({
                            embeds: [
                                {
                                    author: { name: "Playlist Selection", icon_url: e.member.avatarURL },
                                    description: `Just send the number of the playlist you want to edit in this channel.\n${t.playlists.map((e, t) => `**${t + 1}**. [${e.name}](https://green-bot.app)`).join(" ")}`,
                                    color: 0x3A871F,
                                },
                            ],
                            ephemeral: true,
                        })
                        .then(async (s) => {
                            let a,
                                n = e.channel.createMessageCollector({ filter: (t) => t.author.id === e.member.id, time: 6e4 });
                            n.on("collect", async (s) => {
                                "cancel" === s.content.toLowerCase() && (n.stop(), e.deleteOriginalMessage()),
                                    isNaN(s.content) &&
                                    e.channel.createMessage({ embeds: [{ description: "You must send a valid playlist number.", color: 0xC73829 }] }).then((e) => setTimeout(() => e.delete().catch((e) => { }), 4e3)),
                                    (a = t.playlists[s.content - 1])
                                        ? (s.delete(),
                                            n.stop(),
                                            e
                                                .editOriginalMessage({
                                                    embeds: [
                                                        {
                                                            author: { name: "Playlist Name", icon_url: e.member.avatarURL },
                                                            description: "Please choose a new name for this playlist. Just send the new name you want in this channel.",
                                                            color: 0x3A871F,
                                                        },
                                                    ],
                                                    ephemeral: true,
                                                })
                                                .then(async (s) => {
                                                    const n = e.channel.createMessageCollector({ filter: (t) => t.author.id === e.member.id, time: 6e4 });
                                                    n.on("collect", async (s) => {
                                                        "cancel" === s.content.toLowerCase() && (n.stop(), e.deleteOriginalMessage()),
                                                            (a.name = s.content),
                                                            s.delete(),
                                                            n.stop(),
                                                            (t.playlists = t.playlists.filter((e) => e.name !== a.name)),
                                                            t.playlists.push(a),
                                                            t.save(),
                                                            e.editOriginalMessage({
                                                                embeds: [
                                                                    {
                                                                        author: { name: "Playlist Edited", icon_url: e.member.avatarURL },
                                                                        description: `Succesfully changed the name to **${a.name}**`,
                                                                        color: 0x3A871F,
                                                                    },
                                                                ],
                                                                ephemeral: true,
                                                            });
                                                    });
                                                }))
                                        : e.channel.createMessage({ embeds: [{ description: "You must send a valid playlist number.", color: 0xC73829 }] }).then((e) => setTimeout(() => e.delete().catch((e) => { }), 4e3));
                            });
                        })
                        .catch((e) => { })
                    : e
                        .editOriginalMessage({ embeds: [{ description: "You don't have any playlist yet", color: 0xC73829 }] })
                        .then(() => {
                            setTimeout(() => {
                                e.deleteOriginalMessage().catch(null);
                            }, 3e3);
                        })
                        .catch((e) => { }));
            }
            const t: ExtendedDispatcher = this.client.queue.get(e.guildID);
            if (!t || !t.queue || !t.playing)
                return e
                    .editOriginalMessage({ embeds: [{ description: "No music is being playing on this server", color: 0xC73829 }] })
                    .then(() => {
                        setTimeout(() => {
                            e.deleteOriginalMessage().catch(null);
                        }, 3e3);
                    })
                    .catch((e) => { });
            if ("like" === e.data.custom_id) {
                const s = await this.client.database.getUser(e.member.id);

                if (s.songs.find((e) => e.info.uri === t.current.info.uri))
                    return (
                        (s.songs = s.songs.filter((e) => e.info.uri !== t.current.info.uri)),
                        s.save(),
                        e
                            .editOriginalMessage({
                                embeds: [
                                    {
                                        author: { name: "Song unliked", icon_url: e.member.avatarURL },
                                        description: `Removed [${t.current.info.title}](https://green-bot.app) from your liked songs`,
                                        color: 0x3A871F,
                                    },
                                ],
                                ephemeral: true,
                            })
                            .catch((e) => { })
                    );
                s.songs.push(t.current), s.save();
                return e
                    .editOriginalMessage({
                        embeds: [
                            {
                                author: { name: "Song liked", icon_url: e.member.avatarURL },
                                description: `successfully added [${t.current.info.title}](https://green-bot.app) to your liked songs${s ? (s.songs.length < 5 ? "\nYou can play your liked songs using `/pl-play liked-songs` " : "") : "\nYou can play your liked songs using `/pl-play liked-songs` "
                                    }`,
                                color: 0x3A871F,
                            },
                        ],
                        ephemeral: true,
                    })
                    .catch((e) => { });
            }
            if (!e.member.voiceState.channelID || e.member.voiceState.channelID !== me.voiceState.channelID)
                return e
                    .editOriginalMessage({
                        embeds: [{ description: me.voiceState.channelID ? `You need to join the <#${me.voiceState.channelID}> channel to use this button!` : "You need to join a voice channel to use this button!", color: 0xC73829 }],
                        ephemeral: true,
                    })
                    .then(() => {
                        setTimeout(() => {
                            e.deleteOriginalMessage().catch(null);
                        }, 6000);
                    })
                    .catch((e) => { });
            const s = await this.client.database.resolve(e.guildID);
            if ("save_pl" === e.data.custom_id) {
                if (0 == t.queue.length)
                    return e
                        .editOriginalMessage({ embeds: [{ description: "There is no track in your queue.", color: 0xC73829 }] })
                        .then(() => {
                            setTimeout(() => {
                                e.deleteOriginalMessage().catch(null);
                            }, 3e3);
                        })
                        .catch((e) => { });
                let s = await this.client.database.getUser(e.member.id),
                    a = `${guild.name}'s queue | #0`;
                if (s.playlists.find((e) => e.name === a)) {
                    const t = s.playlists.find((e) => e.name === a).name,
                        n = Number(t.charAt(t.length - 1));
                    if (((a = `${guild.name}'s queue | #${n + 1}`), s.playlists.find((e) => e.name === a))) {
                        const t = s.playlists.find((e) => e.name === a).name,
                            n = Number(t.charAt(t.length - 1));
                        if (((a = `${guild.name}'s queue | #${n + 1}`), s.playlists.find((e) => e.name === a))) {
                            const t = s.playlists.find((e) => e.name === a).name,
                                n = Number(t.charAt(t.length - 1));
                            a = `${guild.name}'s queue | #${n + 1}`;
                        }
                    }
                }
                s.playlists.push({ name: a, tracks: t.queue }), s.save();
                return e
                    .editOriginalMessage({
                        embeds: [
                            {
                                author: { name: "Queue Saved", icon_url: e.member.avatarURL },
                                description: `Your queue has been succesfully saved as a playlist.\nName: **${a}**`,
                                color: 0x3A871F,
                            },
                        ],
                        ephemeral: true,
                    })
                    .catch((e) => { });
            }
            if ("vote" !== e.data.custom_id && s.djroles && !this.checkDJ(e, s, t))
                return e
                    .editOriginalMessage({ embeds: [{ description: "You must have the DJ permissions to use this command", color: 0xC73829 }] })
                    .then(() => {
                        setTimeout(() => {
                            e.deleteOriginalMessage().catch(null);
                        }, 3e3);
                    })
                    .catch((e) => { });
            if ("back_button" === e.data.custom_id) {
                if (0 == t.previousTracks.length)
                    return e
                        .editOriginalMessage({ embeds: [{ description: "There is no previous track in your queue", color: 0xC73829 }] })
                        .then(() => {
                            setTimeout(() => e.deleteOriginalMessage(), 5e3);
                        })
                        .catch((e) => { });
                t.queue.unshift(t.previousTracks[t.previousTracks.length - 1]),
                    t.skip();
                (t.previousTracks = t.previousTracks.filter((e) => e.info.uri !== t.previousTracks[t.previousTracks.length - 1].info.uri));
                t.backed = true;

                e.editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just used the back button!`, icon_url: e.member.avatarURL } }] }).then(() => {
                    setTimeout(() => {
                        e.deleteOriginalMessage()
                    }, 20000);
                })


            }
            if ("clear_queue" === e.data.custom_id) {
                if (0 == t.queue.length)
                    return e
                        .editOriginalMessage({ embeds: [{ description: "There is no track in your queue.", color: 0xC73829 }] })
                        .then(() => {
                            setTimeout(() => e.deleteOriginalMessage(), 5e3);
                        })
                        .catch((e) => { });
                (t.queue.length = 0),
                    (t.previousTracks = []);
                const channel = guild.channels.get(t.player.connection.channelId)
                channel && channel.voiceMembers.filter(m => !m.bot).length >= 2 ?
                    e.editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just cleared the queue!`, icon_url: e.member.avatarURL } }] })
                    : e.deleteOriginalMessage()
            }
            if ("seek_back_button" === e.data.custom_id) {
                const s = 10000
                t.player.seekTo(t.player.position - s)
                e
                    .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has forwarded the current song of 15s!`, icon_url: e.member.avatarURL } }] })
                    .then(() => {
                        setTimeout(() => e.deleteOriginalMessage(), 5e3);
                    })
                    .catch((e) => { });
            }
            if ("seek_button" === e.data.custom_id) {
                const s = 10000
                t.player.seekTo(t.player.position + s),
                    e
                        .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has advanced the current song of 15s!`, icon_url: e.member.avatarURL } }] })
                        .then(() => {
                            setTimeout(() => e.deleteOriginalMessage(), 5e3);
                        })
                        .catch((e) => { });
            }
            if ("shuffle" === e.data.custom_id) {
                if (t.queue.length < 2) return e.editOriginalMessage({ embeds: [{ description: "There are no enough tracks in the queue to shuffle it!", color: 0xC73829 }] }).catch((e) => { });
                (t.queue = t.queue.sort(() => Math.random() - 0.5)),
                    e
                        .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just shuffled the current queue!`, icon_url: e.member.avatarURL } }] })
                        .then(() => {
                            e.fetchReply().then((e) => {
                                setTimeout(() => (e ? e.delete().catch((e) => { }) : null), 5e3);
                            });
                        })
                        .catch((e) => { });
            }
            if (
                ("pause_btn" === e.data.custom_id &&
                    (this.client.queue._sockets.find((t) => t.serverId === guild.id) &&
                        this.client.queue._sockets
                            .filter((t) => t.serverId === guild.id)
                            .forEach((s) => {
                                this.client.queue.emitOp({
                                    changes: ["CURRENT_SONG"],
                                    socketId: s.id,
                                    serverId: guild.id,
                                    queueData: { current: t.current, paused: !t.player.paused, loop: "queue" === t.repeat },
                                });
                            }),
                        t.pause(!t.player.paused),
                        t.lastMessage &&
                        this.client.editMessage(t.channelId, t.lastMessage, {
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
                        }),
                        guild.channels.get(t.player.connection.channelId) &&
                            guild.channels.get(t.player.connection.channelId).voiceMembers.filter(m => !m.bot).length >= 2
                            ? e
                                .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just ${t.player.paused ? "paused" : "unpaused"} the current song`, icon_url: e.member.avatarURL } }] })
                                .then(() => {
                                    setTimeout(() => e.deleteOriginalMessage(), 20000);
                                })
                                .catch((e) => { })
                            : e.deleteOriginalMessage())

                    ,
                    "pause" === e.data.custom_id &&
                    (t.player.paused
                        ? e.editOriginalMessage({ embeds: [{ description: "The player is already paused in this server", color: 0xC73829 }] })
                        : (t.pause(true),
                            e
                                .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just paused the current song`, icon_url: e.member.avatarURL } }] })
                                .then(() => {
                                    setTimeout(() => e.deleteOriginalMessage(), 20000);
                                })
                                .catch((e) => { }))),
                    "resume" === e.data.custom_id &&
                    (!0 == t.player.paused
                        ? e.editOriginalMessage({ embeds: [{ description: "The player is not already paused in this server", color: 0xC73829 }] })
                        : (t.pause(false),
                            e
                                .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just resumed the current song`, icon_url: e.member.avatarURL } }] })
                                .then(() => {
                                    setTimeout(() => e.deleteOriginalMessage(), 20000);
                                })
                                .catch((e) => { }))),
                    "autoplay" === e.data.custom_id &&
                    ("autoplay" === t.repeat
                        ? ((t.repeat = "off"),
                            e
                                .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just disabled the autoplay mode!`, icon_url: e.member.avatarURL } }] })
                                .then(() => {
                                    setTimeout(() => e.deleteOriginalMessage(), 20000);
                                })
                                .catch((e) => { }))
                        : ((t.repeat = "autoplay"),
                            e
                                .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just enabled the autoplay mode!`, icon_url: e.member.avatarURL } }] })
                                .then(() => {
                                    setTimeout(() => e.deleteOriginalMessage(), 20000);
                                })
                                .catch((e) => { }))),
                    "loop" === e.data.custom_id &&
                    ("queue" === t.repeat
                        ? ((t.repeat = "off"),
                            e
                                .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just disabled the loop mode!`, icon_url: e.member.avatarURL } }] })
                                .then(() => {
                                    setTimeout(() => e.deleteOriginalMessage(), 20000);
                                })
                                .catch((e) => { }))
                        : ((t.repeat = "queue"),
                            e
                                .editOriginalMessage({ embeds: [{ color: 0x3A871F, author: { name: `${e.member.username} has just enabled the loop mode!`, icon_url: e.member.avatarURL } }] })
                                .then(() => {
                                    setTimeout(() => e.deleteOriginalMessage(), 20000);
                                })
                                .catch((e) => { }))),
                    "skip" === e.data.custom_id)
            ) {
                if (0 == t.queue.length && "autoplay" !== t.repeat)
                    return e
                        .editOriginalMessage({ embeds: [{ description: "There is nothing after this track in the queue", color: 0xC73829 }] })
                        .then(() => {
                            setTimeout(() => {
                                e.deleteOriginalMessage().catch(null);
                            }, 3e3);
                        })
                        .catch((e) => { });
                const channel = guild.channels.get(t.player.connection.channelId)
                channel && channel.voiceMembers.filter(m => !m.bot).length >= 2 && s.vote_skip
                    ? t && t.voting
                        ? e.editOriginalMessage({ embeds: [{ description: "There's already a vote in this server", color: 0xC73829 }] }).then(() => {
                            setTimeout(() => {
                                e.deleteOriginalMessage().catch(null);
                            }, 3e3);
                        })
                        : e
                            .editOriginalMessage({
                                embeds: [
                                    {
                                        author: { name: `${e.member.username} requested to skip the current track! Vote!`, icon_url: e.member.avatarURL, url: "https://discord.gg/synAXZtQHM" },
                                        color: 0x3A871F,
                                    },
                                ],
                                components: [{ components: [{ custom_id: "vote", style: 3, type: 2, label: "Vote to skip the current track!" }], type: 1 }],
                            })
                            .then(async () => {
                                t.voting = true;
                                let s = 0,
                                    a = [],
                                    n = Math.round((channel.voiceMembers.filter(m => !m.bot).length + 1) / 2);
                                this.client.collectors.create({
                                    channelId: e.channel.id,
                                    time: 60000,
                                    type: "button",
                                    filter: (e) => "vote" === e.data.custom_id,
                                    exec: async (r) => {
                                        a.includes(r.member.id)
                                            ? r.createMessage({ embeds: [{ description: "You have already voted!", color: 0xC73829 }] }).then(() => {
                                                setTimeout(() => {
                                                    r.deleteOriginalMessage().catch(null);
                                                }, 3e3);
                                            })
                                            : r.member.voiceState.channelID && r.member.voiceState.channelID === channel.id
                                                ? (a.push(r.member.id),
                                                    s++,

                                                    r.createMessage({
                                                        embeds: [
                                                            {
                                                                author: {
                                                                    name: `${r.member.username} voted to skip! (${s}/${n})`,
                                                                    icon_url: r.member.user.dynamicAvatarURL(),
                                                                    url: "https://discord.gg/synAXZtQHM",
                                                                },
                                                                color: 0x3A871F,
                                                            },
                                                        ],
                                                    }).then(() => {
                                                        setTimeout(() => {
                                                            r.deleteOriginalMessage()
                                                        }, 15000);
                                                    })
                                                        .catch((e) => { }),
                                                    void (
                                                        s === n &&
                                                        (this.client.collectors.stop(e.channel.id),
                                                            (t.voting = false),
                                                            t.skip(),
                                                            e.channel
                                                                .createMessage({
                                                                    embeds: [
                                                                        {
                                                                            author: { name: `Skipping the track after ${s} positive votes!`, icon_url: guild.iconURL, url: "https://discord.gg/synAXZtQHM" },
                                                                            color: 0x3A871F,
                                                                        },
                                                                    ],
                                                                    components: [{ components: [{ custom_id: "vote", style: 3, type: 2, label: "Vote Ended!", disabled: true }], type: 1 }],
                                                                })
                                                                .catch((e) => { })
                                                                .then(() => { }),
                                                            e.deleteOriginalMessage().catch((e) => { }))
                                                    ))
                                                : r.createMessage({ embeds: [{ description: `You need to join the ${me.voiceState.channelID} to vote for skipping this track!`, color: 0xC73829 }] }).then(() => {
                                                    setTimeout(() => {
                                                        r.deleteOriginalMessage().catch(null);
                                                    }, 3e3);
                                                })

                                    },
                                    end: () => {
                                        t.voting && (t.voting = false), s !== n && e.deleteOriginalMessage();
                                    }

                                })


                            })
                    : (channel && channel.voiceMembers.filter(m => !m.bot).length >= 2
                        ? e.editOriginalMessage({
                            embeds: [
                                {
                                    color: 0x3A871F,
                                    author: { name: `${e.member.username} has just skipped ${t.current.info.title.slice(0, 20)} using a button`, icon_url: e.member.avatarURL },
                                },
                            ],
                        })
                        : e.deleteOriginalMessage().catch((e) => { }),
                        t.skip());
            }
            "stop" === e.data.custom_id &&
                ((t.stopped = true),
                    t.delete(),
                    e
                        .editOriginalMessage({ embeds: [{ author: { name: `${e.member.username} has just stopped the playback using a button!`, icon_url: e.member.avatarURL }, color: 0x3A871F }] })
                        .catch((e) => { }))
        } else
            try {

                if (!e.channel || "DM" === e.channel.type || !e.guildID)
                    return e.editOriginalMessage("You can't use slash commands on private messages!\n\nYou need to invite me to a discord server to get started!\nJoin our discord server for more help: discord.gg/greenbot");
                const t = this.client.commands.getSlash(e.data.name)
                if (!t) return console.log(e.data)
                const s = await this.client.database.resolve(e.guildID),
                    a = new SlashContext(this.client, e, e.data.options || [], s, me, member);
                if (this.client.config.premiumCmd.includes(t.name) && !(await this.client.database.checkPremium(e.guildID, e.member.id, true))) {
                    return a.reply({
                        embeds: [
                            {
                                color: 0x3A871F,
                                author: { name: "Premium command", icon_url: this.client.user.dynamicAvatarURL(), url: "https://green-bot.app/premium" },
                                description:
                                    "This command is locked behind premium because it uses more CPU than the other commands.\n\nYou can purchase the premium on the [Patreon Page](https://green-bot.app/premium) to access this command",
                            },
                        ],
                        components: [{ components: [{ url: "https://green-bot.app/premium", label: "Premium", style: 5, type: 2 }], type: 1 }],
                    })
                }

                if (this.client.config.voteLocks.includes(t.name)) {
                    const t = await this.client.database.checkPremium(e.guildID, e.member.id, true),
                        s = await this.checkVoted(e.member.id);
                    if (!t && !s)
                        return e.editOriginalMessage({
                            embeds: [
                                {
                                    footer: { text: "You can bypass this restriction by purchasing our premium (green-bot.app/premium)" },
                                    color: 0xC73829,
                                    description: "You need to vote the bot [here](ttps://green-bot.app/vote) to access this command.\nClick here to vote: [**green-bot.app/vote**](https://top.gg/bot/783708073390112830/vote)",
                                },
                            ],
                            components: [
                                {
                                    components: [
                                        { url: "https://green-bot.app/vote", label: "Vote", style: 5, type: 2 },
                                        { url: "https://green-bot.app/premium", label: "Premium", style: 5, type: 2 },
                                    ],
                                    type: 1,
                                },
                            ],
                        });
                }
                return this.client.hasBotPerm(a, "embedLinks")
                    ? s.txts && 0 !== s.txts.length && !s.txts.includes(`${e.channel.id}`) && "textchannels" !== t.name
                        ? a.errorMessage(
                            "I am not allowed to answer to commands in this channel.\n" +
                            (s.txts.length > 1 ? `Please use one of the following channels: ${s.txts.map((e) => `<#${e}>`).join(",")}` : `Please use the <#${s.txts[0]}> channel`)
                        )
                        : t.permissions && !channel.permissionsOf(member).has(t.permissions)
                            ? a.errorMessage(`You need to have the \`${t.permissions[0].replace("manageGuild", "Manage Guild")}\` permission to use this command`)

                            : t.checks && t.checks.voice && !member.voiceState.channelID
                                ? a.errorMessage("You have to be connected in a voice channel before you can use this command!")
                                : (t.checks && t.checks.dispatcher && !a.dispatcher) || (t.checks && t.checks.dispatcher && a.dispatcher && !a.dispatcher.playing)
                                    ? a.errorMessage("I am not currently playing music in this server. So it's impossible to do that")
                                    : a.guildDB.dj_commands && a.guildDB.dj_commands.includes(t.name) && !this.checkDJC(a)
                                        ? a.errorMessage("You have to have the `Manage Messages` permissions or the DJ role to use this command!")
                                        : t.checks && t.checks.channel && member.voiceState.channelID && me.voiceState.channelID && member.voiceState.channelID !== me.voiceState.channelID
                                            ? a.errorMessage(
                                                "You need to be in the same voice channel as me (<#" +
                                                me.voiceState.channelID +
                                                ">)! Want to listen music with another Green-bot? Consider inviting [Green-bot 2](https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=applications.commands&permissions=3165184)!"
                                            )
                                            : void t.run({ ctx: a })
                    : e.editOriginalMessage("❌ The bot must have the `Embed links` Discord permission to work properly! \n Please have someone from the staff give me this permission.");
            } catch (err) {
                return (
                    console.log(err),
                    console.log(`Erorr with ${e.commandName}`),
                    e.editOriginalMessage({
                        embeds: [
                            {
                                color: 0xc73829,
                                author: { name: "Uh Oh...", icon_url: this.client.user.dynamicAvatarURL(), url: "https://green-bot.app/premium" },
                                description: `Something went wrong on our side while executing your command..\n\nPlease go in the [support server](https://discord.gg/greenbot) and report this issue: \`${err}\``
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
            console.log("Aborted. is top.gg down??"), (t = true);
        }
        return t;
    }
    checkDJC(context: SlashContext) {
        let isDj = false;
        if (!context.guildDB.djroles || !context.guildDB.djroles.length) isDj = true
        if (context.guildDB.djroles && context.guildDB.djroles.length && context.member.roles.find(r => context.guildDB.djroles.includes(r))) isDj = true;
        if (context.member.permissions.has("manageGuild")) isDj = true;
        if (context.dispatcher && context.dispatcher.metadata.dj === context.member.id) isDj = true;
        return isDj
    }
    checkDJ(e, t, s) {
        let a = false;
        if (!t.djroles || !t.djroles.length) return true

        return t.djroles && t.djroles.length && e.member.roles.find((e) => t.djroles.includes(e)) && (a = true), s && s.metadata.dj == e.member.id && (a = true), e.member.permissions.has("manageGuild") && (a = true), a;
    }
}

