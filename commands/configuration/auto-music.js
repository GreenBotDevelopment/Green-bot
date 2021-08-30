const guildData = require('../../database/models/guildData');
const { Player, QueryType, QueueRepeatMode } = require("discord-player");

module.exports = {
    name: 'auto-music',
    description: 'Automatically plays a music in a voice channel when someone joins the channels',
    usages: ["auto-music #channel <song name>", "auto-music disable"],
    args: true,
    aliases: ['automusic'],
    exemple: '#channel Never gonna give you up',
    cat: 'configuration',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args, client) {
        const lang = await message.translate("AUTOPLAY")
        if (args[0].toLowerCase() === 'disable') {
            if (message.guild.settings.autoplay) {
                message.guild.settings.autoplay = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autoplay: null } }, { new: true });
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
            }
        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== 'GUILD_VOICE' || channel.guild.id !== message.guild.id) {
            let errorChannel = await message.translate("ERROR_CHANNEL_VOICE")
            return message.errorMessage(errorChannel)
        }
        if (!channel.permissionsFor(message.guild.me).has('SPEAK') || !channel.permissionsFor(message.guild.me).has('CONNECT') || !channel.viewable) {
            let a = await message.translate("CHANNEL_PERMS")
            return message.errorMessage(a)
        }
        if (channel.id === message.guild.settings.autoplay) {
            return message.errorMessage(lang.already)
        }
        if (!args[1]) {
            return message.errorMessage(lang.args)
        }
        const searchResult = await client.player
            .search(args.slice(1).join(" "), {
                requestedBy: message.author,
                searchEngine: QueryType.AUTO
            })
            .catch(() => {});
        if (!searchResult || !searchResult.tracks.length) {
            let errorM = await message.translate("NO_RESULTS")
            return message.errorMessage(errorM.replace("{query}", name));
        }
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autoplay: channel.id, song: args.slice(1).join(" ") } }, { new: true });
        message.guild.settings.autoplay = channel.id
        message.guild.settings.autoplay = args.slice(1).join(" ")
        return message.succesMessage(lang.succes.replace("{channel}", channel))

    },
};