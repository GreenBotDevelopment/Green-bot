const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'autonick',
    description: 'Défini le suron donné automatiquement aux nouveaux membres',
    usage: '<nickname>/disable',
    usages: ["autonick <nickname>", "autonick disable"],
    args: true,
    aliases: ['surnomauto'],
    exemple: 'User - {username}',
    cat: 'configuration',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("AUTONICK")
        if (args[0].toLowerCase() === 'disable') {
            if (message.guild.settings.autonick) {
                message.guild.settings.autonick = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autonick: null } }, { new: true });
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
            }
        }
        const nick = args.join(" ")
        if (nick.length > 32 || nick.length < 1) {
            let numberErr = await message.translate("MESSAGE_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "3").replace("{range}", "32"))
        }
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autonick: nick } }, { new: true });
        message.guild.settings.autonick = nick
        return message.succesMessage(lang.ok);
    },
};