const BaseCommand = require("../../abstract/BaseCommand.js"),
    userData = require("../../models/user");
class Queue extends BaseCommand {get name() { return "pl-create" }
    get description() { return "Creates a playlist" }get aliases() { return ["pl", "playlist"] }
    get category() { return "Everyone Commands" }get playerCheck() { return { vote: true } }
    get arguments() { return [{ name: "playlist_name", description: "The name of the playlist you want to create", required: !0 }] }
    async run({ ctx: e }) { const a = e.args[0]; if (a.length < 3 || a.length > 50) return e.errorMessage("The playlist name must be beetween 2 and 50 long."); const s = await e.client.mongoDB.getUser(e.author.id); return s && s.playlists.find(e => e.name === a) || "all" === a ? e.errorMessage("You already have a playlist with this name or you can't use this name.") : s && s.playlists.length >= 10 ? e.errorMessage("You have reached the maximun playlist limit!\n Consider upgrading to [Premium](https://green-bot.app/premium) to create more playlists!") : void setTimeout(async() => (s ? (s.playlists.push({ name: a, tracks: [] }), s.save()) : new userData({ userID: e.author.id, playlists: [{ name: a, tracks: t }] }).save(), e.successMessage(`Created a playlist with the name **${a}** ${`\n__How it works?__\n\n• You can add tracks to this playlist using the \`${e.guildDB.prefix}pl-add\` command!\n• You can play your playlist using the \`${e.guildDB.prefix}pl-play ${a}\` command.`}`)),500)}}module.exports=Queue;