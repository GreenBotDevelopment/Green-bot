const Discord = require('discord.js');
const ms = require('ms');
module.exports = {
    name: 'roles',
    description: 'Ajoute ou supprime un certain rôle à un membre du serveur .',
    aliases: ['role'],
    guildOnly: true,
    args: true,
    usage: '@user +/- @role',
    exemple: 'Pauldb09 + @games',
    cat: 'moderation',
    permissions: ['MANAGE_ROLES'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    async execute(message, args, client) {
        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.includes(args[0].toLowerCase()) || m.user.username.includes(args[0].toLowerCase())).first()
        } else {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        if (!member) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        let action = args[1]
        const lang = await message.translate("ROLES")

        if (action === '+') {
            const text = args.slice(2).join(" ")
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.filter(m => m.name.toLowerCase().includes(text.toLowerCase())).first();
            if (!role || role.name === '@everyone' || role.name === 'here') {
                let err = await message.translate("ERROR_ROLE")
                return message.errorMessage(err);
            }
            if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                return message.errorMessage(lang.position);
            }
            if (member.roles.cache) {
                if (member.roles.cache.has(role.id)) return message.errorMessage(lang.hasRole.replace("{role}", role));
            }
            member.roles.add(role.id).catch((error => {
                return message.errorMessage(lang.error)
            }))
            return message.succesMessage(lang.added.replace("{role}", role).replace("{user}", member))
        } else if (action === '-') {
            const text = args.slice(2).join(" ")
            let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]) || message.guild.roles.cache.filter(m => m.name.toLowerCase().includes(text.toLowerCase())).first();
            if (!role || role.name === '@everyone' || role.name === 'here') {
                let err = await message.translate("ERROR_ROLE")
                return message.errorMessage(err);
            }
            if (message.guild.me.roles.highest.comparePositionTo(role) < 0) {
                return message.errorMessage(lang.position);
            }
            if (member.roles.cache) {
                if (!member.roles.cache.has(role.id)) return message.errorMessage(lang.notHasRole.replace("{role}", role));

            } else {
                return message.errorMessage(lang.notHasRole.replace("{role}", role))
            }
            member.roles.remove(role.id).catch((error => {
                return message.errorMessage(lang.error)
            }))
            return message.succesMessage(lang.remove.replace("{role}", role).replace("{user}", member))
        } else {
            let err = await message.translate("ARGS_REQUIRED")
            const reportEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(`${err.replace("{command}","roles")} \`${message.guild.settings.prefix}roles @member +/- @role\``)
                .setFooter(message.client.footer)
                .setColor("#982318")
            message.channel.send({ embeds: [reportEmbed] })
        }
    },
};