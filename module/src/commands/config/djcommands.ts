import { Command } from "../../abstract/QuickCommand";
export default class Volume extends Command {
    get name() {
        return "djcommands";
    }
    get description() {
        return "Sets wich commands are for DJs only";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["djcmd", "djcommand", "djscommands"];
    }
    get arguments() {
        return [{ name: "command_name", description: "The command you want to toggle. If this command is not in the list, it will be added, else it will be removed!", required: true }];
    }
    async run({ ctx: e }) {
        if ("reset" === e.args[0])
            return (
                (e.guildDB.dj_commands = [
                    "autoplay",
                    "back",
                    "clearqueue",
                    "forceskip",
                    "forward",
                    "givedj",
                    "jump",
                    "leavecleanup",
                    "loop",
                    "move",
                    "pause",
                    "resume",
                    "remove",
                    "removedupes",
                    "replay",
                    "rewind",
                    "seek",
                    "shuffle",
                    "stop",
                    "volume",
                ]),
                e.client.database.handleCache(e.guildDB),
                e.successMessage("The DJ commands have been reseted!")
            );
        const s = e.client.commands.getCommand(e.args[0]);
        if (!s) return e.errorMessage("Please provide a valid command name. You can get the command list with the help command.");
        e.guildDB.dj_commands.includes(`${s.name}`)
            ? ((e.guildDB.dj_commands = e.guildDB.dj_commands.filter((e) => e !== `${s.name}`)), e.client.database.handleCache(e.guildDB), e.successMessage(`The \`${s.name}\` command is no longer a DJ command!`))
            : (e.guildDB.dj_commands.push(`${s.name}`),
              e.client.database.handleCache(e.guildDB),
              e.successMessage(`Added the \`${s.name}\` command to the DJ commands.\nNow users need to have the Dj role to use this command (If the dj role is set)`));
    }
}
