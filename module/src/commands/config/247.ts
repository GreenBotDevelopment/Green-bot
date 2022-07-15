import { Command } from "../../abstract/QuickCommand";

export default class Volume extends Command {
    get name() {
        return "24/7";
    }
    get description() {
        return "This will enable/disable the 24h/7 mode. If enabled the bot will never leave your voice channel";
    }
    get aliases() {
        return ["247", "24-7", "24h7"];
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    async run({ ctx: e }) {
        return e.guildDB.h24
            ? ((e.guildDB.h24 = null), e.client.database.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.h24 = null), e.successMessage("🎧 24/7 mode: **Disabled**"))
            : ((e.guildDB.h24 = true), e.client.database.handleCache(e.guildDB), e.dispatcher && ((e.dispatcher.metadata.guildDB.h24 = true), (e.dispatcher.repeat = "queue")), e.successMessage("🎧 24/7 mode: **Enabled**"));
    }
}

