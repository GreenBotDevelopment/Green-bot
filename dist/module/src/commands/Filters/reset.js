"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Reset extends QuickCommand_1.Command {
    get name() { return "resetfilters"; }
    get description() { return "Clears all filters"; }
    get aliases() { return ["clearfilters", "reset"]; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true }; }
    async run({ ctx: e }) { e.dispatcher.player.clearFilters(), e.dispatcher.filters = [], e.successMessage("All filters have been cleared!"); }
}
exports.default = Reset;
