const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'auto-publish',
    description: 'Défini le salon ou les messages seront automatiquent postés',
    aliases: ['autopost', 'autopublish', 'crosspost'],
    cat: 'configuration',
    args: 'channel',
    guildOnly: true,
    usage: '#channel/disable',
    usages: ["auto-publish #channel", "auto-publish disable"],

    exemple: '#announcments',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("SET_POST")
        if (args[0].toLowerCase() === 'disable') {
            if (message.guild.settings.autopost) {
                message.guild.settings.autopost = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autopost: null } }, { new: true });
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
            }
        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== 'GUILD_NEWS' || channel.guild.id !== message.guild.id) {
            let errorChannel = await message.translate("ERROR_CHANNEL_NEWS")
            return message.errorMessage(errorChannel)
        }
        if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') || !channel.viewable) {
            let a = await message.translate("CHANNEL_PERMS")
            return message.errorMessage(a)
        }
        if (channel.id === message.guild.settings.autopost) {
            return message.errorMessage(lang.already)
        }
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autopost: channel.id } }, { new: true });
        message.guild.settings.autopost = channel.id
        return message.succesMessage(lang.succes.replace("{channel}", channel.name))
    },
};