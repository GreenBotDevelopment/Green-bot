const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/Welcome');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'welcome',
    description: 'Active ou désactive le système de bienvenue',
    aliases: ['welcomesystem', 'setwelcome'],

    cat: 'configuration',
    args: true,
    usage: 'on/off',
    exemple: 'on',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'off') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })
            if (verify) {
                if (!verify.status) return message.channel.send(`${emoji.error} Le plugin d'accueil n'est déja activé dans ce serveur...`);
                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `welcome` }, { $set: { status: null, reason: `welcome` } }, { new: true });

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Plugin de bienvenue`')
                    .setDescription(`le système de bienvenue a été désactivé avec succès. ${emoji.succes}`)
                    .addField('Status', `activé ➔ désactivé`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)

                .setColor("#2f3136");

                return message.channel.send(embed)
            } else {
                return message.channel.send(`${emoji.error} Vous devez avoir une configuration pour la supprimer`)
            }

        }
        if (args[0] === 'on') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })
            if (verify) {
                if (verify.status) return message.channel.send(`${emoji.error} L'image d'accueil est déja activée dans ce serveur...`);
                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `welcome` }, { $set: { status: true, reason: `welcome` } }, { new: true });

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Plugin de bienvenue`')
                    .setDescription(`Le système de bienvenue a été activé avec succès. ${emoji.succes}`)
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