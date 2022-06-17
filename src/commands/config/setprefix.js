const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "setprefix" }
    get description() { return "Sets the prefix for the bot. This is the character to execute commands. Default prefix is *" }get category() { return "Admin Commands" }
    get permissions() { return ["MANAGE_GUILD"] }get aliases() { return ["prefix"] }
    get arguments() { return [{ name: "prefix", description: "The new prefix you want to set", required: !0 }] }
    async run({ ctx: e }) { let r = e.args[0]; return "default" !== r && "reset" !== r || (r = "*"), r.length > 4 || r.length < 0 ? e.errorMessage("The prefix must be between **1** and **4** characters long") : r.startsWith("<") && r.endsWith(">") ? e.errorMessage("Hooks such as `[]` or `<>` must not be used when executing commands. Ex: `" + e.guildDB.prefix + "setprefix !`") : r === e.guildDB.prefix ? e.errorMessage("The prefix is already set to `" + r + "` in this server!") : (e.guildDB.prefix = r, e.client.mongoDB.handleCache(e.guildDB), e.successMessage("The prefix has successfuly updated to `" + r + "`! Example: `" + r + "play`")) } }
module.exports = Volume;