import { Command } from "../../abstract/QuickCommand";

export default class Volume extends Command {
    get name() {
        return "djmove";
    }
    get description() {
        return "Enables or disables the dj mode for everyone";
    }
    get aliases() {
        return ["dj_modesong", "dj_mode", "toggle-np"];
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    async run({ ctx: n }) {
        return n.guildDB.dj_mode
            ? ((n.guildDB.dj_mode = null), n.client.database.handleCache(n.guildDB), n.dispatcher && (n.dispatcher.metadata.guildDB.dj_mode = null), n.successMessage("I will now hide the messages announcing a new song."))
            : ((n.guildDB.dj_mode = true), n.client.database.handleCache(n.guildDB), n.dispatcher && (n.dispatcher.metadata.guildDB.dj_mode = true), n.successMessage("I will now show the messages announcing a new song."));
    }
}

