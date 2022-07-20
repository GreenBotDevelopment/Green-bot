"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class textChannels extends QuickCommand_1.Command {
    get name() {
        return "textchannels";
    }
    get description() {
        return "Restricts/Allows the bot to answer to commands";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["setchannel", "settc", "channels"];
    }
    get arguments() {
        return [{ name: "channel", description: "The voice channel you want to restrict the bot to.", type: 7, required: true }];
    }
    async run({ ctx: e }) {
        if ("reset" === e.args[0].value)
            return (e.guildDB.txts = []), e.client.database.handleCache(e.guildDB), e.successMessage("The bot is now allowed to answer commands in every single text channel!");
        const t = e.guild.channels.get(e.args[0].value);
        if (!t || 0 !== t.type)
            return e.errorMessage("Please provide a valid text channel.");
        e.guildDB.txts.includes(`${t.id}`)
            ? ((e.guildDB.txts = e.guildDB.txts.filter((e) => e !== `${t.id}`)), e.client.database.handleCache(e.guildDB), e.successMessage(`Removed <#${t.id}> from the restricted text channels.`))
            : (e.guildDB.txts.push(`${t.id}`), e.client.database.handleCache(e.guildDB), e.successMessage(`Added <#${t.id}> to the restricted text channels.\nThe bot won't reply to command anymore in this channel!`));
    }
}
exports.default = textChannels;
