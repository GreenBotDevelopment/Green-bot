"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Shuffle extends QuickCommand_1.Command {
    get name() { return "shuffle"; }
    get description() { return "Shuffles the current queue of songs!"; }
    get category() { return "Queue Management"; }
    get aliases() { return ["shufle", "shufflle", "mix"]; }
    get checks() { return { voice: true, dispatcher: true, channel: true, dj: true, vote: false }; }
    run({ ctx: e }) { if (e.dispatcher.queue.length < 2)
        return e.errorMessage("There is not enough tracks in the queue to shuffle it."); e.dispatcher.queue = e.dispatcher.queue.sort(() => Math.random() - .5), e.successMessage(`🔀 The server queue has been mixed succesfully (**${e.dispatcher.queue.length}** songs)`); }
}
exports.default = Shuffle;
