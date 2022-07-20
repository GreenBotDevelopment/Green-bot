"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Vibrato extends QuickCommand_1.Command {
    get name() { return "vibrato"; }
    get description() { return "Enables/disables the vibrato filter"; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, dj: true, premium: true }; }
    async run({ ctx: e }) { return e.dispatcher.player.filters.vibrato ? (e.dispatcher.player.clearFilters(), e.successMessage("⏱ Disabling the `Vibrato` filter to the current song...")) : (e.dispatcher.player.setVibrato({ frequency: 4, depth: .75 }), e.successMessage("⏱ Enabling the `Vibrato` filter to the current song...")); }
}
exports.default = Vibrato;
