"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Tremolo extends QuickCommand_1.Command {
    get name() { return "tremolo"; }
    get description() { return "Enables/disables the tremolo filter"; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, vote: true }; }
    async run({ ctx: e }) { return e.dispatcher.player.filters.tremolo ? (e.dispatcher.player.setTremolo(), e.successMessage("⏱ Disabling the `Tremolo` filter to the current song...")) : (e.dispatcher.player.setTremolo({ frequency: 4, depth: .75 }), e.successMessage("⏱ Enabling the `Tremolo` filter to the current song...")); }
}
exports.default = Tremolo;
