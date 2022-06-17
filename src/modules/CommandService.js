"use strict";
const Context = require("./Context");
class CommandService {
    constructor(e) {
        (this.client = e), (this.commands = e.commmands.commands);
    }
    handle(e) {
            if (!this.client._ready) return;
            return (!e.author.bot &&
                    e.channel &&
                    this.client.mongoDB.getServer(e.guild.id).then(async(t) => {
                            if (e.content.match(new RegExp(`^<@!?${e.client.user.id}>( |)$`)))
                                return e.channel.send({
                                    embeds: [{
                                        color: "#3A871F",
                                        author: { name: "Green-bot | Get started", icon_url: this.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://green-bot.app/" },
                                        description: "Hello! My prefix is set to `" +
                                            t.prefix +
                                            "` for this server, to get started send `" +
                                            t.prefix +
                                            "help`\n\nTo play a music with me, just join a voice channel and send `" +
                                            t.prefix +
                                            "play <music>`!",
                                    }, ],
                                    components: [{
                                        components: [
                                            { url: "https://green-bot.app/commands", label: "Commands", style: 5, type: "BUTTON" },
                                            { url: "https://green-bot.app/premium", label: "Premium", style: 5, type: "BUTTON" },
                                            { url: "https://green-bot.app/invite", label: "Invite", style: 5, type: "BUTTON" },
                                        ],
                                        type: "ACTION_ROW",
                                    }, ],
                                });
                            const s = e.content.toLowerCase();
                            if (s.startsWith(t.prefix.toLowerCase()) || s.startsWith("<@!" + this.client.user.id + ">") || s.startsWith("<@" + this.client.user.id + ">") || s.startsWith(`${this.client.user.username}`)) {
                                let a;
                                s.startsWith(t.prefix.toLowerCase()) && (a = e.content.slice(t.prefix.length).trim().split(/ +/)),
                                    s.startsWith("<@!" + this.client.user.id + ">") && (a = e.content.slice(22).trim().split(/ +/)),
                                    s.startsWith("<@" + this.client.user.id + ">") && (a = e.content.slice(21).trim().split(/ +/)),
                                    s.startsWith(`${this.client.user.username}`) && (a = e.content.slice(5).trim().split(/ +/));
                                let r = a.shift().toLowerCase();
                                if (!this.commands.has(r) && !this.commands.find((e) => e.aliases && e.aliases.includes(r))) return;
                                r = this.commands.get(r) || this.commands.find((e) => e.aliases && e.aliases.includes(r));
                                const n = new Context(this.client, e, a, t);
                                if (e.client.mongoDB.searchReq(n)) return;
                                const o = e.channel.permissionsFor(e.guild.me);
                                return o.has("SEND_MESSAGES") ?
                                    o.has("EMBED_LINKS") ?
                                    t.txts && 0 !== t.txts.length && t.txts.filter((t) => e.guild.channels.cache.get(t)).length > 0 && !t.txts.includes(`${e.channel.id}`) && "textchannels" !== r.name ?
                                    n.errorMessage(
                                        `I am not allowed to answer to commands in this channel.\n${t.txts.length > 1 ? `Please use one of the following channels: ${t.txts.map((e) => `<#${e}>`).join(",")}` : `Please use the <#${t.txts[0]}> channel`
                                    }`
                                )
                                : r.permissions && !e.channel.permissionsFor(e.member).has(r.permissions)
                                    ? n.errorMessage(`You need to have the \`${r.permissions[0].replace("MANAGE_GUILD", "Manage Guild")}\` permission to use this command`)
                                    : r.arguments && r.arguments[0].required && !a[0]
                                        ? n.errorMessage(`You need to provide args for this command. (${r.arguments[0].description})\n\nExample usage: \`${t.prefix}${r.name} ${r.arguments[0].name}\``)
                                        : r.playerCheck && r.playerCheck.vote && !(await this.client.mongoDB.checkPremium(e.guild.id, e.author.id)) && !(await this.checkVoted(e.author.id))
                                            ? n.channel.send({
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
                                            })
                                            : r.playerCheck && r.playerCheck.premium && !(await this.client.mongoDB.checkPremiumUser(e.author.id)) && !(await this.client.mongoDB.checkPremium(e.guild.id))
                                                ? n.channel.send({
                                                    embeds: [
                                                        {
                                                            color: "#3A871F",
                                                            author: { name: "Premium command", icon_url: this.client.user.displayAvatarURL({ size: 512, format: "png" }), url: "https://green-bot.app/premium" },
                                                            description:
                                                                "This command is locked behind premium because it uses more CPU than the other commands.\n\nYou can purchase the premium on the [Patreon Page](https://green-bot.app/premium) to use this command..",
                                                        },
                                                    ],
                                                    components: [{ components: [{ url: "https://green-bot.app/premium", label: "Premium", style: 5, type: "BUTTON" }], type: "ACTION_ROW" }],
                                                })
                                                : r.playerCheck && r.playerCheck.voice && !e.member.voice.channelId
                                                    ? n.errorMessage("You have to be connected in a voice channel before you can use this command!")
                                                    : (r.playerCheck && r.playerCheck.dispatcher && !n.dispatcher) || (r.playerCheck && r.playerCheck.dispatcher && n.dispatcher && !n.dispatcher.playing)
                                                        ? n.errorMessage("I am not currently playing music in this server. So it's impossible to do that")
                                                        : n.guildDB.dj_commands && n.guildDB.dj_commands.includes(r.name) && !this.checkDJ(n)
                                                            ? n.errorMessage("You need to have the `Manage Messages` permission or the DJ role to use this command!")
                                                            : r.playerCheck && r.playerCheck.channel && e.guild.me.voice.channelId && e.guild.me.voice.channelId !== e.member.voice.channelId
                                                                ? n.errorMessage(
                                                                    "You need to be in the same voice channel as me (<#" +
                                                                    e.guild.me.voice.channelId +
                                                                    ">)! Want to listen music with another Green-bot? Consider inviting [Green-bot 2](https://discord.com/oauth2/authorize?client_id=902201674263851049&scope=applications.commands&permissions=3165184)!"
                                                                )
                                                                : void r.run({ ctx: n })
                            : e.channel.send("❌ The bot must have the `Embed links` Discord permission to work properly! \n Please have someone from the staff give me this permission.")
                        : e.member.send(
                            "Hello! I tried to send a reply to your command, however, I lack the permission to 😕. Please have someone from the staff give me the `Send Messages` Discord permission.\n\n Server: **" +
                            e.guild.name +
                            "**\n Command: **" +
                            r.name +
                            "**\n Want help with permissions? Join the support server: https://discord.gg/greenbot"
                        );
                }
                if (t.requestChannel && t.requestChannel === e.channel.id) {
                    e.delete().catch((e) => { });
                    let s = new Context(this.client, e, null, t);
                    if (e.client.mongoDB.searchReq(s)) return;
                    const a = await e.guild.channels.cache.get(e.channel.id).messages.fetch(t.requestMessage);
                    if (!a)
                        return s.errorMessage("Your controller is corrupted because you deleted the controller message.\nPlease do the `green controller disable` command and then the `green controller` command to fix it!").then((e) => {
                            setTimeout(() => {
                                e.delete().catch((e) => { });
                            }, 5e3);
                        });
                    if (((s.messageController = a), !e.member.voice.channelId))
                        return s.errorMessage("Please join a voice channel first").then((e) => {
                            setTimeout(() => {
                                e.delete().catch((e) => { });
                            }, 5e3);
                        });
                    if (e.guild.me.voice.channelId && e.guild.me.voice.channelId !== e.member.voice.channelId)
                        return s.errorMessage("Please join the same voice channel as me!").then((e) => {
                            setTimeout(() => {
                                e.delete().catch((e) => { });
                            }, 5e3);
                        });
                    const r = await this.client.shoukaku.getNode(),
                        n = await this.client.queue.create(s, r),
                        o = await e.client.shoukaku.search(r, e.content, s);
                    if (!n) return s.errorMessage("Something went wrong while creating the player! Please try again!");
                    if (e.content.includes("spotify")) {
                        if (!o || !o.raw)
                            return s
                                .errorMessage(
                                    "No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)"
                                )
                                .then((e) => {
                                    setTimeout(() => {
                                        e.delete().catch((e) => { });
                                    }, 5e3);
                                });
                        if ("track" === o.sp.type) n.addTrack(o.raw, e.author), !n.playing && n.play();
                        else if ("playlist" === o.sp.type) {
                            for (const t of o.raw) {
                                let s = {
                                    info: {
                                        title: r.scraped ? t.name : t.title,
                                        uri: r.scraped ? t.external_urls.spotify : t.originURL,
                                        sp: !0,
                                        author: r.scraped ? null : t.artists,
                                        image: r.scraped ? t.image : t.thumbnail,
                                        requester: { name: e.author.username, id: e.author.id, avatar: e.author.displayAvatarURL({ dynamic: !0 }) },
                                    },
                                };
                                n.queue.push(s);
                            }
                            n.tracksAdded(),
                                t.auto_shuffle && (n.queue = n.queue.sort(() => Math.random() - 0.5)),
                                setTimeout(() => {
                                    n.playing || n.play();
                                }, 1e3);
                        } else {
                            if ("album" !== o.sp.type)
                                return e
                                    .errorMessage(
                                        "No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)"
                                    )
                                    .then((e) => {
                                        setTimeout(() => {
                                            e.delete().catch((e) => { });
                                        }, 5e3);
                                    });
                            for (const t of o.raw) {
                                let s = {
                                    info: {
                                        title: r.scraped ? t.name : t.title,
                                        author: r.scraped ? t.artists[0].name : t.artists,
                                        uri: r.scraped ? t.external_urls.spotify : t.originURL,
                                        sp: !0,
                                        image: r.scraped ? t.image : t.thumbnail,
                                        requester: { name: e.author.username, id: e.author.id, avatar: e.author.displayAvatarURL({ dynamic: !0 }) },
                                        requester: { name: e.author.username, id: e.author.id },
                                    },
                                };
                                n.queue.push(s);
                            }
                            n.tracksAdded(),
                                t.auto_shuffle && (n.queue = n.queue.sort(() => Math.random() - 0.5)),
                                setTimeout(() => {
                                    n.playing || n.play();
                                }, 1e3);
                        }
                        return;
                    }
                    const { type: i, tracks: l, playlistName: c } = o;
                    if ("PLAYLIST" !== i) {
                        if (!l.length)
                            return s.errorMessage("I didn't find any song on the query you provided!").then((e) => {
                                setTimeout(() => {
                                    e.delete().catch((e) => { });
                                }, 5e3);
                            });
                        let t = o.tracks[0];
                        n.addTrack(t, e.author), !n.playing && n.play();
                    } else {
                        for (let t of r) (t.info.requester = { name: e.author.username, id: e.author.id }), n.queue.push(t);
                        n.tracksAdded(),
                            t.auto_shuffle &&
                            setTimeout(() => {
                                n.queue = n.queue.sort(() => Math.random() - 0.5);
                            }, 2e3),
                            n.playing || n.play();
                    }
                }
            }),
            !0
        );
    }
    async checkVoted(e) {
        let t = null;
        try {
            t = await this.client.dbl.hasVoted(e);
        } catch (e) {
            console.log("Aborted. is top.gg down??"), (t = !1);
        }
        return t;
    }
    checkDJ(e) {
        return (
            !!(e.guildDB.dj_role && e.guild.roles.cache.get(e.guildDB.dj_role) && e.member.roles.cache.has(e.guildDB.dj_role)) ||
            !(e.guildDB.dj_role && (!e.dispatcher || e.dispatcher.metadata.dj !== e.member.id)) ||
            (!(e.guild.roles.cache.get(e.guildDB.dj_role) && !e.member.roles.cache.has(e.guildDB.dj_role) && !e.member.permissions.has("MANAGE_MESSAGES")) && e.member.permissions.has("MANAGE_MESSAGES"))
        );
    }
}
module.exports = CommandService;