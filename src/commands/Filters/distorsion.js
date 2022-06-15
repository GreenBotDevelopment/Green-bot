const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "distorsion" }
    get description() { return "Enables/disables the distorsion filter. It can generate some pretty unique audio effects." }get category() { return "Filters" }
    get playerCheck() { return { voice: !0, dispatcher: !0, channel: !0, vote: true } }
    async run({ ctx: e }) { return e.dispatcher.filters.includes("distorsion") ? (e.dispatcher.player.setDistortion(), e.dispatcher.filters = e.dispatcher.filters.filter(e => "distorsion" !== e), e.successMessage("⏱ The `Distorsion` filter has been disabled.")) : (e.dispatcher.player.setDistortion({ sinOffset: 0, sinScale: 1, cosOffset: 0, cosScale: 1, tanOffset: 0, tanScale: 1, offset: 0, scale: 1 }), e.dispatcher.filters.push("distorsion"), e.successMessage("⏱ Enabling the `Distorsion` filter to the current song...")) } }
module.exports = Volume;