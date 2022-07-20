"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Loop extends QuickCommand_1.Command {
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
        return [
            {
                name: "mode",
                type: 3,
                description: "Wich type of loop you want to enable: `queue`, `song` or `off`",
                required: true,
                choices: [
                    { name: "Queue", value: "queue" },
                    { name: "Song", value: "song" },
                    { name: "Off", value: "off" },
                ],
            },
        ];
    }
    get checks() {
        return { voice: true, dispatcher: true, channel: true, vote: true };
    }
    run({ ctx: e }) {
        const a = e.args[0].value;
        if ("queue" === a || "all" === a || "q" === a) {
            if ("queue" === e.dispatcher.repeat)
                return e.dispatcher.repeat, e.successMessage(":repeat_one: The loop mode has been disabled.");
            (e.dispatcher.repeat = "queue"), e.successMessage("🔄 Now looping the entiere queue.");
        }
        else if ("song" === a || "current" === a || "s" === a) {
            if ("song" === e.dispatcher.repeat)
                return e.dispatcher.repeat, e.successMessage(":repeat_one: The loop mode has been disabled.");
            (e.dispatcher.repeat = "song"), e.successMessage("🔂 Now looping the current track");
        }
        else {
            if ("disable" !== a && "off" !== a)
                return e.errorMessage("Please provide a valid option for this command! `queue`, `song` of `off`");
            if ("off" === e.dispatcher.repeat)
                return e.errorMessage("The loop mode is already disabled!");
            (e.dispatcher.repeat = "off"), e.successMessage(":repeat_one: The loop mode has been disabled.");
        }
    }
}
exports.default = Loop;
