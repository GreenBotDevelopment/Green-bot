const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "replay" }
    get aliases() { return ["restart"] }get description() { return "Replays the current song" }
    get category() { return "Queue Management" }get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, vote: true } }
    run({ ctx: e }) { e.dispatcher.player.seekTo(0), e.successMessage(":cd: Replaying the current song!") } }
module.exports = Volume;