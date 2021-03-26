const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'interchat-end',
    description: 'Arrete le système d\'interchat',
    aliases: ['endinterchat'],
    cat: 'configuration',
    guildOnly: true,
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `interchat-s` })
        if (verify) {
            const newserver = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `interchat-s` });
            const newserveer = await Welcome.findOneAndDelete({ channelID: message.guild.id, reason: `interchat-s` });

            return message.channel.send(`${emoji.succes} j'ai mis fin à l'interchat avec succès.`);

        } else {

            return message.channel.send(`${emoji.error} Vous devez avoir une configuration pour la supprimer..`);
        }
    },
};
