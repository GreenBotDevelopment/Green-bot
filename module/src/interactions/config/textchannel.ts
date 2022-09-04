import { Command } from "../../abstract/QuickCommand";
export default class textChannel extends Command {
    get name() {
        return "textchannel";
    }
    get description() {
        return "Sets the default track announcment channel";
    }
    get category() {
        return "Admin Commands";
    }
    get permissions() {
        return ["manageGuild"];
    }
    get aliases() {
        return ["text"];
    }
    get checks() {
        return { premium: true };
    }
    get arguments() {
        return [{ name: "channel", description: "The channel you want to set as default track announcement channel", type: 7, required: true }];
    }
    async run({ ctx: e }) {
        if ("disable" === e.args[0].value.toLowerCase() || "reset" === e.args[0].value)
            return null === e.guildDB.textchannel
                ? e.errorMessage("The default track announcement channel is not already set.")
                : ((e.guildDB.textchannel = null),
                  e.dispatcher && (e.dispatcher.metadata.textchannel = null),
                  e.client.database.handleCache(e.guildDB),
                  e.successMessage("The default track announcement channel has been successfully disabled on this server!"));
        const n = e.args[0].value;
        return n 
            ? e.guildDB.textchannel && e.guildDB.textchannel === n
                ? e.errorMessage("The default text channel is already this channel!")
                : ((e.guildDB.textchannel = n),
                  e.dispatcher && (e.dispatcher.metadata.textchannel = n),
                  e.client.database.handleCache(e.guildDB),
                  e.successMessage(`The new track announcement channel is now <#${n}> ! \nI will send every single track announcement message in this channel!`))
            : e.errorMessage("Please provide a valid text channel or a valid channel ID.");
    }
}
