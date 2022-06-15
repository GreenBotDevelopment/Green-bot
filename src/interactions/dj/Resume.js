const BaseCommand = require("../../abstract/BaseCommand.js");
class Pause extends BaseCommand {get name() { return "resume" }
    get description() { return "Resumes the current playback!" }get category() { return "Queue Management" }
    get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, dj: !0 } }
    run({ ctx: e }) { return e.dispatcher.player.paused ? (e.dispatcher.player.setPaused(!1), e.successMessage("▶ Music Unpaused!")) : e.errorMessage("The player is not paused so I can't unpause it!") } }
module.exports = Pause;