const BaseCommand = require("../../abstract/BaseCommand.js");
class Pause extends BaseCommand {get name() { return "pause" }
    get description() { return "Pauses the current playback!" }get category() { return "Queue Management" }
    get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, dj: !0 } }
    run({ ctx: e }) { return e.dispatcher.player.paused ? e.errorMessage(`The player is already paused! You can unpause it with \`${e.guildDB.prefix}resume\``) : (e.dispatcher.player.setPaused(!0), e.successMessage("⏸ Music paused!")) } }
module.exports = Pause;