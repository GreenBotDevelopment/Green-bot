"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Nightcore extends QuickCommand_1.Command {
    get name() { return "nightcore"; }
    get description() { return "Enables/disables the nightcore filter. It can generate some pretty unique audio effects."; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, vote: true }; }
    async run({ ctx: e }) { return e.dispatcher.filters.includes("nightcore") ? (e.dispatcher.player.setTimescale(), e.dispatcher.filters = e.dispatcher.filters.filter(e => "nightcore" !== e), e.successMessage("⏱ Disabling the `nightcore` filter to the current song...")) : (e.dispatcher.player.setTimescale({ speed: 1.165, pitch: 1.125, rate: 1.05 }), e.dispatcher.filters.push("nightcore"), e.successMessage("⏱ Enabling the `nightcore` filter to the current song...")); }
}
exports.default = Nightcore;
