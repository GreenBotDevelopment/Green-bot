const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'interchat-server',
    description: 'Défini le salon de l\'interchat',
    aliases: ['setinterchat-server'],
    cat: 'inter',
    args: true,
    guildOnly: true,
    usage: '<id du serveur>',
    exemple: '784773050956513290',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        const server = message.client.guilds.cache.get(args[0]) || message.client.guilds.cache.find(g => g.name === args);
        if (!server) {

            return message.server.send(`${emoji.error} L'ID de serveur fourni n'est pas valide.... `);


        }

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `interchat-s` })
        if (verify) {
            const newserver = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `interchat-s` }, { $set: { serverID: server.id, reason: `interchat-s` } }, { new: true });


        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                serverID: `${server.id}`,
                reason: 'interchat-se',
            }).save();

        }




    },
};