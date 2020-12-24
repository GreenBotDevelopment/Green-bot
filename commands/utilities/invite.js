const Discord = require('discord.js');
module.exports = {
    name: 'invite',
    description: 'Envoye un lien pour inviter le bot :)',
    aliases: ['add', 'botinvite'],
    cat: 'util',
    execute(message, client) {

        const embed = new Discord.MessageEmbed()

        .setTitle(`Inviter le bot !`)

        .setColor(message.client.color || '#3A871F')

        .setDescription(`Pour inviter le bot clique [ici](https://discord.com/oauth2/authorize?client_id=${message.client.user.id}&scope=bot&permissions=8), merci d'avance !`)
            .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')


        message.channel.send(embed)





    },
};