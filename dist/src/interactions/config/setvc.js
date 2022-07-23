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
class setVc extends QuickCommand_1.Command {
    get name() {
        return "setvc";
    }
    get description() {
        return "Restricts/Allows the bot to join a voice channel.";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["voice"];
    }
    get arguments() {
        return [{ name: "channel", description: "The voice channel you want to restrict the bot to", type: 7, required: true }];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("reset" === e.args[0].value)
                return (e.guildDB.vcs = []), e.client.database.handleCache(e.guildDB), e.successMessage("The bot is now allowed to join every single voice channel!");
            const n = e.guild.channels.get(e.args[0].value);
            if (!n || (2 !== n.type && "GUILD_STAGE_VOICE" !== n.type))
                return e.errorMessage("Please provide a valid voice channel Id. You can check [this guide](https://www.remote.tools/remote-work/how-to-find-discord-id) to learn how to do it.");
            e.guildDB.vcs.includes(`${n.id}`)
                ? ((e.guildDB.vcs = e.guildDB.vcs.filter((e) => e !== `${n.id}`)), e.client.database.handleCache(e.guildDB), e.successMessage(`Removed <#${n.id}> from the restricted voice channels.`))
                : (e.guildDB.vcs.push(`${n.id}`), e.client.database.handleCache(e.guildDB), e.successMessage(`Added <#${n.id}> to the restricted voice channels.`));
        });
    }
}
exports.default = setVc;
