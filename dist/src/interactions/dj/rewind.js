"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
const ms = require("ms");
class Rewind extends QuickCommand_1.Command {
    get name() {
        return "rewind";
    }
    get description() {
        return "Rewind a specific amount of time into the track.";
    }
    get category() {
        return "Queue Management";
    }
    get arguments() {
        return [{ name: "time", type: 3, description: "The time to rewind", required: true }];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, };
    }
    run({ ctx: e }) {
        let r = e.args[0].value || "10s";
        r.includes("m") || r.includes("s") || r.includes("h") || (r += "s");
        const t = ms(r);
        return !t || isNaN(t) || t < 0
            ? e.errorMessage("The duration you provided is incorrect. Please provide a number of seconds.")
            : t > e.dispatcher.current.info.length
                ? e.errorMessage("Your provided a duration higher than the current song duration.")
                : (e.dispatcher.player.seekTo(e.dispatcher.player.position - t), void e.successMessage(`⏭ Rewinded the music of \`${r}\``));
    }
}
exports.default = Rewind;
