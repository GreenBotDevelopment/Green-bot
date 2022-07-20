"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Replay extends QuickCommand_1.Command {
    get name() { return "replay"; }
    get description() { return "Replays the current song"; }
    get category() { return "Queue Management"; }
    get checks() { return { voice: true, dispatcher: true, channel: true, dj: true }; }
    run({ ctx: e }) { if (!e.dispatcher.current)
        return e.errorMessage("No current music"); e.dispatcher.addTrack(e.dispatcher.current, e.author, "top"), e.successMessage(":cd: Replaying the current song!"); }
}
exports.default = Replay;
