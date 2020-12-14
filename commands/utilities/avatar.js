const Discord = require('discord.js');
module.exports = {
    name: 'avatar',
    description: 'Affiche l\'avatar d\'un utilisateur (ou le vôtre, si aucun utilisateur n\'est mentionné).',
    aliases: ['profilepic', 'pic', 'a'],
    cat: 'utilities',

    execute(message) {
        if (!message.mentions.users.size) {
            const embed = new Discord.MessageEmbed()

            .setTitle(`Votre avatar`)

            .setColor(message.client.color || '#3A871F')
                .setImage(url = message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')

            message.channel.send(embed)


        }
        const avatarList = message.mentions.users.map(user => {
            const embed = new Discord.MessageEmbed()

            .setTitle(`Avatar de ${user.tag}`)

            .setColor('#3A871F')
                .setImage(url = user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer || 'Green-Bot | Open source bot by 𝖕𝖆𝖚𝖑𝖉𝖇09#9846')


            message.channel.send(embed)

        });


    },
};