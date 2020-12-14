const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/Welcome');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'leave',
    description: 'Active ou désactive le système de départs',
    aliases: ['leavesystem', 'setleave'],

    cat: 'configuration',
    args: true,
    usage: 'on/off',
    exemple: 'on',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'off') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `leave` })
            if (verify) {
                if (!verify.status) return message.channel.send(`${emoji.error} Le plugin de départs n'est déja activé dans ce serveur...`);
                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `leave` }, { $set: { status: null, reason: `leave` } }, { new: true });

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Plugin de départs`')
                    .setDescription(`le système de départs a été désactivé avec succès. ${emoji.succes}`)
                    .addField('Status', `activé ➔ désactivé`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)

                .setColor("#2f3136");

                return message.channel.send(embed)
            } else {
                return message.channel.send(`${emoji.error} Vous devez avoir une configuration pour la supprimer`)
            }

        } else if (args[0] === 'on') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `leave` })
            if (verify) {
                if (verify.status) return message.channel.send(`${emoji.error} Le système de départs est déja activé dans ce serveur...`);
                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `leave` }, { $set: { status: true, reason: `leave` } }, { new: true });

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Plugin de départ`')
                    .setDescription(`Le système de départ a été activé avec succès. ${emoji.succes}`)
                    .addField('Statut', `désactivée ➔ activée`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)

                .setColor("#2f3136");

                return message.channel.send(embed)
            } else {
                return message.channel.send(`${emoji.error} Vous devez avoir une configuration pour la supprimer`)
            }


        } else {
            return message.channel.send(`${emoji.error} Veuillez mettre un argument , on ou off !`)
        }












    },
};