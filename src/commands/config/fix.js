const BaseCommand = require("../../abstract/BaseCommand.js");
class Skip extends BaseCommand {
    get name() {
        return "fix";
    }
    get description() {
        return "Fixes every single problem with the player";
    }
    get permissions() {
        return ["MANAGE_GUILD"];
    }
    get category() {
        return "Admin Commands";
    }
    get playerCheck() {
        return { voice: !0, dispatcher: !0, channel: !1 };
    }
    run({ ctx: e }) {
        console.log(e.dispatcher.node.name);
        const r = e.client.shoukaku.players.get(e.guild.id),
            n = Number(e.dispatcher.node.name) > 6 ? Number(e.dispatcher.node.name) - 1 : Number(e.dispatcher.node.name) + 1;
        return (
            n ?
            (r ? r.move(n) : e.dispatcher ? e.dispatcher.player.move(n) : e.errorMessage("No player found for this server"), e.successMessage("Moved your player to a closer node!")) :
            e.errorMessage("Please return a node name (1-4)"),
            e.dispatcher.player.connection && 3 != e.dispatcher.player.connection.state ?
            "rotterdam" !== e.member.voice.channel.rtcRegion ?
            (e.member.voice.channel.setRTCRegion("rotterdam").catch(() => e.errorMessage("I can't change your voice channel region because I don't have the permission to!")),
                e.successMessage("Changed voice channel region to **europe**")) :
            e.errorMessage("No fix can be made!") :
            (e.dispatcher.queue.length, e.dispatcher.player.connection.reconnect().then(() => e.dispatcher.player.resume()), e.successMessage(`Reconnected the bot in <#${e.dispatcher.player.connection.channelId}>`))
        );
    }
}
module.exports = Skip;