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
    cat: 'moderation',
    permissions: ['MANAGE_GUILD'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", ],
    async execute(message, args, client) {
        const messageID = args[1];
        if(!messageID){
            return message.channel.send(`${emoji.error} Veuillez fournir un ID de message valide...`)
        }
        try {
           message.client.manager.edit(messageID, {
                setEndTimestamp: Date.now()
            });
            return message.channel.send(`${emoji.succes} J'ai bien mit fin à ce giveaway`)
        } catch(e){
            return message.channel.send(`${emoji.error} Veuillez fournir un ID de message valide...`)

        }


    },
};
