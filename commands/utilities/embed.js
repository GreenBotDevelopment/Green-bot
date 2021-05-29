const { MessageEmbed } = require('discord.js');

module.exports = {
    
    name: 'embed',
    description: 'Envoie un Embed avec les arguments fournis',
    aliases: ['emd', 'msgembed'],
    args:true,
    cat: 'utilities',

    execute(message, args) {
        
        if(!args.join(" ")) return message.errorMessage("Vous devez renseigner le message a envoyer en format embed !");
         
      const embed = new MessageEmbed()
      .setColor(message.client.color)
      .setDescription(args.join(" "))
      .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

        return message.channel.send(embed)
        
    }
    
}
