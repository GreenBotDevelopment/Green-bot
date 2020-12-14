const Discord = require('discord.js');
const guild = require('../../database/models/guild')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'setsuggchannel',
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

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Salon des suggestions`')
                    .setDescription(`Le Salon des suggestions a été désactivé avec succès. ${emoji.succes}`)
                    .addField('Salon', `<#${verify.content}> ➔ Aucun`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)

                .setColor("#2f3136");

                return message.channel.send(embed)
            } else {
                return message.channel.send(`${emoji.error} Vous devez avoir une configuration pour la supprimer`)
            }

        }
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
        if (!channel || channel.type != 'text' || !channel.viewable) {
            return message.channel.send(`${emoji.error} Le salon fourni n'est pas un salon valide , il n'est pas visible pas le bot ou pas du bon type... `);
        }

        const verify = await guild.findOne({ serverID: message.guild.id, reason: `sugg` })
        if (verify) {
            const newchannel = await guild.findOneAndUpdate({ serverID: message.guild.id, reason: `sugg` }, { $set: { content: channel.id, reason: `sugg` } }, { new: true });

            const embed = new Discord.MessageEmbed()

            .setTitle('Paramètres : `Salon des suggestionsestions`')
                .setDescription(`Le Salon des suggestions a été mis à jour avec succès. ${emoji.succes}`)
                .addField('Salon', `<#${verify.content}> ➔ ${channel}`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.client.footer)

            .setColor("#2f3136");

            return message.channel.send(embed)
        } else {
            const verynew = new guild({
                serverID: `${message.guild.id}`,
                content: `${channel.id}`,
                reason: 'sugg',
            }).save();
            const embed = new Discord.MessageEmbed()

            .setTitle('Paramètres : `Salon des suggestions`')
                .setDescription(`Le Salon des suggestions a été défini à jour avec succès. ${emoji.succes}`)
                .addField('Salon', `${channel}`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.client.footer)

            .setColor("#2f3136");

            message.channel.send(embed)
        }




    },
};