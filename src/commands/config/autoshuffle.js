const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {
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
        return ["MANAGE_GUILD"];
    }
    get category() {
        return "Admin Commands";
    }
    async run({ ctx: e }) {
        return e.guildDB.auto_shuffle ?
            ((e.guildDB.auto_shuffle = null), e.guildDB.save(), e.dispatcher && (e.dispatcher.metadata.guildDB.auto_shuffle = null), e.successMessage("The `Auto-Shuffle` plugin has been disabled.")) :
            ((e.guildDB.auto_shuffle = !0), e.guildDB.save(), e.dispatcher && (e.dispatcher.metadata.guildDB.auto_shuffle = !0), e.successMessage("The `Auto-Shuffle` plugin has been enabled!"));
    }
}
module.exports = Volume;