const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "vibrato" }
    get description() { return "Enables/disables the vibrato filter" }get category() { return "Filters" }
    get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, dj: !0, premium: !0 } }
    async run({ ctx: e }) { return e.dispatcher.player.filters.vibrato ? (e.dispatcher.player.clearFilters(), e.successMessage("⏱ Disabling the `Vibrato` filter to the current song...")) : (e.dispatcher.player.setVibrato({ frequency: 4, depth: .75 }), e.successMessage("⏱ Enabling the `Vibrato` filter to the current song...")) } }
module.exports = Volume;