const KongouCommand = require("../../abstract/KongouCommand.js");
class Play extends KongouCommand {
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
    get playerCheck() {
        return { voice: !0, dispatcher: !1, channel: !0 };
    }
    get arguments() {
        return [{ name: "query", description: "The track you want to play", required: !1 }];
    }
    static wait(e) {
        return new Promise((t) => setTimeout(t, e).unref());
    }
    async run({ ctx: e }) {
        let t = e.args.join(" ");
        if (!t && e.dispatcher && e.dispatcher.player.paused) return e.dispatcher.player.setPaused(!1), e.successMessage("⏸ Music unpaused!");
        if ((t.includes("soundcloud") && t.includes("?si") && (t = t.split("?")[0]), t.includes("soundcloud") && t.includes("?in_system_playlist") && (t = t.split("?in_system_playlist")[0]), !e.dispatcher)) {
            if (!e.member.voice.channel.joinable || !e.member.voice.channel.viewable)
                return e.errorMessage(
                    "I don't have the required permissions to join your voice channel! I need `View Channels`, `Connect` and `Speak` permissiondata. [Permissions Example](https://cdn.discordapp.com/attachments/904438715974287440/909076558558412810/unknown.png)\n If the problem persists, change the voice channel region to `Europe`"
                );
            if (!e.member.voice.channel.speakable && "GUILD_STAGE_VOICE" !== e.member.voice.channel.type)
                return e.errorMessage(
                    "I don't have the permission to speak in your voice channel.\n Please give me the permission to or check this guide to learn how to give me this permissions:\nhttps://guide.green-bot.app/frequent-issues/permissions"
                );
            if (e.guildDB.vcs.length && !e.guildDB.vcs.includes(e.member.voice.channelId))
                return e.errorMessage(
                    e.guildDB.vcs.length > 1
                        ? `I am not allowed to play music in your voice channel.\n Please join one of the following channels: ${e.guildDB.vcs.map((e) => `<#${e}>`).join(",")}`
                        : `I can only play music in the <#${e.guildDB.vcs[0]}> channel.`
                );
        }
        if(t.includes("youtube" || t.includes("soundcloud")) return e.errorMessage("As of recents events, Green-bot stopped supporting youtube and soundcloud.\nBut you can try to give a song name and the will search it!")
        if (t.includes("pornhub") && !e.channel.nsfw) return e.errorMessage("Please mark this channel as NSFW channel before being able to play this type of videos.\nRemember that this content is 18+ and could cause grave addictions.");
        const a = e.client.shoukaku.getNode();
        if (!a) return e.errorMessage("No nodes are available yet! You can report this error is [Green bot Server](https://discord.gg/greenbot)");
        let s = await e.client.queue.create(e, a);
        if (!s) return e.errorMessage("Something went wrong while joining your voice channel.\nPlease do the command again to fix it.");
        if ((s.metadata.channel.id !== e.channel.id && !e.guildDB.textchannel && (s.metadata.channel = e.channel), !t))
            return s && 0 == s.queue.length
                ? e.channel.send(`Queue is empty! Do \`${e.guildDB.prefix}play <music>\` to add something to the queue.`)
                : s && s.queue.length > 0
                ? e.channel.send(`Do \`${e.guildDB.prefix}play <music>\` to add something to the queue.`)
                : e.channel.send(`Queue is empty! Do \`${e.guildDB.prefix}play <music>\` to add something to the queue.`);
        const r = await e.client.shoukaku.search(a, t, e);
        if (!r) return;
        if (t.includes("spotify")) {
            if (!r || !r.raw)
                return e.errorMessage(
                    "No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)"
                );
            if ("track" === r.sp.type)
                s.addTrack(r.raw, e.author),
                    s.playing ? e.channel.send({ embeds: [{ description: `Enqueued **[${r.sp.tracks[0].title.slice(0, 100)}](${r.sp.tracks[0].originURL})** at position **${s.queue.length + 1}**`, color: "#3a871f" }] }) : s.play();
            else if ("playlist" === r.sp.type) {
                e.channel.send({ embeds: [{ description: `Added [${r.sp.name.slice(0, 50)}](${t}) with ${r.raw.length} tracks ${e.guildDB.auto_shuffle ? "🔀 And automatically shuffled" : ""}`, color: "#3a871f" }] }).catch(() => null);
                for (const t of r.raw) {
                    if (r.scraped && !t.track) return;
                    let a = {
                        info: {
                            title: r.scraped ? t.name : t.title,
                            uri: r.scraped ? t.track.external_urls.spotify : t.originURL,
                            sp: !0,
                            image: r.scraped ? t.image : t.thumbnail,
                            author: r.scraped ? null : t.artists,
                            requester: { name: e.author.username, id: e.author.id, avatar: e.author.displayAvatarURL({ dynamic: !0 }) },
                        },
                    };
                    s.queue.push(a);
                }
                s.tracksAdded(),
                    e.guildDB.auto_shuffle && (e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5)),
                    setTimeout(() => {
                        s.playing || s.play();
                    }, 1e3);
            } else {
                if ("album" !== r.sp.type)
                    return e.errorMessage(
                        "No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)"
                    );
                for (const t of r.raw) {
                    let a = {
                        info: {
                            title: r.scraped ? t.name : t.title,
                            author: r.scraped ? t.artists[0].name : t.artists,
                            image: r.scraped ? t.image : t.thumbnail,
                            uri: r.scraped ? t.external_urls.spotify : t.originURL,
                            sp: !0,
                            requester: { name: e.author.username, id: e.author.id, avatar: e.author.displayAvatarURL({ dynamic: !0 }) },
                        },
                    };
                    s.queue.push(a);
                }
                e.guildDB.auto_shuffle && (e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5)),
                    s.tracksAdded(),
                    e.channel.send({ embeds: [{ description: `Added [${r.sp.name.slice(0, 50)}](${t}) with ${r.raw.length} tracks ${e.guildDB.auto_shuffle ? "🔀 And automatically shuffled" : ""}`, color: "#3a871f" }] }).catch(() => null),
                    setTimeout(() => {
                        s.playing || s.play();
                    }, 1e3);
            }
            return;
        }
        const { type: n, tracks: i, playlistName: o } = r;
        if ("PLAYLIST" !== n) {
            if (!r.tracks.length) return e.errorMessage("I didn't find any song on the query you provided!");
            const t = r.tracks[0];
            let a = t;
            if (s.queue.filter((e) => e.info.uri === t.info.uri).length > 3)
                return e.errorMessage("**Calm Down!** This song is already in the queue, if you want to play it alot of times, just enable the [loop mode](https://guide.green-bot.app/features/loop-mode) with the `loop` command!");
            if ("Discord" === a.info.author) return e.errorMessage("I didn't find any song on the query you provided!");
            s.playing && e.channel.send({ embeds: [{ description: `Enqueued **[${t.info.title.slice(0, 100)}](https://discord.gg/greenbot)** at position **#${s.queue.length + 1}**`, color: "#3a871f" }] }), s.addTrack(a, e.author);
        } else {
            e.successMessage("<a:green_loading:824308769713815612> Trying to resolve your tracks from a copyright free source!");
            for (let t of i) (t.info.requester = { name: e.author.username, id: e.author.id, avatar: e.author.displayAvatarURL({ dynamic: !0 }) }), s.queue.push(t);
            e.guildDB.auto_shuffle &&
                setTimeout(() => {
                    e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5);
                }, 2e3),
                e.channel.send({ embeds: [{ description: `Added [${o.slice(0, 50)}](${t}) with ${i.length} tracks ${e.guildDB.auto_shuffle ? "🔀 And automatically shuffled" : ""}`, color: "#3a871f" }] }).catch(() => null),
                s.playing || s.play(),
                s.tracksAdded();
        }
    }
    checkPl(e) {
        var t = e.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/);
        return !(!t || !t[2]);
    }
}
module.exports = Play;
