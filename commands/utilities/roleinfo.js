const Discord = require('discord.js');
const moment = require('moment')
const b = require("../../util/permissions.json")
module.exports = {
        name: 'roleinfo',
        description: 'Gives all the available informations about a role of the server',
        aliases: ['ri', 'role-info', 'info-role'],
        args: true,
        usage: "@role",
        exemple: "@member",
        cat: 'utilities',
        async execute(message, args) {
            let a = args.join(" ")
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.filter(m => m.name.toLowerCase().includes(a.toLowerCase())).first();
            if (!role) {
                let err = await message.translate("ERROR_ROLE")
                return message.errorMessage(err);
            }
            const lang = await message.translate("ROLEINFO")
            const embedUser = new Discord.MessageEmbed()
                .setColor(role.hexColor !== "#000000" ? role.hexColor : message.guild.settings.color)
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .addField(`__**${lang.title}**__`, `
                   **${lang.name}** ${role.name}
                   **${lang.color}**  [${role.hexColor}](https://api.alexflipnote.dev/color/image/${role.hexColor.replace("#","")})
                   **Id:** ${role.id}
                   **${lang.creation}**${moment(role.createdTimestamp).locale(message.guild.settings.lang).fromNow()}\n\n`, )
                .addField(`__**${lang.second}**__`,
                    `**${lang.with}** ${message.guild.members.cache.filter(m=>m.roles.cache.has(role.id)).size}
                    **Postion:** ${role.position}
                    **Hoist:** ${role.hoist ? "✅" : '❌'}
                    **Mentionable:** ${role.mentionable ? "✅" : '❌'}`)
                .addField("Permissions", `List: ${role.permissions.length == 0 ? "No permissions" : role.permissions.toArray().map(perm=>`${b[perm] ?`\`${b[perm][message.guild.settings.lang]}\`` :"" || ""}`).join(",")}`)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
             message.reply({ embeds: [embedUser], allowedMentions: { repliedUser: false } });
    },
};