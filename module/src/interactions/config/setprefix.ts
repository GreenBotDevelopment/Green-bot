import { Command } from "../../abstract/QuickCommand";
export default class Volume extends Command {
    get name() {
        return "setprefix";
    }
    get description() {
        return "Sets the prefix for the bot. This is the character to execute commands. Default prefix is *";
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
    async run({ ctx: e }) {
        return e.errorMessage("This command is not available anymore to encourage people to use slash command! All bots will stop answering to commands with a prefix like this one!")

    }
}
