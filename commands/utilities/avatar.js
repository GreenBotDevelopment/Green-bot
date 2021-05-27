const { MessageEmbed } = require("discord.js");

module.exports = {
    
    name: 'avatar',
    description: 'Affichage de l\'avatar d\'un utilisateur (ou le vôtre : si aucun utilisateur n\'est mentionné).',
    aliases: [ 'profilepic', 'pic', 'a' ],
    cat: 'utilities',

    execute(message, args) {
        
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        
        if (!member) return message.errorMessage("Vous devez mentionner un utilisateur ou fournir un identifiant ( ID ) correcte.")
        
        const avatarEmbed = new MessageEmbed()
        .setTitle(member.id == message.member.id ? "Votre avatar" : `Avatar de ${member.user.tag}`)
        .setColor(message.client.color)
        .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
        .setFooter(message.client.footer)
        .setURl(member.user.displayAvatarURL({ dynamic: true, size: 512 }));
        
        return message.channel.send(avatarEmbed);
        
    }
    
}
