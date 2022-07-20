"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const QuickCommand_1 = require("../../abstract/QuickCommand");
class Settings extends QuickCommand_1.Command {
    get name() {
        return "settings";
    }
    get permission() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["config", "setup"];
    }
    get description() {
        return "View the current settings of the server";
    }
    get arguments() {
        return [{ type: 3, name: "reset", description: "If you want to reset all settings.", required: true }];
    }
    get category() {
        return "Admin Commands";
    }
    async run({ ctx: e }) {
        if (e.args[0])
            return ((e.guildDB.prefix = "*"),
                (e.guildDB.announce = true),
                (e.guildDB.vcs = []),
                (e.guildDB.defaultVolume = 60),
                (e.guildDB.auto_autoplay = null),
                (e.guildDB.vote_skip = true),
                (e.guildDB.txts = []),
                (e.guildDB.djroles = []),
                (e.guildDB.djroles = null),
                (e.guildDB.h24 = null),
                (e.guildDB.auto_shuffle = false),
                e.client.database.handleCache(e.guildDB),
                e.successMessage("All settings of the bot have been reset!"));
        e.client.database.checkPremium(e.guild.id).then((n) => {
            e.reply({
                embeds: [
                    {
                        color: 0x3a871f,
                        author: { name: `${e.guild.name}`, icon_url: e.guild.icon ? e.guild.iconURL : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128" },
                        description: `> Prefix: \`${e.guildDB.prefix}\`\n> [Green-bot Premium](https://green-bot.app/premium): ${n.guildId ? `✨ Active | <@${n.userId}>` : "Not active "}\n\nAnnoucing new songs: ${e.guildDB.announce ? "`Enabled`" : "`Disabled`"}\nDefault volume: \`${e.guildDB.defaultVolume}\`\nDj role(s): ${e.guildDB.djroles ? `${e.guildDB.djroles.length ? e.guildDB.djroles.map((e) => `<@&${e}>`).join(", ") : `<@&${e.guildDB.djroles}>`}>` : "`Not set`"}\n24/7: ${e.guildDB.h24 ? "`Enabled`" : "`Disabled`"}\nVoice channel(s): ${e.guildDB.vcs.length > 0 ? `${e.guildDB.vcs.map((e) => `<#${e}>`)}` : "`Not set`"}\nAllowed text channel(s): ${e.guildDB.txts.length > 0 ? `${e.guildDB.txts.map((e) => `<#${e}>`)}` : "`Not set`"}\nVote skip enabled: ${e.guildDB.vote_skip ? "`Enabled`" : "`Disabled`"}\nAuto shuffle Playlist: ${e.guildDB.auto_shuffle ? "`Enabled`" : "`Disabled`"}\nAuto-Autoplay: ${e.guildDB.auto_autoplay ? "`Enabled`" : "`Disabled`"}\nDj command(s): ${e.guildDB.dj_commands.length > 0 ? `${e.guildDB.dj_commands.map((e) => `\`${e}\``).join(", ")}` : "`Not set`"}`,
                    },
                ],
            });
        });
    }
}
exports.default = Settings;
