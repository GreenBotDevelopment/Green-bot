const BaseCommand = require("../../abstract/BaseCommand.js");
class Volume extends BaseCommand {get name() { return "24/7" }
    get playerCheck() { return { vote: !0 } }get aliases() { return ["247"] }
    get description() { return "Enables/Disables The 24/7 mode. If enabled, the bot will never leave your voice channel" }get category() { return "Admin Commands" }
    get permissions() { return ["MANAGE_GUILD"] }
    async run({ ctx: e }) { return e.guildDB.h24 ? (e.guildDB.h24 = null, e.client.mongoDB.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.h24 = null), e.successMessage("🎧 24/7 mode: **Disabled**")) : (e.guildDB.h24 = !0, e.client.mongoDB.handleCache(e.guildDB), e.dispatcher && (e.dispatcher.metadata.guildDB.h24 = !0, e.dispatcher.repeat = "queue"), e.successMessage("🎧 24/7 mode: **Enabled**")) } }
module.exports = Volume;