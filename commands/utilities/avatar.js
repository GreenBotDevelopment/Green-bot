const Discord = require('discord.js');
module.exports = {
    name: 'avatar',
    description: 'Affiche l\'avatar d\'un utilisateur (ou le vôtre, si aucun utilisateur n\'est mentionné).',
    aliases: ['profilepic', 'pic', 'a', 'pp', 'pdp'],
    cat: 'utilities',
    async execute(message, args) {
        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
            if (!member) {
                let err = await message.translate("ERROR_USER")
                return message.errorMessage(err)
            }
        } else {
            member = message.member
        }
        let a = await message.translate("AVATAR")
        let b = await message.translate("AVATAR_DESC")
        const embed = new Discord.MessageEmbed()
            .setAuthor(`${a}${member.user.tag}`, member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(message.guild.settings.color)
            .setImage(url = member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setDescription(b.replace("{url}", member.user.displayAvatarURL({ dynamic: true, size: 512 })))
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
    },
};