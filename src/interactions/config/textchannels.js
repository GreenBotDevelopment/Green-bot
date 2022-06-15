const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {
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
        return ["MANAGE_GUILD"];
    }
    get aliases() {
        return ["setchannel", "settc", "channels"];
    }
    get arguments() {
        return [{ name: "channel", description: "The voice channel you want to restrict the bot to.", type: 7, required: !0 }];
    }
    async run({ ctx: e }) {
        if ("reset" === e.args[0].value) return (e.guildDB.txts = []), e.client.mongoDB.handleCache(e.guildDB), e.successMessage("The bot is now allowed to answer commands in every single text channel!");
        const t = e.interaction.options.getChannel("channel")
        if (!t || "GUILD_TEXT" !== t.type) return e.errorMessage("Please provide a valid text channel.");
        e.guildDB.txts.includes(`${t.id}`) ?
            ((e.guildDB.txts = e.guildDB.txts.filter((e) => e !== `${t.id}`)), e.client.mongoDB.handleCache(e.guildDB), e.successMessage(`Removed <#${t.id}> from the restricted text channels.`)) :
            (e.guildDB.txts.push(`${t.id}`), e.client.mongoDB.handleCache(e.guildDB), e.successMessage(`Added <#${t.id}> to the restricted text channels.\nThe bot won't reply to command anymore in this channel!`));
    }
}
module.exports = Volume;