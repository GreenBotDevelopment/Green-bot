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
        return "clean";
    }
    get category() {
        return "Admin Commands";
    }
    get description() {
        return "Delete all the bot messages in the channel.";
    }
    get permissions() {
        return ["manageGuild"];
    }
    run({ ctx: e }) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = (yield e.channel.getMessages()).filter(m => { var _a; return ((_a = m.author) === null || _a === void 0 ? void 0 : _a.id) === e.client.user.id || m.content.startsWith(e.guildDB.prefix); });
            e.channel.deleteMessages(messages.map(m => m.id));
            e.successMessage(`Deleted **${messages.length}** messages.`);
        });
    }
}
exports.default = Volume;
