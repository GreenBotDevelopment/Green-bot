"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Volume extends QuickCommand_1.Command {
    get name() {
        return "replay";
    }
    get aliases() {
        return ["restart"];
    }
    get description() {
        return "Replays the current song";
    }
    get category() {
        return "Queue Management";
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true };
    }
    run({ ctx: e }) {
        e.dispatcher.addTrack(e.dispatcher.current, e.author, "top"), e.successMessage(":cd: I will replay this song once it's ended!");
    }
}
exports.default = Volume;
