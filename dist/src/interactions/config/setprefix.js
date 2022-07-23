"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class setPrefix extends QuickCommand_1.Command {
    get name() {
        return "setprefix";
    }
    get description() {
        return "Sets the prefix for the bot";
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
        return [{ type: 3, name: "prefix", description: "The new prefix you want to set", required: true }];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            let r = e.args[0].value;
            return (("default" !== r && "reset" !== r) || (r = "*"),
                r.length > 4 || r.length < 0
                    ? e.errorMessage("The prefix must be between **1** and **4** characters long")
                    : r.startsWith("<") && r.endsWith(">")
                        ? e.errorMessage("Hooks such as `[]` or `<>` must not be used when executing commands. Ex: `" + e.guildDB.prefix + "setprefix !`")
                        : r === e.guildDB.prefix
                            ? e.errorMessage("The prefix is already set to `" + r + "` in this server!")
                            : ((e.guildDB.prefix = r), e.client.database.handleCache(e.guildDB), e.successMessage("The prefix has successfully updated to `" + r + "`! Example: `" + r + "play`\n\n🆕 Slash commands are here! Just type \"/\" to get started!!")));
        });
    }
}
exports.default = setPrefix;
