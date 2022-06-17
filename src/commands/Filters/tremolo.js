const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "tremolo" }
    get description() { return "Enables/disables the tremolo filter" }get category() { return "Filters" }
    get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, premium: !0 } }
    async run({ ctx: e }) { return e.dispatcher.player.filters.tremolo ? (e.dispatcher.player.setTremolo(), e.successMessage("⏱ Disabling the `Tremolo` filter to the current song...")) : (e.dispatcher.player.setTremolo({ frequency: 4, depth: .75 }), e.successMessage("⏱ Enabling the `Tremolo` filter to the current song...")) } }
module.exports = Volume;