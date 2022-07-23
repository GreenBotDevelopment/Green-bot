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
class Buttons extends QuickCommand_1.Command {
    get name() {
        return "buttons";
    }
    get description() {
        return "Enables or disables the buttons to control the music";
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
            return e.guildDB.buttons
                ? ((e.guildDB.buttons = null), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.buttons = null), e.successMessage("I will no longer show buttons on now playing messages!."))
                : ((e.guildDB.buttons = true), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.buttons = true), e.successMessage("I will now show buttons on now playing messages!"));
        });
    }
}
exports.default = Buttons;
