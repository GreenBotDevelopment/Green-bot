import { Command } from "../../abstract/QuickCommand";

export default class Volume extends Command {
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
            ? ((n.guildDB.announce = null), n.client.database.handleCache(n.guildDB), n.dispatcher && (n.dispatcher.metadata.guildDB.announce = null), n.successMessage("I will now hide the messages announcing a new song."))
            : ((n.guildDB.announce = true), n.client.database.handleCache(n.guildDB), n.dispatcher && (n.dispatcher.metadata.guildDB.announce = true), n.successMessage("I will now show the messages announcing a new song."));
    }
}

