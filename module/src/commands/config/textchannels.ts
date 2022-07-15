import { Command } from "../../abstract/QuickCommand";
export default class Volume extends Command {
    get name() {
        return "textchannels";
    }
    get description() {
        return "Restricts/Allows the bot to answer to commands, just do `textchannels #channel` to allow a channel and do the command again to remove this channel";
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
        return [{ name: "channel", description: "The voice channel you want to restrict the bot to. Provide `reset` to reset the channels.", required: true }];
    }
    async run({ ctx: e }) {
        if ("reset" === e.args[0]) return (e.guildDB.txts = []), e.client.database.handleCache(e.guildDB), e.successMessage("The bot is now allowed to answer commands in every single text channel!");
        const t = e.guild.channels.get(e.message.channelMentions[0]) || e.guild.channels.get(e.args[0]) || e.guild.channels.find((t) => 0 === t.type && t.name.toLowerCase().includes(e.args.join(" ")));
        if (!t || 0 !== t.type) return e.errorMessage("Please provide a valid text channel.");
        e.guildDB.txts.includes(`${t.id}`)
            ? ((e.guildDB.txts = e.guildDB.txts.filter((e) => e !== `${t.id}`)), e.client.database.handleCache(e.guildDB), e.successMessage(`Removed <#${t.id}> from the restricted text channels.`))
            : (e.guildDB.txts.push(`${t.id}`), e.client.database.handleCache(e.guildDB), e.successMessage(`Added <#${t.id}> to the restricted text channels.\nThe bot is now allowed to answer commands in this channel!`));
    }
}
