const Discord = require('discord.js');
module.exports = {
    name: 'restrictemoji',
    description: 'Permits, rejects or resets emoji usage permission for a role.',
    aliases: ["emoji-role", "roleemoji"],
    cat: 'utilities',
    args: true,
    usage: 'add/remove/reset <emoji> @role',
    usages: ["restrictemoji add <emoji> @role", "restrictemoji remove <emoji> @role", "restrictemoji reset @emoji"],
    exemple: 'add emoji @role',
    permissions: ['MANAGE_GUILD'],
    async execute(message, args) {
        let type = args[0];
        const lang = await message.translate("EMOJI_ROLE")
        if (!type || (type.toLowerCase() !== "add" && type.toLowerCase() !== "remove" && type.toLowerCase() !== "reset")) {
            const reportEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(lang.err)
                .addField(lang.a, `\`${message.guild.settings.prefix}restrictemoji add <emoji> @role\``)
                .addField(lang.b, `\`${message.guild.settings.prefix}restrictemoji remove <emoji> @role\``)
                .addField(lang.c, `\`${message.guild.settings.prefix}restrictemoji reset <emoji>\``)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL())
                .setColor("#F0B02F")
            return message.channel.send({ embeds: [reportEmbed] })
        }
        if (type.toLowerCase() === "add") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
            if (!role || role.managed) {
                let err = await message.translate("ERROR_ROLE")
                return message.errorMessage(err);
            }
            const emoji = args[1];
            if (!emoji) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            const custom = Discord.Util.parseEmoji(emoji);
            if (!custom || !custom.id) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            const good = message.guild.emojis.cache.get(custom.id)
            if (!good) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            await good.roles.add(role)
            return message.succesMessage(lang.addedOk.replace("{role}", role.name).replace("{emoji}", good))

        } else if (type.toLowerCase() === "remove") {
            const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
            if (!role || role.managed) {
                let err = await message.translate("ERROR_ROLE")
                return message.errorMessage(err);
            }
            const text = message.content
            if (text.split(':')[2] === undefined) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            const emojiID = text.split(':')[2].replace(">", "");
            if (!emojiID) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            const emoji = message.guild.emojis.cache.get(emojiID);
            if (emoji === undefined || !emoji.available || emoji.deleted) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            await emoji.roles.remove(role)
            return message.succesMessage(lang.delOk.replace("{role}", role.name).replace("{emoji}", emoji))
        } else if (type.toLowerCase() === "reset") {
            const text = message.content
            if (text.split(':')[2] === undefined) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            const emojiID = text.split(':')[2].replace(">", "");
            if (!emojiID) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            const emoji = message.guild.emojis.cache.get(emojiID);
            if (emoji === undefined || !emoji.available || emoji.deleted) {
                const err = await message.translate("EMOJI_ERROR")
                return message.errorMessage(err)
            }
            await emoji.roles.set([])
            return message.succesMessage(lang.resetOk.replace("{emoji}", emoji))
        } else {
            const reportEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(lang.err)
                .setTitle("Restrict Emoji")
                .addField(lang.a, `\`${message.guild.settings.prefix}restrictemoji add <emoji> @role\``)
                .addField(lang.b, `\`${message.guild.settings.prefix}restrictemoji remove <emoji> @role\``)
                .addField(lang.c, `\`${message.guild.settings.prefix}restrictemoji reset <emoji>\``)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL())
                .setColor("#F0B02F")
            return message.channel.send({ embeds: [reportEmbed] })
        }
    },
};