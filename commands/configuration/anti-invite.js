const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'anti-pub',
    description: 'Active ou désactive le système contre les invitations',
    cat: 'antiraid',
    args: true,
    usage: 'on/off',
    exemple: 'on',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("ANTI_PUB")
        if (args[0].toLowerCase() === 'off') {
            if (!message.guild.settings.protections.anti_pub) {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
            }
            message.guild.settings.protections.anti_pub = null
            const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { protections: { anti_pub: null, antiraid_logs: message.guild.settings.protections.antiraid_logs } } }, { new: true });
            return message.succesMessage(lang.desa)
        }
        if (args[0].toLowerCase() === 'on') {
            if (message.guild.settings.protections.anti_pub) {
                return message.errorMessage(lang.err)
            } else {
                message.guild.settings.protections.anti_pub = true
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { protections: { anti_pub: true, antiraid_logs: message.guild.settings.protections.antiraid_logs } } }, { new: true });
                return message.succesMessage(lang.ok)
            }
        } else {
            let required = await message.translate("ON/OFF")
            return message.errorMessage(required)
        }
    },
};