import { Command } from "../../abstract/QuickCommand";
export default class Volume extends Command {
    get name() {
        return "defaultvolume";
    }
    get description() {
        return "Sets the default volume for the bot";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get arguments() {
        return [{ name: "volume", description: "The new default volume", required: true }];
    }
    static inRange(e, t, r) {
        return (e - t) * (e - r) <= 0;
    }
    async run({ ctx: e }) {
        const t = e.args[0];
        if (isNaN(t) || !Volume.inRange(t, 1, 200)) return e.errorMessage("The volume you provided is incorrect. It must be a number beetwen **1** and **200**");
        (e.guildDB.defaultVolume = parseInt(t)), e.client.database.handleCache(e.guildDB), e.successMessage("The default volume has been set to **" + t + "**.");
    }
}
