const Discord = require('discord.js');
const guild = require('../../database/models/guild')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'sugg-channel',
    description: 'Défini le Salon des suggestionsestions',
    aliases: ['suggchannel'],
    cat: 'configuration',
    args: 'channel',
    guildOnly: true,
    usage: '#salon',
    exemple: '#suggestions',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'disable') {
            const verify = await guild.findOne({ serverID: message.guild.id, reason: `sugg` })
            if (verify) {
                const newchannel = await guild.findOneAndDelete({ serverID: message.guild.id, reason: `sugg` });

                return message.succesMessage(`Le salon des suggestions bien été supprimé`)

            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer`)
            }

        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type != 'text' || !channel.viewable) {
            return message.errorMessage(`Le salon fourni n'est pas un salon valide , il n'est pas visible pas le bot ou pas du bon type... `);
        }

        const verify = await guild.findOne({ serverID: message.guild.id, reason: `sugg` })
        if (verify) {
            const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `sugg` }, { $set: { content: channel.id, reason: `sugg` } }, { new: true });

            return message.succesMessage(`Le salon des suggestions a bien été mis à jour : \`#${channel.name}\` !`)

        } else {
            const verynew = new guild({
                serverID: `${message.guild.id}`,
                content: `${channel.id}`,
                reason: 'sugg',
            }).save();
            return message.succesMessage(`Le salon des suggestions a bien été défini : \`#${channel.name}\` !`)

        }




    },
};