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
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            return e.guildDB.vote_skip
                ? ((e.guildDB.vote_skip = null), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.vote_skip = null), e.successMessage("The `Vote-Skip` plugin is now disabled!"))
                : ((e.guildDB.vote_skip = true), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.vote_skip = true), e.successMessage("The `Vote-Skip` plugin is now enabled!"));
        });
    }
}
exports.default = Volume;
