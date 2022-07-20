"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Volume extends QuickCommand_1.Command {
    get name() {
        return "setvc";
    }
    get description() {
        return "Restricts/Allows the bot to join a voice channel. To add a channel, just do `setvc #channel` to allow a channel and do the command again to remove this channel";
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
        return [{ name: "channel", description: "The voice channel you want to restrict the bot to. Provide `reset` to make the bot working in every single voice channel!", required: true }];
    }
    async run({ ctx: e }) {
        if ("reset" === e.args[0])
            return (e.guildDB.vcs = []), e.client.database.handleCache(e.guildDB), e.successMessage("The bot is now allowed to join every single voice channel!");
        const n = e.guild.channels.get(e.message.channelMentions[0]) || e.guild.channels.get(e.args[0]) || e.guild.channels.find((n) => 2 === n.type && n.name.toLowerCase().includes(e.args.join(" ")));
        if (!n || (2 !== n.type && 13 !== n.type))
            return e.errorMessage("Please provide a valid voice channel Id. You can check [this guide](https://www.remote.tools/remote-work/how-to-find-discord-id) to learn how to do it.");
        e.guildDB.vcs.includes(`${n.id}`)
            ? ((e.guildDB.vcs = e.guildDB.vcs.filter((e) => e !== `${n.id}`)), e.client.database.handleCache(e.guildDB), e.successMessage(`Removed <#${n.id}> from the restricted voice channels.`))
            : (e.guildDB.vcs.push(`${n.id}`), e.client.database.handleCache(e.guildDB), e.successMessage(`Added <#${n.id}> to the restricted voice channels.`));
    }
}
exports.default = Volume;
