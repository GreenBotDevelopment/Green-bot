const guildData = require('../../database/models/guildData');
module.exports = {
    name: 'botautonick',
    description: 'Défini le suron donné automatiquement aux nouveaux bots',
    usage: '<nickname>/disable',
    usages: ["botautonick <nickname>", "botautonick disable"],

    args: true,
    aliases: ['surnombotauto'],
    exemple: 'Bot - {username}',
    cat: 'configuration',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const lang = await message.translate("BOTAUTONICK")
        if (args[0].toLowerCase() === 'disable') {
            if (message.guild.settings.autonick_bot) {
                message.guild.settings.autonick_bot = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autonick_bot: null } }, { new: true });
                return message.succesMessage(lang.disable)
            } else {
                let required = await message.translate("CONGIG_REQUIRED")
                return message.errorMessage(required)
            }
        }
        const nick = args.join(" ")
        if (nick.length > 32 || nick.length < 1) {
            let numberErr = await message.translate("MESSAGE_ERROR")
            return message.errorMessage(numberErr.replace("{amount}", "1").replace("{range}", "32"))
        }
        const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { autonick_bot: nick } }, { new: true });
        message.guild.settings.autonick_bot = nick
        return message.succesMessage(lang.ok);
    },
};