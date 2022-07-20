"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Volume extends QuickCommand_1.Command {
    get name() {
        return "voteskip";
    }
    get description() {
        return "This will enable/disable the vote skip system";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    async run({ ctx: e }) {
        return e.guildDB.vote_skip
            ? ((e.guildDB.vote_skip = null), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.vote_skip = null), e.successMessage("The `Vote-Skip` plugin is now disabled!"))
            : ((e.guildDB.vote_skip = true), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.vote_skip = true), e.successMessage("The `Vote-Skip` plugin is now enabled!"));
    }
}
exports.default = Volume;
