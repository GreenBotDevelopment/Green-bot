"use strict";
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
    async run({ ctx: e }) {
        return e.guildDB.buttons
            ? ((e.guildDB.buttons = null), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.buttons = null), e.successMessage("I will no longer show buttons on now playing messages!."))
            : ((e.guildDB.buttons = true), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.buttons = true), e.successMessage("I will now show buttons on now playing messages!"));
    }
}
exports.default = Buttons;
