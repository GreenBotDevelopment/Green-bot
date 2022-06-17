const BaseCommand = require("../../abstract/BaseCommand.js"),
    userData = require("../../models/user");
class Queue extends BaseCommand {get name() { return "pl-list" }
    get description() { return "Shows all your playlists!" }get aliases() { return ["pllist", "playlists", "list-pl"] }
    get category() { return "Everyone Commands" }
    async run({ ctx: e }) { const t = await userData.findOne({ userID: e.author.id }); if (!t || 0 == t.playlists.length) return e.errorMessage("You don't have any playlist yet!");
        e.reply({ embeds: [{ description: "You can create a playlist with the `" + e.guildDB.prefix + "pl-create` command.", author: { name: "Your playlists", icon_url: e.author.displayAvatarURL({ size: 512, format: "png" }) }, fields: [{ name: "• List (" + t.playlists.length + " / 10)", value: t.playlists.map(e => `[${e.name}](https://green-bot.app), ${e.tracks.length} tracks.`).join("\n") }], color: "#3A871F" }], components: [{ components: [{ customId: "edit_pl", label: "Edit a playlist", style: 3, type: "BUTTON" }], type: "ACTION_ROW" }] }) } }
module.exports = Queue;