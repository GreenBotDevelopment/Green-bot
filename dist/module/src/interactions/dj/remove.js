"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Volume extends QuickCommand_1.Command {
    get name() { return "remove"; }
    get description() { return "Remove a music from the queue"; }
    get aliases() { return ["rem"]; }
    get category() { return "Queue Management"; }
    get arguments() { return [{ type: 3, name: "track", description: "The position or the track of the track you want to remove", required: true }]; }
    get checks() { return { voice: true, dispatcher: true, vote: false, channel: true, dj: true }; }
    run({ ctx: e }) { const r = e.args[0].value.replace("#", "") - 1; const t = e.dispatcher.queue[r]; if (!t)
        return e.errorMessage("There is no track with this number in your queue."); e.dispatcher.remove(r), e.successMessage(`Removed [${t.info.title}](https://discord.gg/greenbot) from the queue`); }
}
exports.default = Volume;
