const Discord = require('discord.js');
const guild = require('../../database/models/guild');
const moment = require('moment')
module.exports = {
        name: 'userinfo',
        description: 'Gives all available informations about a user',
        aliases: ['ui', 'user-info', 'info-user'],
        usage: '[user]',
        usages: ["userinfo", "userinfo @user"],
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
            const lang = await message.translate("USERINFO")
            let here = await message.translate("CLIQ");
            const roles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, -1);
            const embedUser = new Discord.MessageEmbed()
                .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(member.displayHexColor !== "#000000" ? member.displayHexColor : message.guild.settings.color)
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .addField(`__**${lang.title}**__`, `
                    **${lang.name}** ${member.user.username}
                    **${lang.discrim}**  ${member.user.discriminator}
                    **Id:** ${member.user.id}
                    **Avatar:** [${here}](${member.user.displayAvatarURL({ dynamic: true })})
                    **${lang.creation}** ${moment(member.user.createdTimestamp).locale(message.guild.settings.lang).format('LT')} ${moment(member.user.createdTimestamp).locale(message.guild.settings.lang).format('LL')} (\`${moment(member.user.createdTimestamp).locale(message.guild.settings.lang).fromNow()}\`)\n\n`, )
                .addField(`__**${lang.second}**__`,
                    `**${lang.higest}** ${member.roles.highest.id === message.guild.id ? lang.none : member.roles.highest.name}
                     **${lang.join}** ${moment(member.joinedAt).format('LL LTS')}(\`${moment(member.joinedAt).locale(message.guild.settings.lang).fromNow()}\`)
                     **${lang.hoist}** ${member.roles.hoist ? member.roles.hoist.name : lang.none}
                     **Roles [${roles.length}]:**\n${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? `${member.roles.cache.map(r=>r).slice(0,10)} ${lang.rest.replace("{rest}",member.roles.cache.size - 10)}` : lang.none}\n\n`)
               .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({embeds:[embedUser], allowedMentions: { repliedUser: false } });
    },
};