const Discord = require('discord.js');
const ms = require('ms');
module.exports = {
    name: 'greroll',
    description: 'Reroll un giveaway .',
    aliases: ['reroll-giveaway', 'giveaway-reroll', 'g-reroll'],
    guildOnly: true,
    args: true,
    usage: '<id>',
    exemple: '447357094895550474',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const lang = await message.translate("GIVEAWAY_REROLL")
        const messageID = args[0]
        try {
            message.client.manager.reroll(messageID, {
                congrat: '🎉 Les nouveaux gagnants sonts : {winners} ! Vous gagnez **{prize}** !\n{messageURL}',
                error: `${lang.b}`
            });
            return message.succesMessage(lang.ok)
        } catch (e) {
            console.log(e)
            return message.errorMessage(lang.error)


        }


    },
};