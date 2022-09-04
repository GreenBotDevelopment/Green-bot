import { Constants } from "eris";
import { Command } from "../../abstract/QuickCommand";

export default class play extends Command {
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
    async run({ ctx: a }) {
        let d = a.args.join(" ");
        let create = a.dispatcher ? false : true;
        if (!d && a.dispatcher && a.dispatcher.player.paused) return a.dispatcher.player.setPaused(false), a.successMessage("\u23F8 Music unpaused!");
        if ((d.includes("soundcloud") && d.includes("?si") && (d = d.split("?")[0]), d.includes("soundcloud") && d.includes("?in_system_playlist") && (d = d.split("?in_system_playlist")[0]), !a.me.voiceState.channelID)) {
            const channel = await a.getVoiceChannel();
            if (!a.client.hasBotPerm(a, "voiceConnect", channel))
                return a.errorMessage(
                    "I don't have the required permissions to join your voice channel! I need `View Channels`, `Connect` and `Speak` permission. [Permissions Example](https://cdn.discordapp.com/attachments/904438715974287440/909076558558412810/unknown.png)\n If the problem persists, change the voice channel region to `Europe`"
                );
            if (!a.client.hasBotPerm(a, "voiceSpeak", channel) && 13 !== channel.type)
                return a.errorMessage(
                    "I don't have the permission to speak in your voice channel.\n Please give me the permission to or check this guide to learn how to give me this permissions:\nhttps://guide.green-bot.app/frequent-issues/permissions"
                );
            if (a.guildDB.vcs.length && !a.guildDB.vcs.includes(a.member.voiceState.channelID))
                return a.errorMessage(
                    a.guildDB.vcs.length > 1
                        ? `I am not allowed to play music in your voice channel.\n Please join one of the following channels: ${a.guildDB.vcs.map((e) => `<#${e}>`).join(",")}`
                        : `I can only play music in the <#${a.guildDB.vcs[0]}> channel.`
                );
        }
        if (d.includes("pornhub") && !a.channel.nsfw) return a.errorMessage("Please mark this channel as NSFW channel before being able to play this type of videos.\nRemember that this content is 18+ and could cause grave addictions.");
        let h = a.client.shoukaku.getNode();
        if (!h) return a.errorMessage("No nodes are available yet! You can report this error in [Green bot Server](https://discord.gg/greenbot)");
        if (!a.dispatcher) {
            try {
                const node = a.client.shoukaku.getNode()
                await node.joinChannel({
                    guildId: a.guild.id,
                    shardId: a.guild.shard.id,
                    channelId: a.member.voiceState.channelID,
                    deaf: true
                }).catch(err=>{
                     return a.errorMessage("**Uh Oh..**! Something went wrong while joining your voice channel!\n - You may have made an error with the permissions, go to Server Settings => Roles => Green-bot and grant the administrator permission\n - If it still happens and the bot has admin permissions, use the "+a.client.printCmd("forcejoin")+" command to solve the issue");
                })
            } catch (error) {
                a.client.shoukaku.players.delete(a.guild.id)
                return a.errorMessage("**Uh Oh..**! Something went wrong while joining your voice channel!\n - You may have made an error with the permissions, go to Server Settings => Roles => Green-bot and grant the administrator permission\n - If it still happens and the bot has admin permissions, use the "+a.client.printCmd("forcejoin")+" command to solve the issue");

            }
        }
        const c = await a.client.queue.create(a, h)
        if (!c) return a.errorMessage("**Uh Oh..**! Something went wrong while joining your voice channel.\nYou can do the command again or use the "+a.client.printCmd("forcejoin")+" command to solve the issue");
        if (!d) {
            c && 0 == c.queue.length
                ? a.send(`Queue is empty! Use ${a.client.printCmd("play")} to add something to the queue.`)
                : c && c.queue.length > 0
                    ? a.send(`Use ${a.client.printCmd("play")} to add something to the queue.`)
                    : a.send(`Queue is empty! Use ${a.client.printCmd("play")} to add something to the queue.`);
            return
        }
        let b = await a.client.shoukaku.search(h, d, a);
        if (!b) return;
        if (c.channelId !== a.channel.id && !a.guildDB.textchannel) a.channelId = a.channel.id

        if (d.includes("spotify")) {
            if (!b || !b.raw)
                return a.errorMessage(
                    "No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)"
                );
            if ("track" === b.sp.type) {
                let list_good = a.filterSongs(a.author.id, [b.raw])
                if (list_good.fullType !== "no") {
                    return a.errorMessage(`Your track can not be added to the queue ${list_good.fullType === "user" ? "because you have reached the limit of songs you can queue ( " + a.guildDB.max_songs.user + ")" : "because the current queue is already full (" + a.dispatcher.queue.length + "/" + a.dispatcher.queue.length + " tracks)"}`)
                }
                c.addTrack(b.raw, a.author),
                    c.queue.length && a.send({ embeds: [{ description: `Enqueued **[${b.sp.tracks[0].title.slice(0, 100)}](${b.sp.tracks[0].originURL})** at position **${c.queue.length + 1}**`, color: 0x3a871f }] });
            } else if ("playlist" === b.sp.type) {
                let list = [];
                for (let e of b.raw) {
                    if (b.scraped && !e.track) return

                    let l = {
                        info: {
                            title: b.scraped ? e.track?.name : e.title,
                            uri: b.scraped ? e.track.external_urls.spotify : e.originURL,
                            sp: true,
                            image: b.scraped ? e.album ? e.album.images[0].url : "" : e.thumbnail,
                            author: b.scraped ? e.track.artists ? e.track.artists[0].name : null : e.artists,
                            requester: { name: a.author.username, id: a.author.id, avatar: a.author.dynamicAvatarURL() },
                        },
                    };
                    list.push(l);
                }
                let list_good = a.filterSongs(a.author.id, list)
                if (list_good.fullType !== "no") {
                    if (list_good.songs.length == 0) {
                        return a.errorMessage(`Your playlist can not be added to the queue ${list_good.fullType === "user" ? "because you have reached the limit of songs you can queue ( " + a.guildDB.max_songs.user + ")" : "because the current queue is already full (" + a.dispatcher.queue.length + " / " + a.dispatcher.queue.length + " tracks)"}`)
                    }
                }
                a.send({ embeds: [{ description: `Added [${b.sp.name.slice(0, 50)}](${d}) with ${list_good.songs.length} tracks ${a.guildDB.auto_shuffle ? "\u{1F500} And automatically shuffled" : ""} ${list_good.fullType !== "no" ? `\nRemoved **${b.raw.length - list_good.songs.length}** songs because ${list_good.fullType === "user" ? "of the limitation of songs per user" : "the maximum queue size has been reached"}` : ""}`, color: 0x3a871f }] })
                a.guildDB.auto_shuffle && (list_good.songs = list_good.songs.sort(() => Math.random() - 0.5))
                c.queue.push(...list_good.songs);
                c.tracksAdded(),
                    setTimeout(() => {
                        c.playing || c.play();
                    }, 1e3);
            } else {
                if ("album" !== b.sp.type)
                    return a.errorMessage(
                        "No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)"
                    );
                let list = [];
                for (let e of b.raw) {
                    if (b.scraped && !e.track) return

                    let l = {
                        info: {
                            title: b.scraped ? e.track?.name : e.title,
                            uri: b.scraped ? e.track.external_urls.spotify : e.originURL,
                            sp: true,
                            image: b.scraped ? e.album ? e.album.images[0].url : "" : e.thumbnail,
                            author: b.scraped ? e.track?.artists[0]?.name : e.artists,
                            requester: { name: a.author.username, id: a.author.id, avatar: a.author.dynamicAvatarURL() },
                        },
                    };
                    list.push(l);
                }
                let list_good = a.filterSongs(a.author.id, list)
                if (list_good.fullType !== "no") {
                    if (list_good.songs.length == 0) {
                        return a.errorMessage(`Your playlist can not be added to the queue ${list_good.fullType === "user" ? "because you have reached the limit of songs you can queue ( " + a.guildDB.max_songs.user + ")" : "because the current queue is already full (" + a.dispatcher.queue.length + " / " + a.dispatcher.queue.length + " tracks)"}`)
                    }
                }
                a.guildDB.auto_shuffle && (list_good.songs = list_good.songs.sort(() => Math.random() - 0.5))
                c.queue.push(...list_good.songs);

                c.tracksAdded(),
                    a
                        .send({ embeds: [{ description: `Added [${b.sp.name.slice(0, 50)}](${d}) with ${b.raw.length} tracks ${a.guildDB.auto_shuffle ? "\u{1F500} And automatically shuffled" : ""} ${list_good.fullType !== "no" && `\nRemoved **${b.raw.length - list_good.songs.length}** songs because **${list_good.fullType === "user" ? "of the limitation of songs per user" : "the maximum queue size has been reached"}`}`, color: 0x3a871f }] })
                        .catch(() => null),
                    setTimeout(() => {
                        c.playing || c.play();
                    }, 1e3);
            }
            return;
        }
        let { loadType: n, tracks: i, playlistInfo: o } = b;
        if ("PLAYLIST_LOADED" !== n) {
            if (!b.tracks.length) return a.errorMessage("I didn't find any song on the query you provided!");
            let list_good = a.filterSongs(a.author.id, [b.tracks[0]])
            if (list_good.fullType !== "no") {
                return a.errorMessage(`Your track can not be added to the queue ${list_good.fullType === "user" ? "because you have reached the limit of songs you can queue ( " + a.guildDB.max_songs.user + ")" : "because the current queue is already full (" + a.dispatcher.queue.length + " songs)"}`)
            }
            let j = b.tracks[0],
                k = j;
            if (c.queue.filter((a) => a.info.uri === j.info.uri).length > 2)
                return a.errorMessage("**Calm Down!** This song is already in the queue, if you want to play it alot of times, just enable the [loop mode](https://guide.green-bot.app/features/loop-mode) with the "+a.client.printCmd("loop")+" command!");
            c.addTrack(k, a.author);
            if (c.queue.length) a.reply({ embeds: [{ description: `Added **[${j.info.title.slice(0, 50).replace("[", "").replace("]", "")}](https://discord.gg/greenbot)** by **[${j.info.author.slice(0, 40)}](https://discord.gg/greenbot)** to the queue at position **#${c.queue.length}**\nIf you want to play this track now, you can skip to this track using ${a.client.printCmd("jump")}`, color: 0x3a871f }] })
        } else {
            let list = []
            for (let g of i) {  
                g = c.parseTrack(g, a.author);
                list.push(g)
            }
            let list_good = a.filterSongs(a.author.id, list)
            if (list_good.fullType !== "no") {
                if (list_good.songs.length == 0) {
                    return a.errorMessage(`Your track can not be added to the queue ${list_good.fullType === "user" ? "because you have reached the limit of songs you can queue ( " + a.guildDB.max_songs.user + ")" : "because the current queue is already full (" + a.dispatcher.queue.length + " / + a.dispatcher.queue.length + tracks)"}`)
                }
            }
            c.queue.push(...list_good.songs)
            a.guildDB.auto_shuffle && (list_good.songs = list_good.songs.sort(() => Math.random() - 0.5))
            c.playing || c.play();
            a.send({ embeds: [{ description: `Added [${o.name.slice(0, 50)}](https://discord.gg/greenbot) with ${list_good.songs.length} tracks   ${a.guildDB.auto_shuffle ? "\u{1F500} And automatically shuffled" : ""} ${list_good.fullType !== "no" && `\nRemoved **${i.length - list_good.songs.length}** songs because ${list_good.fullType === "user" ? "of the limitation of songs per user" : "the maximum queue size has been reached"}`}`, color: 0x3a871f }] })
                .catch(() => null),
                c.tracksAdded();
        }
    }
    checkPl(b) {
        var a = b.match(/^.*(youtu.be\/|list=)([^#\&\?]*).*/);
        return !(!a || !a[2]);
    }
}
