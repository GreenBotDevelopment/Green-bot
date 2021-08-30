const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'antiraid-logs',
    description: 'Défini le salon des logs de l\'antiraid',
    cat: 'antiraid',
    args: true,
    guildOnly: true,
    usage: '#channel/disable',
    usages: ["antiraid-logs #channel", "antiraid-logs disable"],
    exemple: '#logs-antiraid',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("RAID_LOGS")
        if (args[0].toLowerCase() === 'disable') {
            if (message.guild.settings.protections.antiraid_logs) {
                message.guild.settings.protections.antiraid_logs = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { protections: { antiraid_logs: null, anti_pub: message.guild.settings.protections.anti_pub } } }, { new: true });
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
        if (channel.id === message.guild.settings.protections.antiraid_logs) {
            return message.errorMessage(lang.already)
        }
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { protections: { antiraid_logs: channel.id, anti_pub: message.guild.settings.protections.anti_pub } } }, { new: true });
        message.guild.settings.protections.antiraid_logs = channel.id
        return message.succesMessage(lang.succes.replace("{channel}", channel.name))
    },
};