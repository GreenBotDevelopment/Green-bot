const Discord = require('discord.js');
module.exports = {
    name: 'avatar',
    description: 'Affiche l\'avatar d\'un utilisateur (ou le vôtre, si aucun utilisateur n\'est mentionné).',
    aliases: ['profilepic', 'pic', 'a'],
    cat: 'utilities',

    execute(message, args) {
        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
        } else {
            member = message.member
        }
        if (!member) {

            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)

        }
        const embed = new Discord.MessageEmbed()

        .setTitle(`Avatar de ${member.user.tag}`)

        .setColor(message.client.color)
            .setImage(url = member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(message.client.footer)


        message.channel.send(embed)



    },
};