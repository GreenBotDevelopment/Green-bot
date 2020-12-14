const Discord = require('discord.js');
const config = require('../../config.json');
const emoji = require('../../emojis.json')
module.exports = {
        name: 'configuration',
        description: 'Affiche la configuration du bot',

        cat: 'utilities',
        execute(message, args) {



            const embed = new Discord.MessageEmbed()
                .setColor(message.client.color || '#3A871F')

            .setAuthor(`${message.client.user.username} - Configuration`, message.client.user.displayAvatarURL())

            .addField("📰 Préfixe", `\`${config.prefix || 'non configuré'}\``)
                .addField("🖌 Couleur", `\`${config.color || 'par défault (`#3A871F`)'}\``)
            .addField("⏬ Footer", `${config.footer || 'non configuré'}`)
            .addField("🐾 Emojis", `
            Succès :  ${emoji.succes}
            Erreur :  ${emoji.error}
            Chargement :  ${emoji.loading} `)

        .setTimestamp()
            .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        message.channel.send({ embed })






    },
};