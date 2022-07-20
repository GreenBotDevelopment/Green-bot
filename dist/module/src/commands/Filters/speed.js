"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Speed extends QuickCommand_1.Command {
    get name() {
        return "speed";
    }
    get description() {
        return "Sets the speed of the playback";
    }
    get category() {
        return "Queue Management";
    }
    get arguments() {
        return [{ name: "time", description: "The speed", required: true }];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, premium: true };
    }
    async run({ ctx: e }) {
        if (e.dispatcher.errored === "yes")
            return e.errorMessage("The queue is in noFailure mode so you can't change the speed of the music.\n Try to do the fix command to reset the queue mode.");
        const t = e.args[0];
        return !t || isNaN(t) || t > 5 || 0 == t || t < 0
            ? e.successMessage("The duration you provided is incorrect. It must be a number beetwen **1** and **5**")
            : (e.dispatcher.player.setTimescale({ speed: t }), e.successMessage(`Speed of the playback set to \`${t}\``));
    }
}
exports.default = Speed;
