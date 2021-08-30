const Discord = require('discord.js');
const ms = require('ms');
module.exports = {
    name: 'gend',
    description: 'Ends a giveaway.',
    aliases: ['end-giveaway', 'giveaway-end', 'g-end'],
    guildOnly: true,
    args: true,
    usage: '<id>',
    exemple: '447357094895550474',
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const messageID = args[0];
        const lang = await message.translate("GIVEAWAY_END")
        message.client.manager.end(messageID).then(() => {
            return message.succesMessage(lang.succes)
        }).catch((err) => {
            console.log(err)
            if (err === "Giveaway with message Id " + messageID + " is already ended") {
                return message.errorMessage(lang.end)
            } else if (err.startsWith('No giveaway found with ID')) {
                return message.errorMessage(lang.error)
            } else {
                return message.errorMessage(lang.error)
            }
        });

    },
};