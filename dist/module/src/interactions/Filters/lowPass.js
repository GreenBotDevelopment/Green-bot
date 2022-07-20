"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class lowPass extends QuickCommand_1.Command {
    get name() { return "lowpass"; }
    get description() { return "Enables/disables the lowPass filter"; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, dj: true, vote: true }; }
    async run({ ctx: e }) { return e.dispatcher.player.filters.lowPass ? (e.dispatcher.player.clearFilters(), e.successMessage("⏱ Disabling the `lowPass` filter to the current song...")) : (e.dispatcher.player.setLowPass({ smoothing: 20 }), e.successMessage("⏱ Enabling the `lowPass` filter to the current song...")); }
}
exports.default = lowPass;
