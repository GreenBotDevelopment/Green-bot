"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Repeat extends QuickCommand_1.Command {
    get name() {
        return "loop";
    }
    get description() {
        return "Sets the repeat mode of this playback";
    }
    get category() {
        return "Queue Management";
    }
    get aliases() {
        return ["repeat", "l", "replay", "loopqueue", "loopsong"];
    }
    get arguments() {
        return [{ name: "mode", description: "Wich type of loop you want to enable: `queue`, `song` or `off`" }];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, vote: true };
    }
    run({ ctx: e }) {
        const o = e.args[0];
        if ("queue" === o || "all" === o || "q" === o || e.message.content.includes("loopqueue")) {
            if ("queue" === e.dispatcher.repeat)
                return (e.dispatcher.repeat = "off"), e.successMessage(":repeat_one: The loop mode has been disabled.");
            (e.dispatcher.repeat = "queue"), e.successMessage("🔄 Now looping the entire queue.");
        }
        else if ("song" === o || "current" === o || "s" === o || e.message.content.includes("loopsong")) {
            if ("song" === e.dispatcher.repeat)
                return (e.dispatcher.repeat = "off"), e.successMessage(":repeat_one: The loop mode has been disabled.");
            (e.dispatcher.repeat = "song"), e.successMessage("🔂 Now looping the current track");
        }
        else {
            if ("disable" !== o && "off" !== o)
                return e.errorMessage("Please provide a valid option for this command! `queue`, `song` of `off`");
            if ("off" === e.dispatcher.repeat)
                return e.errorMessage("The loop mode is already disabled!");
            (e.dispatcher.repeat = "off"), e.successMessage(":repeat_one: The loop mode has been disabled.");
        }
    }
}
exports.default = Repeat;
