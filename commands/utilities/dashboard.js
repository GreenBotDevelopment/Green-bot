const Discord = require('discord.js');
module.exports = {
    name: 'dashboard',
    description: 'Donne le lien du dashboard du bot',

    cat: 'utilities',
    execute(message, args) {



        const embed = new Discord.MessageEmbed()
            .setColor(message.client.color || '#3A871F')
            .setURL('http://green-bot.tk/')
            .setTitle('DASHBOARD')
            .setDescription(`Vous pouvez me configurer via mon site web , [ICI](http://green-bot.tk/)`)

        .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

        message.channel.send({ embed })






    },
};
