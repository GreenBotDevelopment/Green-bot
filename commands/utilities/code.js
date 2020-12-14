const Discord = require('discord.js');
module.exports = {
    name: 'code',
    description: 'Donne le code du bot',

    cat: 'utilities',
    execute(message, args) {



        const embed = new Discord.MessageEmbed()
            .setColor(message.client.color || '#3A871F')

        .setAuthor(`${message.client.user.username} - Bot open source`, message.client.user.displayAvatarURL())
            .setDescription(`Je suis un bot pour débutants en discord.js , utilisez moi en cliquant ici : [CODE SOURCE](https://github.com/pauldb09/Green-bot)`)
            .setTimestamp()
            .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        message.channel.send({ embed })






    },
};