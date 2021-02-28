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
            return message.channel.send(`${emoji.error} Veuillez fournir un ID de message valide...`)
        }
        try {
            let toend = message.client.manager.giveaways.find(g => g.messageID === messageID)
            if (toend) {
                message.client.manager.end(messageID, {
                    setEndTimestamp: Date.now()
                });
                return message.channel.send(`${emoji.succes} J'ai bien mit fin à ce giveaway`)
            }
        } catch (e) {
            return message.channel.send(`${emoji.error} Veuillez fournir un ID de message valide...`)

        }


    },
};
