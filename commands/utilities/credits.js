const Discord = require('discord.js');
module.exports = {
    name: 'credits',
    description: 'Affiche les crédits du bot',
    aliases: ['sources', 'createurs'],
    cat: 'utilities',
    execute(message, args) {



        const embed = new Discord.MessageEmbed()
            .setColor(message.client.color || '#3A871F')

        .setAuthor(`${message.client.user.username} - Credits`, message.client.user.displayAvatarURL())

        .addField("🖥 Developeur", `<@${message.client.owner}>`)
            .addField("🗄 Merci à :", `<@688402229245509844>`)
            .setTimestamp()
            .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        message.channel.send({ embed })






    },
};