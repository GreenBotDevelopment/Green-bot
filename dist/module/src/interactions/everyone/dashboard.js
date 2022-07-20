"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Play extends QuickCommand_1.Command {
    get name() {
        return "dashboard";
    }
    get description() {
        return "gives the dashboard link";
    }
    get aliases() {
        return ["dash", "web", "panel", "pannel"];
    }
    get category() {
        return "Everyone Commands";
    }
    run({ ctx: e }) {
        e.successMessage(`🆕 You can now manage the music easily from the [Dashboard](https://dash.green-bot.app/app/${e.guild.id})`);
    }
}
exports.default = Play;
