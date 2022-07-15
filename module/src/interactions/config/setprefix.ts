import { Command } from "../../abstract/QuickCommand";
export default class setPrefix extends Command {
    get name() {
        return "setprefix";
    }
    get description() {
        return "Sets the prefix for the bot";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["prefix"];
    }
    get arguments() {
        return [{ type: 3, name: "prefix", description: "The new prefix you want to set", required: true }];
    }
    async run({ ctx: e }) {
        let r = e.args[0].value;
        return (
            ("default" !== r && "reset" !== r) || (r = "*"),
            r.length > 4 || r.length < 0
                ? e.errorMessage("The prefix must be between **1** and **4** characters long")
                : r.startsWith("<") && r.endsWith(">")
                ? e.errorMessage("Hooks such as `[]` or `<>` must not be used when executing commands. Ex: `" + e.guildDB.prefix + "setprefix !`")
                : r === e.guildDB.prefix
                ? e.errorMessage("The prefix is already set to `" + r + "` in this server!")
                : ((e.guildDB.prefix = r), e.client.database.handleCache(e.guildDB), e.successMessage("The prefix has successfully updated to `" + r + "`! Example: `" + r + "play`\n\n🆕 Slash commands are here! Just type \"/\" to get started!!"))
        );
    }
}
