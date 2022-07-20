"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Volume extends QuickCommand_1.Command {
    get name() {
        return "setprefix";
    }
    get description() {
        return "Sets the prefix for the bot. This is the character to execute commands. Default prefix is *";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["prefix"];
    }
    get arguments() {
        return [{ name: "prefix", description: "The new prefix you want to set", required: true }];
    }
    async run({ ctx: e }) {
        let r = e.args[0];
        return (("default" !== r && "reset" !== r) || (r = "*"),
            r.length > 4 || r.length < 0
                ? e.errorMessage("The prefix must be between **1** and **4** characters long")
                : r.startsWith("<") && r.endsWith(">")
                    ? e.errorMessage("Hooks such as `[]` or `<>` must not be used when executing commands. Ex: `" + e.guildDB.prefix + "setprefix !`")
                    : r === e.guildDB.prefix
                        ? e.errorMessage("The prefix is already set to `" + r + "` in this server!")
                        : ((e.guildDB.prefix = r), e.client.database.handleCache(e.guildDB), e.successMessage("The prefix has successfully updated to `" + r + "`! Example: `" + r + "play`")));
    }
}
exports.default = Volume;
