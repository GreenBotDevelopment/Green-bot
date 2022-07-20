"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Karaoke extends QuickCommand_1.Command {
    get name() { return "karaoke"; }
    get description() { return "Enables/disables the karaoke filter"; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, dj: true, premium: true }; }
    async run({ ctx: e }) { return e.dispatcher.player.filters.karaoke ? (e.dispatcher.player.clearFilters(), e.successMessage("⏱ Disabling the `Karaoke` filter to the current song...")) : (e.dispatcher.player.setKaraoke({ level: 1, monoLevel: 1, filterBand: 220, filterWidth: 100 }), e.successMessage("⏱ Enabling the `Karaoke` filter to the current song...")); }
}
exports.default = Karaoke;
