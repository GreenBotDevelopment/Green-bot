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
const QuickCommand_1 = require("../../abstract/QuickCommand");
class play extends QuickCommand_1.Command {
    get name() {
        return "play";
    }
    get aliases() {
        return ["pley", "p", "spotify", "youtube", "yt", "jouer", "jogar", "jugar", "playmusic", "start"];
    }
    get description() {
        return "Automatically fetches the video(s) and joins the voice channel you are in to play your query!";
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: true, channel: true };
    }
    get arguments() {
        return [{ name: "query", description: "The track you want to play", required: false }];
    }
    static wait(a) {
        return new Promise((b) => setTimeout(b, a).unref());
    }
    run({ ctx: a }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!a.guildDB.noticed_slash || a.guildDB.noticed_slash < 2) {
                a.successMessage("**Slash Commands are here!**\n\nDiscord has recently introduced a new way to use bots! [slash commands](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ) and to make sure that all bots uses these commands, discord will remove commands with prefixes for [all bots](https://support-dev.discord.com/hc/en-us/articles/4404772028055-Message-Content-Privileged-Intent-FAQ).\n So Green-bot will stop supporting text commands soon! Switch to slash commands!\n\n__How to use them__?\n\nJust press \"/\", click on the Green-bot logo and select play, complete the required options and press enter! ( [Discord guide here](https://support.discord.com/hc/en/articles/1500000368501-Slash-Commands-FAQ) )");
                a.guildDB.noticed_slash++;
                a.client.database.handleCache(a.guildDB);
            }
            let d = a.args.join(" ");
            const create = a.dispatcher ? false : true;
            if (!d && a.dispatcher && a.dispatcher.player.paused)
                return a.dispatcher.pause(false), a.successMessage("\u23F8 Music unpaused!");
            d.includes("soundcloud") && d.includes("?si") && (d = d.split("?")[0]), d.includes("soundcloud") && d.includes("?in_system_playlist") && (d = d.split("?in_system_playlist")[0]);
            if (!a.me.voiceState.channelID) {
                const channel = yield a.getVoiceChannel();
                if (channel.userLimit == channel.voiceMembers.size)
                    return a.errorMessage("I can't join your channel because the member limit ( Set by a server admin) has been reached! Please increase it or kick someone.");
                if (!a.client.hasBotPerm(a, "voiceConnect", channel))
                    return a.errorMessage("I don't have the required permissions to join your voice channel! I need `View Channels`, `Connect` and `Speak` permission. [Permissions Example](https://cdn.discordapp.com/attachments/904438715974287440/909076558558412810/unknown.png)\n If the problem persists, change the voice channel region to `Europe`");
                if (!a.client.hasBotPerm(a, "voiceSpeak", channel) && 13 !== channel.type)
                    return a.errorMessage("I don't have the permission to speak in your voice channel.\n Please give me the permission to or check this guide to learn how to give me this permissions:\nhttps://guide.green-bot.app/frequent-issues/permissions");
                if (a.guildDB.vcs.length && !a.guildDB.vcs.includes(a.member.voiceState.channelID))
                    return a.errorMessage(a.guildDB.vcs.length > 1
                        ? `I am not allowed to play music in your voice channel.\n Please join one of the following channels: ${a.guildDB.vcs.map((e) => `<#${e}>`).join(",")}`
                        : `I can only play music in the <#${a.guildDB.vcs[0]}> channel.`);
            }
            if (d.includes("pornhub") && !a.channel.nsfw)
                return a.errorMessage("Please mark this channel as NSFW channel before being able to play this type of videos.\nRemember that this content is 18+ and could cause grave addictions.");
            const h = a.client.shoukaku.getNode();
            if (!h)
                return a.errorMessage("No nodes are available yet! You can report this error in [Green bot Server](https://discord.gg/greenbot)");
            const c = yield a.client.queue.create(a, h);
            if (!c)
                return a.errorMessage("**Uh Oh..**! Something went wrong while joining your voice channel.\nYou can do the command again or use the `" + a.guildDB.prefix + "forcejoin` command to solve the issue");
            if (!d) {
                if (create)
                    return;
                c && 0 == c.queue.length
                    ? a.send(`Queue is empty! Do \`${a.guildDB.prefix}play <music>\` to add something to the queue.`)
                    : c && c.queue.length > 0
                        ? a.send(`Do \`${a.guildDB.prefix}play <music>\` to add something to the queue.`)
                        : a.send(`Queue is empty! Do \`${a.guildDB.prefix}play <music>\` to add something to the queue.`);
                return;
            }
            const b = yield a.client.shoukaku.search(h, d, a);
            if (!b)
                return;
            if (c.channelId !== a.channel.id && !a.guildDB.textchannel)
                a.channelId = a.channel.id;
            if (d.includes("spotify")) {
                if (!b || !b.raw)
                    return a.errorMessage("No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)");
                if ("track" === b.sp.type)
                    c.addTrack(b.raw, a.author),
                        c.queue.length && a.send({ embeds: [{ description: `Enqueued **[${b.sp.tracks[0].title.slice(0, 100)}](${b.sp.tracks[0].originURL})** at position **${c.queue.length + 1}**`, color: 0x3a871f }] });
                else if ("playlist" === b.sp.type) {
                    for (const e of (a.send({ embeds: [{ description: `Added [${b.sp.name.slice(0, 50)}](${d}) with ${b.raw.length} tracks ${a.guildDB.auto_shuffle ? "\u{1F500} And automatically shuffled" : ""}`, color: 0x3a871f }] })
                        .catch(() => null),
                        b.raw)) {
                        if (b.scraped && !e.track)
                            return;
                        const l = {
                            info: {
                                title: b.scraped ? e.name : e.title,
                                uri: b.scraped ? e.track.external_urls.spotify : e.originURL,
                                sp: true,
                                image: b.scraped ? e.image : e.thumbnail,
                                author: b.scraped ? null : e.artists,
                                requester: { name: a.author.username, id: a.author.id, avatar: a.author.dynamicAvatarURL() },
                            },
                        };
                        c.queue.push(l);
                    }
                    c.tracksAdded(),
                        a.guildDB.auto_shuffle && (a.dispatcher.queue = a.dispatcher.queue.sort(() => Math.random() - 0.5)),
                        setTimeout(() => {
                            c.playing || c.play();
                        }, 1e3);
                }
                else {
                    if ("album" !== b.sp.type)
                        return a.errorMessage("No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)");
                    for (const f of b.raw) {
                        const m = {
                            info: {
                                title: b.scraped ? f.name : f.title,
                                author: b.scraped ? f.artists[0].name : f.artists,
                                image: b.scraped ? f.image : f.thumbnail,
                                uri: b.scraped ? f.external_urls.spotify : f.originURL,
                                sp: true,
                                requester: { name: a.author.username, id: a.author.id, avatar: a.author.dynamicAvatarURL() },
                            },
                        };
                        c.queue.push(m);
                    }
                    a.guildDB.auto_shuffle && (a.dispatcher.queue = a.dispatcher.queue.sort(() => Math.random() - 0.5)),
                        c.tracksAdded(),
                        a
                            .send({ embeds: [{ description: `Added [${b.sp.name.slice(0, 50)}](${d}) with ${b.raw.length} tracks ${a.guildDB.auto_shuffle ? "\u{1F500} And automatically shuffled" : ""}`, color: 0x3a871f }] })
                            .catch(() => null),
                        setTimeout(() => {
                            c.playing || c.play();
                        }, 1e3);
                }
                return;
            }
            const { loadType: n, tracks: i, playlistInfo: o } = b;
            if ("PLAYLIST_LOADED" !== n) {
                if (!b.tracks.length)
                    return a.errorMessage("I didn't find any song on the query you provided!");
                const j = b.tracks[0], k = j;
                if (c.queue.filter((a) => a.info.uri === j.info.uri).length > 5) {
                    return a.errorMessage("**Calm Down!** This song is already in the queue, if you want to play it alot of times, just enable the [loop mode](https://guide.green-bot.app/features/loop-mode) with the `loop` command!");
                }
                c.addTrack(k, a.author);
                c.queue.length && a.send({ embeds: [{ description: `Enqueued **[${j.info.title.slice(0, 100)}](https://discord.gg/greenbot)** at position **#${c.queue.length + 1}**`, color: 0x3a871f }] });
            }
            else {
                for (let g of i) {
                    g = c.parseTrack(g, a.author);
                    c.queue.push(g);
                }
                a.guildDB.auto_shuffle &&
                    setTimeout(() => {
                        a.dispatcher.queue = a.dispatcher.queue.sort(() => Math.random() - 0.5);
                    }, 2e3),
                    a.send({ embeds: [{ description: `Added [${o.name.slice(0, 50)}](https://discord.gg/greenbot) with ${i.length} tracks ${a.guildDB.auto_shuffle ? "\u{1F500} And automatically shuffled" : ""}`, color: 0x3a871f }] })
                        .catch(() => null),
                    c.playing || c.play(),
                    c.tracksAdded();
            }
        });
    }
    checkPl(b) {
        const a = b.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/);
        return !(!a || !a[2]);
    }
}
exports.default = play;
