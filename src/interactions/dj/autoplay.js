const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "autoplay" }
    get description() { return "Enables or disables the autoplay system. " }get aliases() { return ["ap", "auto"] }
    get category() { return "Queue Management" }get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, vote: true, dj: !0 } }
    run({ ctx: e }) { return "autoplay" === e.dispatcher.repeat ? (e.dispatcher.repeat = "off", e.successMessage("🎼 Autoplay: **Disabled**")) : (e.dispatcher.repeat = "autoplay", e.successMessage("🎼 Autoplay: **Enabled**")) } }
module.exports = Volume;