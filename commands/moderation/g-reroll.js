const Discord = require('discord.js');
const emoji = require('../../emojis.json')
const ms = require('ms');
module.exports = {
    name: 'g-reroll',
    description: 'Reroll un giveaway .',
    aliases: ['reroll-giveaway', 'giveaway-reroll'],
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
            return message.channel.send(`${emoji.error} Veuillez fournir un ID de message valide...`)
        }
        try {

            let toend = message.client.manager.giveaways.find(g => g.messageID === messageID)
            if (toend) {
                message.client.manager.reroll(messageID, {
                    congrat: '🎉 Les nouveaux gagnants sonts : {winners} ! Vous gagnez **{prize}**!',
                    error: `${emoji.error} Je n'ai pas pu reroll ce giveaway.`
                });
                return message.channel.send(`${emoji.succes} Le giveaway a été relancé avec succès !`)
            }
        } catch (e) {
            return message.channel.send(`${emoji.error} Veuillez fournir un ID de message valide...`)

        }


    },
};
