const BaseCommand = require("../../abstract/BaseCommand.js");
class Stop extends BaseCommand {get name() { return "leave" }
    get description() { return "Leaves the current voice channel" }get aliases() { return ["dc", "destroy", "disconnect"] }
    get category() { return "Queue Management" }get playerCheck() { return { voice: !0, channel: !0 } }
    run({ ctx: e }) { if (e.dispatcher) e.dispatcher.delete(), e.successMessage("⏹ The player has been successfuly stopped and I left the channel!"), e.guild.me.voice && e.guild.me.voice.disconnect();
        else { if (!e.guild.me.voice.channelId) return e.errorMessage("I am not currently playing music in this server. So it's impossible to do that");
            e.guild.me.voice.disconnect(), e.successMessage("Disconnected!") } } }
module.exports = Stop;