"use strict";
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
    async run({ ctx: e }) {
        const messages = (await e.channel.getMessages()).filter(m => m.author?.id === e.client.user.id || m.content.startsWith(e.guildDB.prefix));
        e.channel.deleteMessages(messages.map(m => m.id));
        e.successMessage(`Deleted **${messages.length}** messages.`);
    }
}
exports.default = Volume;
