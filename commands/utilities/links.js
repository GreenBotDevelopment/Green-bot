const Discord = require('discord.js');
module.exports = {
        name: 'links',
        description: 'Envoye un lien pour inviter le bot :)',
        aliases: ['add', 'botinvite', 'support', "discord", 'invite', 'code', 'vote', 'github', 'dashboard'],
        cat: 'utilities',
        async execute(message, client) {
            let here = await message.translate("CLIQ");
            const lang = await message.translate("LINKS")
            if (message.content.includes("invite")) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor(message.guild.settings.color)
                    .setDescription(`${message.guild.settings.lang === "fr" ? "`📚` Vous pouvez m'ajouter sur votre serveur en cliquant [`ici`](https://discord.com/oauth2/authorize?client_id=783708073390112830&permissions=8&scope=bot)":"`📚` You can add me to your server by clicking [\`here\`](https://discord.com/oauth2/authorize?client_id=783708073390112830&permissions=8&scope=bot)"}`)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else if (message.content.includes("support") || message.content.includes("discord")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(message.guild.settings.color)
            .setDescription(`${message.guild.settings.lang === "fr" ? "`📚` Vous pouvez rejoindre le discord de support en cliquant [`ici`](https://discord.gg/nrReAmApVJ)":"`📚` You can join our support discord by clicking [\`here\`](https://discord.gg/nrReAmApVJ)"}`)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else if (message.content.includes("vote")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(message.guild.settings.color)
            .setDescription(`${message.guild.settings.lang === "fr" ? "Si vous aimez Green-bot, supportez nous en votant [`ici`](https://top.gg/bot/783708073390112830/vote)":" If you enjoy Green-bot, free feel to support us by voting the bot [\`here\`](https://top.gg/bot/783708073390112830/vote)"}`)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(message.guild.settings.color)
                .addField('Support:', '[`' + here + '`](https://discord.gg/nrReAmApVJ)', true)
                .addField('Invite:', '[`' + here + '`](https://discord.com/oauth2/authorize?client_id=783708073390112830&permissions=8&scope=bot)', true)
                .addField('Dashboard:', '[`' + here + '`](https://green-bot.app/)', true)
                .addField('Vote:', '[`' + here + '`](https://top.gg/bot/783708073390112830/vote)', true)
                .setDescription(lang)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
            if (message.guild.settings.lang === "fr") {
                embed.addField('Documentation:', '[`' + here + '`](https://docs.green-bot.xyz/)', true)
            }
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
        }
    },
};