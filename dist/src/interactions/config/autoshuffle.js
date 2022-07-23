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
class AutoShuffle extends QuickCommand_1.Command {
    get name() {
        return "autoshuffle";
    }
    get description() {
        return "Toggles the Auto-Shuffle plugin.";
    }
    get aliases() {
        return ["autoshufflle", "autoshufle"];
    }
    get permissions() {
        return ["manageGuild"];
    }
    get category() {
        return "Admin Commands";
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            return e.guildDB.auto_shuffle
                ? ((e.guildDB.auto_shuffle = null), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.auto_shuffle = null), e.successMessage("The `Auto-Shuffle` plugin has been disabled."))
                : ((e.guildDB.auto_shuffle = true), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.auto_shuffle = true), e.successMessage("The `Auto-Shuffle` plugin has been enabled!"));
        });
    }
}
exports.default = AutoShuffle;
