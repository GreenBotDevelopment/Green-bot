"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Rotation extends QuickCommand_1.Command {
    get name() { return "rotation"; }
    get description() { return "Enables/disables the rotation filter"; }
    get category() { return "Filters"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, vote: true }; }
    async run({ ctx: e }) { return e.dispatcher.player.filters.rotation ? (e.dispatcher.player.setRotation(), e.successMessage("⏱ Disabling the `Rotation` filter to the current song...")) : (e.dispatcher.player.setRotation({ rotationHz: 0 }, e.dispatcher.player), e.successMessage("⏱ Enabling the `Rotation` filter to the current song...")); }
}
exports.default = Rotation;
