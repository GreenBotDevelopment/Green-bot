const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const guildData = require('../../database/models/guildData')
module.exports = {
    name: 'chatbot',
    description: 'Défini le salon du chatbot',
    aliases: ['chatbotchannel', 'setchatbot'],
    cat: 'configuration',
    args: 'channel',
    guildOnly: true,
    usage: '#channel/disable',
    usages: ["chatbot #channel", "chatbot disable"],

    exemple: '#chatbot',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("CHATBOT")
        if (args[0].toLowerCase() === 'disable') {
            if (message.guild.settings.chatbot) {
                message.guild.settings.chatbot = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { chatbot: null } }, { new: true });
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
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
        if (channel.id === message.guild.settings.chatbot) {
            return message.errorMessage(lang.already)
        }
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { chatbot: channel.id } }, { new: true });
        message.guild.settings.chatbot = channel.id
        return message.succesMessage(lang.succes.replace("{channel}", channel.name))
    },
};