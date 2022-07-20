"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
const ms = require("ms");
class Forward extends QuickCommand_1.Command {
    get name() { return "forward"; }
    get description() { return "Forward a specific amount of time into the track."; }
    get aliases() { return ["ff", "fastforward"]; }
    get category() { return "Queue Management"; }
    get arguments() { return [{ name: "time", type: 3, description: "The time to forward", required: true }]; }
    get checks() { return { voice: true, dispatcher: true, channel: true, dj: true, vote: true }; }
    run({ ctx: e }) { let r = e.args[0] ? e.args[0].value : "10s"; r.includes("m") || r.includes("s") || r.includes("h") || (r += "s"); const t = ms(r); return !t || isNaN(t) || t < 0 ? e.errorMessage("The duration you provided is incorrect. Please provide a number of seconds.") : t > e.dispatcher.current.info.length ? e.errorMessage("Your provided a duration higher than the current song duration.") : (e.dispatcher.player.seekTo(parseInt(e.dispatcher.player.position + t)), void e.successMessage(`⏭ Fast forwarded the music of \`${r}\``)); }
}
exports.default = Forward;
