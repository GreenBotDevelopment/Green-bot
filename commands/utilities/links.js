const Discord = require('discord.js');
module.exports = {
    name: 'links',
    description: 'Envoye un lien pour inviter le bot :)',
    aliases: ['add', 'botinvite', 'support', 'invite', 'code', 'github'],
    cat: 'util',
    execute(message, client) {

        const embed = new Discord.MessageEmbed()

        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

        .setColor(message.client.color)
            .addField('Serveur Support :', '[Clique Ici](http://green-bot.xyz/discord)', true)
            .addField('Inviter le bot  :', `[Clique Ici](https://discord.com/oauth2/authorize?client_id=783708073390112830&scope=bot&permissions=8)`, true)
            .addField('Site :', '[Clique Ici](http://green-bot.xyz/)', true)
            .addField('Github :', '[Clique Ici](https://github.com/pauldb09/Green-bot)', true)
            .addField('Documentation', '[Clique Ici](https://docs.green-bot.xyz/)', true)

        .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


        message.channel.send(embed)





    },
};