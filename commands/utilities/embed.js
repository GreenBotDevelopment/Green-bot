const Discord = require('discord.js');

module.exports = {
    name: 'embed',
    description: 'Envoie un Embed avec les arguments fournis',
    aliases: ['emd', 'msgembed'],
    args:true,
    cat: 'utilities',

    execute(message, args) {
         
      const embed = new Discord.MessageEmbed()
        .setColor(message.client.color)
        .setDescription(args.join(" "))
                  .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        if (args.length) return message.channel.send(embed)
        else return message.errorMessage(`Vous devez renseigner le message a envoyer.`)
    },
};
