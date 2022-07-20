"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Back extends QuickCommand_1.Command {
    get name() { return "back"; }
    get description() { return "Plays the previous track from your queue"; }
    get aliases() { return ["b", "previous", "toggle-np"]; }
    get category() { return "Queue Management"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, dj: true }; }
    run({ ctx: e }) { if (0 == e.dispatcher.previousTracks.length)
        return e.errorMessage("There is no previous track on your queue"); e.dispatcher.queue.unshift(e.dispatcher.previousTracks[e.dispatcher.previousTracks.length - 1]), e.reply("**⏪ *Now Playing the previous track from your queue!***👍"), e.dispatcher.skip(); }
}
exports.default = Back;
