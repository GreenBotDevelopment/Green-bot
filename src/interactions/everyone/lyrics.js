const BaseCommand = require("../../abstract/BaseCommand.js"),
    fetch = require("node-fetch");
class Queue extends BaseCommand {get name() { return "lyrics" }
    get description() { return "Shows the lyrics of the current track or another track" }get category() { return "Everyone Commands" }
    get arguments() { return [{ name: "song", description: "if you want lyrics about a specific song", required: !1, type: 3 }] }get playerCheck() { return { voice: !1, dispatcher: !1, channel: !1, vote: true } }
    async run({ ctx: e }) { if (e.args[0]) { const r = e.args[0].value,
                i = "https://some-random-api.ml/lyrics?title=" + r.toLowerCase().replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "").split(" ").join("%20"),
                o = await fetch(i),
                a = await o.json(); return a.title ? e.reply({ embeds: [{ author: { name: `${a.title?a.title:t} - ${a.author?a.author:"Unknown"}`, icon_url: a.thumbnail[0], url: "https://green-bot.app" }, color: "#3A871F", description: `${a.lyrics.slice(0,4e3)}`, footer: { text: "Green-bot | Free music for everyone!", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) } }] }) : e.errorMessage("No lyrics found for `" + r + "`") } { if (!e.dispatcher || !e.dispatcher.current) return e.errorMessage("Please provide a song name"); const r = e.dispatcher.current.info.title,
                i = "https://some-random-api.ml/lyrics?title=" + r.toLowerCase().replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "").split(" ").join("%20"),
                t = await fetch(i),
                o = await t.json(); return o.title ? e.reply({ embeds: [{ author: { name: `${o.title?o.title:r} - ${o.author?o.author:"Unknown"}`, icon_url: o.thumbnail[0], url: "https://green-bot.app" }, color: "#3A871F", description: `${o.lyrics.slice(0,4e3)}`, footer: { text: "Green-bot | Free music for everyone!", icon_url: e.client.user.displayAvatarURL({ dynamic: !0, size: 512 }) } }] }) : e.errorMessage("No lyrics found for `" + e.dispatcher.current.info.title + "`") } } }
module.exports = Queue;