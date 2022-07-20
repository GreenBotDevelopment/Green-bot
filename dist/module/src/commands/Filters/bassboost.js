"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Bassboost extends QuickCommand_1.Command {
    get name() { return "bassboost"; }
    get description() { return "Enables/disables the bassboost filter. It can generate some pretty unique audio effects."; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, vote: true }; }
    async run({ ctx: e }) { return e.dispatcher.filters.includes("bassboost") ? (e.dispatcher.player.setEqualizer([]), e.dispatcher.filters = e.dispatcher.filters.filter(e => "bassboost" !== e), e.successMessage("⏱ The `bassboost` filter has been disabled!")) : (e.dispatcher.player.setEqualizer([{ band: 0, gain: .34 }, { band: 1, gain: .34 }, { band: 2, gain: .34 }, { band: 3, gain: .34 }]), e.dispatcher.filters.push("bassboost"), e.successMessage("⏱ Enabling the `bassboost` mode to the current song")); }
}
exports.default = Bassboost;
