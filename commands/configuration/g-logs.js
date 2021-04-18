const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'g-logs',
    description: 'Défini le salon des logs des giveaways',
    aliases: ['giveaway-logs', 'giveawayslogs', 'giveawaylog', 'log-giveaway'],
    cat: 'gway',
    args: 'channel',
    guildOnly: true,
    usage: '#salon',
    exemple: '#logs_giveaways',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'disable') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `giveaway_c` })
            if (verify) {
                const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `giveaway_c` });


                return message.succesMessage(`Le salon des logs des giveaways a bien été désactivé !`)
            } else {
                return message.errorMessage(`Vous devez avoir une configuration pour la supprimer`)
            }

        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type != 'text' || !channel.viewable) {
            return message.errorMessage(`Le salon fourni n'est pas un salon valide , il n'est pas visible pas le bot ou pas du bon type... `);
        }

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `giveaway_c` })
        if (verify) {
            const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `giveaway_c` }, { $set: { channelID: channel.id, reason: `giveaway_c` } }, { new: true });

            return message.succesMessage(`Le salon des logs des giveaways a bien été mis à jour : \`#${channel.name}\` !`)

        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'giveaway_c',
            }).save();
            return message.succesMessage(`Le salon des logs des giveaways a bien été défni : \`#${channel.name}\` !`)

        }




    },
};