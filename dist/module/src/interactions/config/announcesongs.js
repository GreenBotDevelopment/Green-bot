"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Announcesongs extends QuickCommand_1.Command {
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
    async run({ ctx: n }) {
        return n.guildDB.announce
            ? ((n.guildDB.announce = null), n.guildDB.save(), n.dispatcher && (n.dispatcher.metadata.guildDB.announce = null), n.successMessage("I will now hide the messages announcing a new song."))
            : ((n.guildDB.announce = true), n.guildDB.save(), n.dispatcher && (n.dispatcher.metadata.guildDB.announce = true), n.successMessage("I will now show the messages announcing a new song."));
    }
}
exports.default = Announcesongs;
