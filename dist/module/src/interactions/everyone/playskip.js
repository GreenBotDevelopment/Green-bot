"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Stop extends QuickCommand_1.Command {
    get name() {
        return "playskip";
    }
    get aliases() {
        return ["pskip", "ps"];
    }
    get description() {
        return "Adds a music to the queue and the skips to this music";
    }
    get category() {
        return "Everyone Commands";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    get arguments() {
        return [{ type: 3, name: "query", description: "The track you want to play", required: true }];
    }
    static wait(e) {
        return new Promise((t) => setTimeout(t, e).unref());
    }
    async run({ ctx: e }) {
        const t = e.args[0].value;
        const a = e.client.shoukaku.getNode();
        if (!a)
            return e.errorMessage("No nodes are available yet! You can report this error is [Green bot Server](https://discord.gg/greenbot)");
        const r = await e.client.queue.create(e, a);
        if (!r)
            return e.errorMessage("Something went wrong while joining your voice channel.\nPlease do the command again to fix it.");
        const s = await e.client.shoukaku.search(a, t, e);
        if (t.includes("spotify")) {
            if (!s || !s.raw)
                return e.errorMessage("No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)");
            if ("track" === s.sp.type) {
                r.addTrack(s.raw, e.author, "top");
                r.queue.length && e.send({ embeds: [{ description: `Enqueued **[${s.sp.tracks[0].title.slice(0, 100)}](${s.sp.tracks[0].originURL})** at position **${r.queue.length}**`, color: 0x3a871f }] });
            }
            else if ("playlist" === s.sp.type) {
                e.send({ embeds: [{ description: `Added [${s.sp.name.slice(0, 50)}](${t}) with ${s.raw.length} tracks ${e.guildDB.auto_shuffle ? "🔀 And automatically shuffled" : ""}`, color: 0x3a871f }] })
                    .catch(() => null);
                for (const t of s.raw) {
                    if (s.scraped && !t.track)
                        return;
                    const a = {
                        info: {
                            title: s.scraped ? t.name : t.title,
                            uri: s.scraped ? t.track.external_urls.spotify : t.originURL,
                            sp: true,
                            image: s.scraped ? t.image : t.thumbnail,
                            author: s.scraped ? null : t.artists,
                            requester: { name: e.author.username, id: e.author.id, avatar: e.author.dynamicAvatarURL() },
                        },
                    };
                    r.queue.splice(0, 0, a);
                }
                r.tracksAdded(),
                    e.guildDB.auto_shuffle && (e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5)),
                    setTimeout(() => {
                        r.playing || r.play();
                    }, 1e3);
            }
            else {
                if ("album" !== s.sp.type)
                    return e.errorMessage("No results found on spotify for your query!\nIf that's a playlist, it's maybe private! [How to make a spotify playlist public?](https://www.androidauthority.com/make-spotify-playlist-public-3075538/)");
                for (const t of s.raw) {
                    const a = {
                        info: {
                            title: s.scraped ? t.name : t.title,
                            author: s.scraped ? t.artists[0].name : t.artists,
                            image: s.scraped ? t.image : t.thumbnail,
                            uri: s.scraped ? t.external_urls.spotify : t.originURL,
                            sp: true,
                            requester: { name: e.author.username, id: e.author.id, avatar: e.dynamicAvatarURL() },
                        },
                    };
                    r.queue.splice(0, 0, a);
                }
                r.tracksAdded(),
                    e.guildDB.auto_shuffle && (e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5)),
                    e.channel
                        .send({ embeds: [{ description: `Added [${s.sp.name.slice(0, 50)}](${t}) with ${s.raw.length} tracks ${e.guildDB.auto_shuffle ? "🔀 And automatically shuffled" : ""}`, color: 0x3a871f }] })
                        .catch(() => null),
                    setTimeout(() => {
                        r.playing || r.play();
                    }, 1e3);
            }
            return;
        }
        const { loadType: i, tracks: o, playlistInfo: n } = s;
        if ("PLAYLIST_LOADED" !== i) {
            if (!s.tracks.length)
                return e.errorMessage("I didn't find any song on the query you provided!");
            const i = s.tracks[0];
            r.addTrack(i, e.author, "top");
            r.queue.length && e.send({ embeds: [{ description: `Enqueued **[${i.info.title.slice(0, 100)}](https://discord.gg/greenbot)** and skipping to this track`, color: 0x3a871f }] });
        }
        else {
            for (let t of o)
                (t = r.parseTrack(t)), r.queue.splice(0, 0, t);
            e.guildDB.auto_shuffle &&
                setTimeout(() => {
                    e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - 0.5);
                }, 2e3),
                r.tracksAdded(),
                e.send({ embeds: [{ description: `Added [${n.name.slice(0, 50)}](https://discord.gg/greenbot) with ${o.length} tracks ${e.guildDB.auto_shuffle ? "🔀 And automatically shuffled" : ""}`, color: 0x3a871f }] }).catch(() => null),
                r.playing || r.play();
        }
        setTimeout(() => {
            r.queue.length && e.dispatcher.skip();
        }, 1000);
    }
}
exports.default = Stop;
