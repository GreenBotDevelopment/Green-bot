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
class Volume extends QuickCommand_1.Command {
    get name() {
        return "djcommands";
    }
    get description() {
        return "Sets wich commands are for DJs only";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["djcmd", "djcommand", "djscommands"];
    }
    get arguments() {
        return [{ name: "command_name", description: "The command you want to toggle. If this command is not in the list, it will be added, else it will be removed!", required: true }];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("reset" === e.args[0])
                return ((e.guildDB.dj_commands = [
                    "autoplay",
                    "back",
                    "clearqueue",
                    "forceskip",
                    "forward",
                    "givedj",
                    "jump",
                    "leavecleanup",
                    "loop",
                    "move",
                    "pause",
                    "resume",
                    "remove",
                    "removedupes",
                    "replay",
                    "rewind",
                    "seek",
                    "shuffle",
                    "stop",
                    "volume",
                ]),
                    e.client.database.handleCache(e.guildDB),
                    e.successMessage("The DJ commands have been reseted!"));
            const s = e.client.commands.getCommand(e.args[0]);
            if (!s)
                return e.errorMessage("Please provide a valid command name. You can get the command list with the help command.");
            e.guildDB.dj_commands.includes(`${s.name}`)
                ? ((e.guildDB.dj_commands = e.guildDB.dj_commands.filter((e) => e !== `${s.name}`)), e.client.database.handleCache(e.guildDB), e.successMessage(`The \`${s.name}\` command is no longer a DJ command!`))
                : (e.guildDB.dj_commands.push(`${s.name}`),
                    e.client.database.handleCache(e.guildDB),
                    e.successMessage(`Added the \`${s.name}\` command to the DJ commands.\nNow users need to have the Dj role to use this command (If the dj role is set)`));
        });
    }
}
exports.default = Volume;
