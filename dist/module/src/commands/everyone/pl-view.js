"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Queue extends QuickCommand_1.Command {
    get name() {
        return "pl-view";
    }
    get description() {
        return "Shows informations about a specific playlist!";
    }
    get aliases() {
        return ["pl-v", "view-pl"];
    }
    get category() {
        return "Everyone Commands";
    }
    get arguments() {
        return [{ name: "playlist_name", description: "The name of the playlist you want to play", required: true }];
    }
    async run({ ctx: e }) {
        const t = e.args.join(" "), n = await e.client.database.getUser(e.author.id);
        if ("liked-songs" === t) {
            if (!n.songs.length)
                return e.errorMessage("You don't have any liked song yet!");
            if (n.songs.length > 6) {
                let t = 0, o = 6, s = 1;
                const i = await e.send({
                    embeds: [
                        {
                            description: "You can like a song by clicking the button behing the song.\nYou can play your liked songs using the `" + e.guildDB.prefix + "pl-p liked-songs` command",
                            author: { name: "Your liked songs", icon_url: e.author.dynamicAvatarURL() },
                            fields: [
                                {
                                    name: "• List (" + n.songs.length + " / 10)",
                                    value: n.songs
                                        .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                        .slice(0, 6)
                                        .join("\n"),
                                },
                            ],
                            color: 0x3A871F,
                        },
                    ],
                    components: [
                        {
                            components: [
                                { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                }), a = (e) => e.data && "back_queue" === e.data.custom_id || e.data && "next_queue" === e.data.custom_id;
                e.client.collectors.create({
                    channelId: e.channel.id,
                    time: 60000,
                    type: "button",
                    filter: a,
                    end: (x) => {
                        i.edit({
                            embeds: [
                                {
                                    description: "You can like a song by clicking the button behing the song.",
                                    author: { name: "Your liked songs", icon_url: e.author.dynamicAvatarURL() },
                                    fields: [
                                        {
                                            name: "• List (" + n.songs.length + " songs)",
                                            value: n.songs
                                                .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                                .slice(0, 6)
                                                .join("\n"),
                                        },
                                    ],
                                    color: 0x3A871F,
                                },
                            ],
                            components: [
                                {
                                    components: [
                                        { emoji: { name: "⏮", id: null }, disabled: true, custom_id: "back_queue", style: 2, type: 2 },
                                        { emoji: { name: "⏭", id: null }, disabled: true, custom_id: "next_queue", style: 2, type: 2 },
                                    ],
                                    type: 1,
                                },
                            ],
                        });
                    },
                    exec: async (a) => {
                        await a.defer();
                        if (a.member.id !== e.author.id)
                            return a.deleteOriginalMessage();
                        if ("back_queue" === a.data.custom_id) {
                            if (((o -= 6), (s -= 1), (t -= 6) < 0))
                                return;
                            if (s < 1)
                                return;
                            const a = n.songs
                                .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                .slice(t, o)
                                .join("\n");
                            i.edit({
                                embeds: [
                                    {
                                        description: "You can like a song by clicking the button behing the song.",
                                        author: { name: "Your liked songs", icon_url: e.author.dynamicAvatarURL() },
                                        fields: [{ name: "• List (" + n.songs.length + " songs)", value: a }],
                                        color: 0x3A871F,
                                    },
                                ],
                                components: [
                                    {
                                        components: [
                                            { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                            { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                                        ],
                                        type: 1,
                                    },
                                ],
                            });
                        }
                        if ("next_queue" === a.data.custom_id) {
                            if (((t += 6), (s += 1), (o += 6) > n.songs.length + 6))
                                return;
                            if (t < 0)
                                return;
                            const a = n.songs
                                .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                .slice(t, o)
                                .join("\n");
                            i.edit({
                                embeds: [
                                    {
                                        description: "You can like a song by clicking the button behing the song.",
                                        author: { name: "Your liked songs", icon_url: e.author.dynamicAvatarURL() },
                                        fields: [{ name: "• List (" + n.songs.length + " songs)", value: a }],
                                        color: 0x3A871F,
                                    },
                                ],
                                components: [
                                    {
                                        components: [
                                            { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                            { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                                        ],
                                        type: 1,
                                    },
                                ],
                            });
                        }
                        a.deleteOriginalMessage();
                    }
                });
            }
            else
                e.send({
                    embeds: [
                        {
                            description: "You can like a song by clicking the button behing the song.\nYou can play your liked songs using the `" + e.guildDB.prefix + "pl-p liked-songs` command",
                            author: { name: "Your liked songs", icon_url: e.author.dynamicAvatarURL() },
                            fields: [
                                {
                                    name: "• List (" + n.songs.length + " songs)",
                                    value: "Songs:\n" + n.songs.map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`).join("\n"),
                                },
                            ],
                            color: 0x3A871F,
                        },
                    ],
                });
        }
        else {
            if (!n || !n.playlists.find((e) => e.name === t))
                return e.errorMessage("You don't have any playlist with this name!");
            const o = n.playlists.find((e) => e.name === t), s = o.tracks;
            if (s.length > 6) {
                let t = 0, n = 6, i = 1;
                const a = await e.send({
                    embeds: [
                        {
                            description: "You can play your playlist using the `" + e.guildDB.prefix + "pl-p " + o.name + "` command",
                            author: { name: o.name, icon_url: e.author.dynamicAvatarURL() },
                            fields: [
                                {
                                    name: "• List (" + s.length + " songs)",
                                    value: s
                                        .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                        .slice(0, 6)
                                        .join("\n"),
                                },
                            ],
                            color: 0x3A871F,
                        },
                    ],
                    components: [
                        {
                            components: [
                                { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                            ],
                            type: 1,
                        },
                    ],
                }), u = (e) => e.data && "back_queue" === e.data.custom_id || e.data && "next_queue" === e.data.custom_id;
                e.client.collectors.create({
                    channelId: e.channel.id,
                    time: 60000,
                    filter: u,
                    type: "button",
                    end: (x) => {
                        a.edit({
                            embeds: [
                                {
                                    description: "You can play your playlist using the `" + e.guildDB.prefix + "pl-p " + o.name + "` command",
                                    author: { name: o.name, icon_url: e.author.dynamicAvatarURL() },
                                    fields: [
                                        {
                                            name: "• List (" + s.length + " songs)",
                                            value: s
                                                .slice(0, 6)
                                                .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                                .join("\n"),
                                        },
                                    ],
                                    color: 0x3A871F,
                                },
                            ],
                            components: [
                                {
                                    components: [
                                        { emoji: { name: "⏮", id: null }, disabled: true, custom_id: "back_queue", style: 2, type: 2 },
                                        { emoji: { name: "⏭", id: null }, disabled: true, custom_id: "next_queue", style: 2, type: 2 },
                                    ],
                                    type: 1,
                                },
                            ],
                        });
                    },
                    exec: async (u) => {
                        await u.defer();
                        if (u.member.id !== e.author.id)
                            return u.deleteOriginalMessage();
                        if ("back_queue" === u.data.custom_id) {
                            if ((console.log("got back"), (n -= 6), (i -= 1), (t -= 6) < 0))
                                return;
                            if (i < 1)
                                return;
                            const u = s
                                .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                .slice(t, n)
                                .join("\n");
                            a.edit({
                                embeds: [
                                    {
                                        description: "You can play your playlist using the `" + e.guildDB.prefix + "pl-p " + o.name + "` command",
                                        author: { name: o.name, icon_url: e.author.dynamicAvatarURL() },
                                        fields: [{ name: "• List (" + s.length + " songs)", value: u }],
                                        color: 0x3A871F,
                                    },
                                ],
                                components: [
                                    {
                                        components: [
                                            { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                            { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                                        ],
                                        type: 1,
                                    },
                                ],
                            });
                        }
                        if ("next_queue" === u.data.custom_id) {
                            if ((console.log("got next"), (t += 6), (i += 1), (n += 6) > s.length + 6))
                                return console.log(n), console.log(s.length + 6);
                            if (t < 0)
                                return;
                            const u = s
                                .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                .slice(t, n)
                                .join("\n");
                            a.edit({
                                embeds: [
                                    {
                                        description: "You can play your playlist using the `" + e.guildDB.prefix + "pl-p " + o.name + "` command",
                                        author: { name: o.name, icon_url: e.author.dynamicAvatarURL() },
                                        fields: [{ name: "• List (" + s.length + " songs)", value: u }],
                                        color: 0x3A871F,
                                    },
                                ],
                                components: [
                                    {
                                        components: [
                                            { emoji: { name: "⏮", id: null }, custom_id: "back_queue", style: 2, type: 2 },
                                            { emoji: { name: "⏭", id: null }, custom_id: "next_queue", style: 2, type: 2 },
                                        ],
                                        type: 1,
                                    },
                                ],
                            });
                        }
                        u.deleteOriginalMessage();
                    }
                });
            }
            else {
                console.log(o);
                e.send({
                    embeds: [
                        {
                            description: "You can play your playlist using the `" + e.guildDB.prefix + "pl-p " + o.name + "` command",
                            author: { name: o.name, icon_url: e.author.dynamicAvatarURL() },
                            fields: [
                                {
                                    name: "• List (" + s.length + " songs)",
                                    value: "Songs:\n" +
                                        s
                                            .map((e, t) => `**${t + 1})** [${e.info.title}](https://green-bot.app) by [${e.info.author ? e.info.author : "Unknow artist"}](https://green-bot.app)`)
                                            .join("\n")
                                            .slice(0, 6),
                                },
                            ],
                            color: 0x3A871F,
                        },
                    ],
                });
            }
        }
    }
}
exports.default = Queue;
