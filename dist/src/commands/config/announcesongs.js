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
        return "announcesongs";
    }
    get description() {
        return "This will enable/disable now-playing aka song announcing";
    }
    get aliases() {
        return ["announcesong", "announce", "toggle-np"];
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    run({ ctx: n }) {
        return __awaiter(this, void 0, void 0, function* () {
            return n.guildDB.announce
                ? ((n.guildDB.announce = null), n.client.database.handleCache(n.guildDB), n.dispatcher && (n.dispatcher.metadata.guildDB.announce = null), n.successMessage("I will now hide the messages announcing a new song."))
                : ((n.guildDB.announce = true), n.client.database.handleCache(n.guildDB), n.dispatcher && (n.dispatcher.metadata.guildDB.announce = true), n.successMessage("I will now show the messages announcing a new song."));
        });
    }
}
exports.default = Volume;
