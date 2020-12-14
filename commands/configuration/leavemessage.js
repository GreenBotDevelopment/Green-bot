const Discord = require('discord.js');
const { oneLine } = require('common-tags');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'leavemessage',
    description: oneLine `
    Définit le message que Green-bot dira lorsque que quelqu'un rejoint votre serveur.
    Vous pouvez utiliser \`{member}\` pour remplacer une mention d'utilisateur,
     \`{username}\` pour remplacer le nom d'utilisateur de quelqu'un,
    \`{tag}\` pour remplacer la balise Discord complète de quelqu'un (nom d'utilisateur + discriminateur),
    et \`{membercount}\` pour remplacer le nombre de membres actuel de votre serveur.
    Faites leavemessage disable pour supprimer le message.`,
    aliases: ['setleavemessage'],
    cat: 'configuration',
    args: true,
    usage: '<message>',
    exemple: '{member} vient de nous rejoindre , nous sommes désormais {membercount}!',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {

        if (args[0] === 'disable') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `leave` })
            if (verify) {
                if (!verify.message) return message.channel.send(`${emoji.error} Vous devez avoir activé le message pour le supprimer`)

                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, message: null, reason: `leave` });
                let leaveMessage = verify.message;
                if (leaveMessage.length > 50) leaveMessage = leaveMessage.slice(0, 50) + '...';

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Messages de départ`')
                    .setDescription(`Le message de départ a été désactivé avec succès. ${emoji.succes}`)
                    .addField('Message', `${leaveMessage} ➔ Aucun`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)

                .setColor("#2f3136");

                return message.channel.send(embed)
            } else {
                return message.channel.send(`${emoji.error} Vous devez avoir une configuration pour la supprimer`)
            }

        }


        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `leave` })
        if (verify) {
            let leaveMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
            const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `leave` }, { $set: { message: leaveMessage, reason: `leave` } }, { new: true });
            if (leaveMessage.length > 20) leaveMessage = leaveMessage.slice(0, 1021) + '...';

            const embed = new Discord.MessageEmbed()

            .setTitle('Paramètres : `Messages de départ`')
                .setDescription(`Le message de départ a été mis à jour avec succès. ${emoji.succes}`)
                .addField('Message', `${verify.message || 'Aucun message'} ➔ ${leaveMessage}`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.client.footer)

            .setColor("#2f3136");

            return message.channel.send(embed)
        } else {

            message.channel.send(`${emoji.error} Veuillez d'abord activer le plugin en faisant : \`leave on\``)
        }







    },
};