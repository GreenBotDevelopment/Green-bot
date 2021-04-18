const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
module.exports = {
    name: 'g-end',
    description: 'Termine un giveaway .',
    aliases: ['end-giveaway', 'giveaway-end'],
    guildOnly: true,
    args: true,
    usage: '<id>',
    exemple: '447357094895550474',
    cat: 'gway',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const messageID = args[0];
        if (!messageID) {
            return message.errorMessage(`Vous devez fournir L'ID du message du giveaway.`)
        }
        try {
            let toend = message.client.manager.giveaways.find(g => g.messageID === messageID)
            if (toend) {
                message.client.manager.edit(messageID, {
                    setEndTimestamp: Date.now()
                });
                return message.succesMessage(`J'ai bien mit fin à ce giveaway . Vous pouvez aller voir dans <#${toend.channelID}>`)
            } else {
                return message.errorMessage(`Je n'ai trouvé aucun giveaway avec cet ID`)

            }
        } catch (err) {

            if (err.endsWith('is already ended.')) {
                message.errorMessage(`Ce giveaway a déja été terminé.`);
            } else if (err.startsWith('No giveaway found with ID')) {
                return message.errorMessage(`Je n'ai trouvé aucun giveaway avec cet ID`)
            } else {
                return message.errorMessage(` Un erreur est survenue lors de la fin du giveaway.`)

            }

        }


    },
};