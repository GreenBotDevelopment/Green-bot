const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'starboard',
    description: 'Défini le salon du starboard',
    aliases: ['starboardchannel', 'setstarboard'],
    cat: 'configuration',
    args: 'channel',
    guildOnly: true,
    usage: '#salon',
    exemple: '#starboard',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'disable') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `starboard` })
            if (verify) {
                const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `starboard` });


                return message.succesMessage(`Le salon du starboard a bien été désactivé !`)
            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer`)
            }

        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type != 'text' || !channel.viewable) {
            return message.errorMessage(`Le salon fourni n'est pas un salon valide , il n'est pas visible pas le bot ou pas du bon type... `);
        }

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `starboard` })
        if (verify) {
            const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `starboard` }, { $set: { channelID: channel.id, reason: `starboard` } }, { new: true });

            return message.succesMessage(`Le salon du starboard a bien été mis à jour : \`#${channel.name}\` !`)

        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'starboard',
            }).save();
            return message.succesMessage(`Le salon du starboard a bien été défni : \`#${channel.name}\` !`)

        }




    },
};