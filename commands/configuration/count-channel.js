const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const guildData = require('../../database/models/guildData');

module.exports = {
    name: 'count-channel',
    description: 'Défini le salon du compteur',
    aliases: ['countchannel', 'setcount', 'count'],
    cat: 'configuration',
    args: 'channel',
    guildOnly: true,
    usage: '#channel/view/disable',
    usages: ["count-channel #channel", "count-channel view", "count-channel disable"],
    exemple: '#count',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("SET_COUNT")
        if (args[0].toLowerCase() === 'disable') {
            if (message.guild.settings.count) {
                message.guild.settings.count = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { count: null } }, { new: true });
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
            }
        }
        if (args[0].toLowerCase() === 'view') {
            if (message.guild.settings.count) {
                const old = await Welcome.findOne({ serverID: message.guild.id, reason: `old_number` })
                return message.succesMessage(lang.ok.replace("{last}", old.channelID).replace("{channel}", message.guild.settings.count))
            } else {
                return message.errorMessage(lang.not.replace("{prefix}", message.guild.settings.prefix))
            }
        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type !== 'GUILD_TEXT' || channel.guild.id !== message.guild.id) {
            let errorChannel = await message.translate("ERROR_CHANNEL")
            return message.errorMessage(errorChannel)

        }
        if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES') || !channel.permissionsFor(message.guild.me).has('EMBED_LINKS') || !channel.viewable) {
            let a = await message.translate("CHANNEL_PERMS")
            return message.errorMessage(a)
        }
        if (channel.id === message.guild.settings.count) {
            return message.errorMessage(lang.already)
        }
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { count: channel.id } }, { new: true });
        message.guild.settings.count = channel.id
        channel.send(lang.warn)
        return message.succesMessage(lang.succes.replace("{channel}", channel.name))

    },
};