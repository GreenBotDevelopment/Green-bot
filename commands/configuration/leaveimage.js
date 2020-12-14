const Discord = require('discord.js');
const sendErrorMessage = require('../../util.js');
const Welcome = require('../../database/models/Welcome');
const emoji = require('../../emojis.json')
const { oneLine } = require('common-tags');
module.exports = {
    name: 'leaveimage',
    description: 'Active ou désactive l\'image d\'accueil',
    aliases: ['setleaveimage'],
    cat: 'configuration',
    args: true,
    usage: 'on/off',
    exemple: 'on',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        if (args[0] === 'off') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `leave` })
            if (verify) {
                if (!verify.image) return message.channel.send(`${emoji.error} L'image d'accueil n'est déja activée dans ce serveur...`);
                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `leave` }, { $set: { image: null, reason: `leave` } }, { new: true });

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Image de départ`')
                    .setDescription(`L'image' de départ a été désactivée avec succès. ${emoji.succes}`)
                    .addField('Image', `activée ➔ désactivée`)
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
                if (verify.image) return message.channel.send(`${emoji.error} L'image d'accueil est déja activée dans ce serveur...`);
                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `leave` }, { $set: { image: true, reason: `leave` } }, { new: true });

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Image de départ`')
                    .setDescription(`L'image de départ a été activée avec succès. ${emoji.succes}`)
                    .addField('Image', `désactivée ➔ activée`)
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