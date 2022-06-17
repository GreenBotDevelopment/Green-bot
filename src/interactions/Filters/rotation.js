const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "rotation" }
    get description() { return "Enables/disables the rotation filter" }get category() { return "Filters" }
    get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, dj: !0, premium: !0 } }
    async run({ ctx: e }) { return e.dispatcher.player.filters.rotation ? (e.dispatcher.player.clearFilters(), e.successMessage("⏱ Disabling the `Rotation` filter to the current song...")) : (e.dispatcher.player.setRotation({ rotationHz: 0 }, e.dispatcher.player), e.successMessage("⏱ Enabling the `Rotation` filter to the current song...")) } }
module.exports = Volume;