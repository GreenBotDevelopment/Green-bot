const BaseCommand = require("../../abstract/BaseCommand.js"),
    userData = require("../../models/user");
class Queue extends BaseCommand {
    get name() {
        return "pl-add";
    }
    get description() {
        return "Adds a song to one of your playlists";
    }
    get aliases() {
        return ["pladd", "playlist-add"];
    }
    get category() {
        return "Everyone Commands";
    }
    get arguments() {
        return [
            { name: "playlist_name", description: "The name of the playlist you want to create", required: !0 },
            { name: "tracks", description: "The tracks you want to add to this playlist", required: !0 },
        ];
    }
    async run({ ctx: e }) {
        const r = e.args[0];
        if (r.length < 3 || r.length > 50) return e.errorMessage("The playlist name must be beetween 2 and 50 long.");
        const a = await userData.findOne({ userID: e.author.id });
        if (!a || !a.playlists.find((e) => e.name === r)) return e.errorMessage(`You don't have any playlist called **${r}** yet!`);
        const t = [];
        let s;
        if (!e.args[1]) return e.errorMessage("Please provide the song you want to add to this playlist!");
        s = await e.successMessage("<a:green_loading:824308769713815612> Loading your tracks... Please wait.");
        const o = e.client.shoukaku.getNode(),
            n = e.args.slice(1).join(" "),
            u = await e.client.shoukaku.search(o, n, e);
        if (u)
            if (n.includes("spotify")) {
                if (!u || !u.raw) return s.delete(), e.errorMessage("No results found for your query");
                if ("track" === u.sp.type)(u.raw.info.requester = { name: e.author.username, id: e.author.id }), t.push(u.raw);
                else if ("playlist" === u.sp.type)
                    for (const r of u.raw) {
                        if (u.scraped && !r.track) return s.delete(), e.errorMessage("No results found for your query");
                        let a = {
                            info: {
                                title: u.scraped ? r.name : r.title,
                                image: u.scraped ? r.image : r.thumbnail,
                                uri: u.scraped ? r.track.external_urls.spotify : r.originURL,
                                sp: !0,
                                author: r.scraped ? null : r.artists,
                                requester: { name: e.author.username, avatar: e.author.displayAvatarURL({ dynamic: !0 }), id: e.author.id },
                            },
                        };
                        t.push(a);
                    }
                else {
                    if ("album" !== u.sp.type) return s.delete(), e.errorMessage("No results found for your query");
                    for (const r of u.raw) {
                        let a = {
                            info: {
                                title: u.scraped ? r.name : r.title,
                                author: u.scraped ? r.artists[0].name : r.artists,
                                uri: u.scraped ? r.external_urls.spotify : r.originURL,
                                image: u.scraped ? r.image : r.thumbnail,
                                sp: !0,
                                requester: { name: e.author.username, id: e.author.id, avatar: e.author.displayAvatarURL({ dynamic: !0 }) },
                            },
                        };
                        t.push(a);
                    }
                }
            } else {
                const { type: r, tracks: a, playlistName: o } = u;
                if ("PLAYLIST" !== r) {
                    if (!u.tracks.length) return s.delete(), e.errorMessage("No results found for your query");
                    let r = u.tracks[0];
                    (r.info.requester = { name: e.author.username, id: e.author.id, avatar: e.author.displayAvatarURL({ dynamic: !0 }) }), t.push(r);
                } else
                    for (let r of a)(r.info.requester = { name: e.author.username, id: e.author.id }), t.push(r);
            }
        setTimeout(async() => {
            s.delete(), e.successMessage(`Successfully added ${t.length} track(s) to **${r}** `);
            const o = a.playlists.find((e) => e.name === r);
            return t.forEach((e) => o.tracks.push(e)), (a.playlists = a.playlists.filter((e) => e.name !== r)), a.playlists.push(o), a.save();
        }, 1500);
    }
}
module.exports = Queue;