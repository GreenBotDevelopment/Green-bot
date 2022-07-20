"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Volume extends QuickCommand_1.Command {
    get name() {
        return "autoshuffle";
    }
    get description() {
        return "Toggles the Auto-Shuffle plugin. If enabled, it will automatically shuffle every single playlist";
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
        return e.guildDB.auto_shuffle
            ? ((e.guildDB.auto_shuffle = null), e.guildDB.save(), e.dispatcher && (e.dispatcher.metadata.guildDB.auto_shuffle = null), e.successMessage("The `Auto-Shuffle` plugin has been disabled."))
            : ((e.guildDB.auto_shuffle = true), e.guildDB.save(), e.dispatcher && (e.dispatcher.metadata.guildDB.auto_shuffle = true), e.successMessage("The `Auto-Shuffle` plugin has been enabled!"));
    }
}
exports.default = Volume;
