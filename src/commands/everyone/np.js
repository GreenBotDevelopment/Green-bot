const BaseCommand = require("../../abstract/BaseCommand.js"),
    KongouDispatcher = require("../../modules/KongouDispatcher.js");
class Queue extends BaseCommand {get name() { return "np" }
    get description() { return "Shows the current playing track" }get aliases() { return ["song", "current"] }
    get category() { return "Everyone Commands" }get playerCheck() { return { voice: !1, dispatcher: !0, channel: !1 } }
    run({ ctx: e }) { const r = e.dispatcher.current.info;
        e.channel.send({ embeds: [{ color: "#3A871F", author: { name: "| Now playing", icon_url: e.author.displayAvatarURL({ size: 512, format: "png" }), url: "https://green-bot.app" }, description: `[${r.title}]("https://freesounds.org") \n\n• __Author:__ ${r.author}\n• __Source:__ Freesounds.com\n• __Requester:__ ${r.requester?r.requester.name:"Unknow"}\n• __Progess:__ ${KongouDispatcher.humanizeTime(e.dispatcher.player.position)} - ${KongouDispatcher.humanizeTime(r.length)}` }] }) } }
module.exports = Queue;