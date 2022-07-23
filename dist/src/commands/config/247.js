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
        return "24/7";
    }
    get description() {
        return "This will enable/disable the 24h/7 mode. If enabled the bot will never leave your voice channel";
    }
    get aliases() {
        return ["247", "24-7", "24h7"];
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            return e.guildDB.h24
                ? ((e.guildDB.h24 = null), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.h24 = null), e.successMessage("🎧 24/7 mode: **Disabled**"))
                : ((e.guildDB.h24 = true), e.client.database.handleCache(e.guildDB), e.dispatcher && ((e.dispatcher.metadata.guildDB.h24 = true), (e.dispatcher.repeat = "queue")), e.successMessage("🎧 24/7 mode: **Enabled**"));
        });
    }
}
exports.default = Volume;
