const BaseCommand = require("../../abstract/BaseCommand.js"),
    userData = require("../../models/user");
class Queue extends BaseCommand {get name() { return "pl-add" }
    get description() { return "Adds a song to one of your playlists" }get aliases() { return ["pladd", "playlist-add"] }
    get category() { return "Everyone Commands" }get arguments() { return [{ name: "playlist_name", description: "The name of the playlist you want to create", required: !0, type: 3 }, { name: "tracks", description: "The tracks you want to add to this playlist", required: !0, type: 3 }] }
    async run({ ctx: e }) { const r = e.args[0].value; if (r.length < 3 || r.length > 50) return e.errorMessage("The playlist name must be beetween 2 and 50 long."); const s = await userData.findOne({ userID: e.author.id }); if (!s || !s.playlists.find(e => e.name === r)) return e.errorMessage(`You don't have any playlist called **${r}** yet!`); const t = []; if (!e.args[1]) return e.errorMessage("Please provide the song you want to add to this playlist!");
        e.successMessage("<a:green_loading:824308769713815612> Loading your tracks... Please wait."); const a = e.client.shoukaku.getNode(),
            o = e.args[1].value,
            u = await e.client.shoukaku.search(a, o, e); if (u)
            if (o.includes("spotify")) { if (!u || !u.raw) return e.errorMessage("No results found for your query"); if ("track" === u.sp.type) u.raw.info.requester = { name: e.author.username, id: e.author.id }, t.push(u.raw);
                else if ("playlist" === u.sp.type)
                    for (const r of u.raw) { if (u.scraped && !r.track) return e.errorMessage("No results found for your query"); let s = { info: { title: u.scraped ? r.name : r.title, uri: u.scraped ? r.track.external_urls.spotify : r.originURL, sp: !0, author: r.scraped ? null : r.artists, requester: { name: e.author.username, id: e.author.id } } };
                        t.push(s) } else { if ("album" !== u.sp.type) return e.errorMessage("No results found for your query"); for (const r of u.raw) { let s = { info: { title: u.scraped ? r.name : r.title, author: u.scraped ? r.artists[0].name : r.artists, uri: r.scraped ? r.external_urls.spotify : r.originURL, sp: !0, requester: { name: e.author.username, id: e.author.id } } };
                            t.push(s) } } } else { const { type: r, tracks: s, playlistName: a } = u; if ("PLAYLIST" !== r) { if (!u.tracks.length) return e.errorMessage("No results found for your query"); let r = u.tracks[0];
                    r.info.requester = { name: e.author.username, id: e.author.id }, t.push(r) } else
                    for (let r of s) r.info.requester = { name: e.author.username, id: e.author.id }, t.push(r) }
        setTimeout(async() => { e.successMessage(`Successfully added ${t.length} track(s) to **${r}** `); const a = s.playlists.find(e => e.name === r); return t.forEach(e => a.tracks.push(e)), s.playlists = s.playlists.filter(e => e.name !== r), s.playlists.push(a), s.save() }, 1500) } }
module.exports = Queue;