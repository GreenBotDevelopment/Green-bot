import { Command } from "../../abstract/QuickCommand";

export default class Volume extends Command {
    get name() {
        return "autoautoplay";
    }
    get description() {
        return "Toggles the auto autoplay feature. If enabled, it will automatically enable the autoplay for every single queue";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    async run({ ctx: e }) {
        return e.guildDB.auto_autoplay
            ? ((e.guildDB.auto_autoplay = null), e.client.database.handleCache(e.guildDB), e.successMessage("The `Auto-Autoplay` plugin has been disabled."))
            : ((e.guildDB.auto_autoplay = true), e.client.database.handleCache(e.guildDB), e.successMessage("The `Auto-Autoplay` plugin has been enabled!"));
    }
}

