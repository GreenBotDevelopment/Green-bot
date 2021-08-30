const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
module.exports = {
    name: 'set-logs',
    description: 'Défini le salon des logs',
    aliases: ['logs', 'logs-channel', "setlogs"],
    cat: 'configuration',
    args: 'channel',
    guildOnly: true,
    usage: '#channel/disable',
    exemple: '#logs',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("SET_LOGS")
        if (args[0] === 'disable') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `logs` })
            if (verify) {
                const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `logs` });
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

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `logs` })
        if (verify) {
            const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `logs` }, { $set: { channelID: channel.id, reason: `logs` } }, { new: true });
            return message.succesMessage(lang.succes.replace("{channel}", channel.name))

        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'logs',
            }).save();
            return message.succesMessage(lang.succes.replace("{channel}", channel.name))

        }
    },
};