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
        return "setdj";
    }
    get description() {
        return "Adds a DJ role. Every single member with this role will be able to manage the music";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["dj", "djrole"];
    }
    get arguments() {
        return [{ name: "role", description: "The role you want to set as DJ role. Put disable to disable the dj role", required: true }];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            if ("disable" === e.args[0].toLowerCase() || "@everyone" === e.args[0] || "reset" === e.args[0])
                return null === e.guildDB.djroles || 0 == e.guildDB.djroles.length
                    ? e.errorMessage("The is no dj role set yet!")
                    : ((e.guildDB.djroles = []), e.dispatcher, e.client.database.handleCache(e.guildDB), e.successMessage("Successfully remvoved all DJ roles!!"));
            const s = e.guild.roles.get(e.message.roleMentions[0]) || e.guild.roles.get(e.args[0]);
            return (e.guildDB.djroles || (e.guildDB.djroles = []),
                !s || s.managed || s.guild.id !== e.guild.id
                    ? e.errorMessage("Please provide a valid role or a valid role Id.")
                    : e.guildDB.djroles.includes(s.id)
                        ? ((e.guildDB.djroles = e.guildDB.djroles.filter((e) => e !== s.id)), e.client.database.handleCache(e.guildDB), e.successMessage(`The role ${s.mention} is no longer a DJ role`))
                        : (e.guildDB.djroles.push(s.id), e.client.database.handleCache(e.guildDB), e.successMessage(`The role ${s.mention} is now a DJ role! \nNote that every member with this role will be able to manage the music!`)));
        });
    }
}
exports.default = Volume;
