import {Command } from "../../abstract/QuickCommand"
export default class setVc extends Command {
    get name() {
        return "setvc";
    }
    get description() {
        return "Restricts/Allows the bot to join a voice channel.";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["voice"];
    }
    get arguments() {
        return [{ name: "channel", description: "The voice channel you want to restrict the bot to", type: 7, required: true }];
    }
    async run({ ctx: e }) {
        if ("reset" === e.args[0].value) return (e.guildDB.vcs = []), e.client.database.handleCache(e.guildDB), e.successMessage("The bot is now allowed to join every single voice channel!");
        const n = e.guild.channels.get(e.args[0].value)
        if (!n || (2 !== n.type && "GUILD_STAGE_VOICE" !== n.type))
            return e.errorMessage("Please provide a valid voice channel Id. You can check [this guide](https://www.remote.tools/remote-work/how-to-find-discord-id) to learn how to do it.");
        e.guildDB.vcs.includes(`${n.id}`)
            ? ((e.guildDB.vcs = e.guildDB.vcs.filter((e) => e !== `${n.id}`)), e.client.database.handleCache(e.guildDB), e.successMessage(`Removed <#${n.id}> from the restricted voice channels.`))
            : (e.guildDB.vcs.push(`${n.id}`), e.client.database.handleCache(e.guildDB), e.successMessage(`Added <#${n.id}> to the restricted voice channels.`));
    }
}

