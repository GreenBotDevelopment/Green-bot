import { Command } from "../../abstract/QuickCommand"; export default class Volume extends Command {
    get name() {
        return "clean";
    }
    get category() {
        return "Admin Commands";
    }
    get description() {
        return "Delete all the bot messages in the channel.";
    }
    get permissions() {
        return ["manageGuild"];
    }
    async run({ ctx: e }) {
        const messages = (await e.channel.getMessages()).filter(m=>m.author?.id === e.client.user.id)
        e.channel.deleteMessages(messages.map(m=>m.id))
        e.successMessage(`Deleted **${messages.length}** messages.`);

    }
}
