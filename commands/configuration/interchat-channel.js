const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'interchat-channel',
    description: 'Défini le salon de l\'interchat',
    aliases: ['setinterchat-channel'],
    cat: 'configuration',
    args: 'channel',
    guildOnly: true,
    usage: '#salon',
    exemple: '#inter-serveur',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'disable') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `interchat` })
            if (verify) {
                const newchannel = await Welcome.findOneAndDelete({ serverID: message.guild.id, reason: `interchat` });

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Salon de l\' interchat`')
                    .setDescription(`LeSalon de l\' interchat a été désactivé avec succès. ${emoji.succes}`)
                    .addField('Salon', `<#${verify.channelID}> ➔ Aucun`)
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

        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `interchat` })
        if (verify) {
            const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `interchat` }, { $set: { channelID: channel.id, reason: `interchat` } }, { new: true });

            const embed = new Discord.MessageEmbed()

            .setTitle('Paramètres : `Salon des interchat`')
                .setDescription(`LeSalon de l\' interchat a été mis à jour avec succès. ${emoji.succes}`)
                .addField('Salon', `<#${verify.channelID}> ➔ ${channel}`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.client.footer)

            .setColor("#2f3136");

            return message.channel.send(embed)
        } else {
            const verynew = new Welcome({
                serverID: `${message.guild.id}`,
                channelID: `${channel.id}`,
                reason: 'interchat',
            }).save();
            const embed = new Discord.MessageEmbed()

            .setTitle('Paramètres : `Salon des interchat`')
                .setDescription(`LeSalon de l\' interchat a été défini à jour avec succès. ${emoji.succes}`)
                .addField('Salon', `${channel}`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.client.footer)

            .setColor("#2f3136");

            message.channel.send(embed)
        }
    },
};
