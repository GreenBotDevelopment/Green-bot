const Discord = require('discord.js');
const { oneLine } = require('common-tags');
const Welcome = require('../../database/models/Welcome')
const emoji = require('../../emojis.json')

module.exports = {
    name: 'welcomemessage',
    description: oneLine `
    Définit le message que Green-bot dira lorsque que quelqu'un rejoint votre serveur.
    Vous pouvez utiliser \`{member}\` pour remplacer une mention d'utilisateur,
     \`{username}\` pour remplacer le nom d'utilisateur de quelqu'un,
    \`{tag}\` pour remplacer la balise Discord complète de quelqu'un (nom d'utilisateur + discriminateur),
    et \`{membercount}\` pour remplacer le nombre de membres actuel de votre serveur.
    Faites welcomemessage disable pour supprimer le message.`,
    aliases: ['setwelcomemessage', 'messageaccueil'],
    cat: 'configuration',
    args: true,
    usage: '<message>',
    exemple: '{member} vient de nous rejoindre , nous sommes désormais {membercount}!',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {

        if (args[0] === 'disable') {
            const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })
            if (verify) {
                if (!verify.message) return message.channel.send(`${emoji.error} Vous devez avoir activé le message pour le supprimer`)

                const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, message: null, reason: `welcome` });
                let welcomeMessage = verify.message;
                if (welcomeMessage.length > 50) welcomeMessage = welcomeMessage.slice(0, 50) + '...';

                const embed = new Discord.MessageEmbed()

                .setTitle('Paramètres : `Messages de bienvenue`')
                    .setDescription(`Le message de bienvenue a été désactivé avec succès. ${emoji.succes}`)
                    .addField('Message', `${welcomeMessage} ➔ Aucun`)
                    .setThumbnail(message.guild.iconURL({ dynamic: true }))
                    .setFooter(message.client.footer)

                .setColor("#2f3136");

                return message.channel.send(embed)
            } else {
                return message.channel.send(`${emoji.error} Vous devez avoir une configuration pour la supprimer`)
            }

        }


        const verify = await Welcome.findOne({ serverID: message.guild.id, reason: `welcome` })
        if (verify) {
            let welcomeMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
            const newchannel = await Welcome.findOneAndUpdate({ serverID: message.guild.id, reason: `welcome` }, { $set: { message: welcomeMessage, reason: `welcome` } }, { new: true });
            if (welcomeMessage.length > 20) welcomeMessage = welcomeMessage.slice(0, 1021) + '...';

            const embed = new Discord.MessageEmbed()

            .setTitle('Paramètres : `Messages de bienvenue`')
                .setDescription(`Le message de bienvenue a été mis à jour avec succès. ${emoji.succes}`)
                .addField('Message', `${verify.message || 'Aucun message'} ➔ ${welcomeMessage}`)
                .setThumbnail(message.guild.iconURL({ dynamic: true }))
                .setFooter(message.client.footer)

            .setColor("#2f3136");

            return message.channel.send(embed)
        } else {

            message.channel.send(`${emoji.error} Veuillez d'abord activer le plugin en faisant : \`welcome on\``)
        }







    },
};