const Discord = require('discord.js');
module.exports = {
        name: 'links',
        description: 'Envoye un lien pour inviter le bot :)',
        aliases: ['add', 'botinvite', 'support', "discord", 'invite', 'code', 'github', 'dashboard'],
        cat: 'utilities',
        async execute(message, args, client, guildDB) {
            let here = await message.translate("CLIQ", guildDB.lang);
            const lang = await message.translate("LINKS", guildDB.lang)
            if (message.content.includes("invite") || message.content.includes("add")) {
                message.channel.send({
                    embeds: [{
                        author: {
                            name: message.author.username,
                            icon_url: message.author.displayAvatarURL({ dynamic: true, size: 512 })
                        },
                        color: guildDB.color,
                        description: `Want to invite Green-bot on your server? [Click here](https://discord.com/oauth2/authorize?client_id=783708073390112830&response_type=code&permissions=19456&scope=applications.commands+bot)\nWant another Green-bot to listen music in multiple voice channels? [Click here](https://discord.com/oauth2/authorize?client_id=902201674263851049&scope=bot&permissions=19456)\nWant to invite Green-bot 3? [Click here](https://discord.com/oauth2/authorize?client_id=906246223504240641&scope=bot&permissions=19456)`,
                        footer: {
                            text: message.client.footer,
                            icon_url: message.client.user.displayAvatarURL({ dynamic: true, size: 512 })
                        }
                    }],
                    allowedMentions: { repliedUser: false }
                })
            } else if (message.content.includes("support") || message.content.includes("discord")) {
                const embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setColor(guildDB.color)
                    .setDescription(`${guildDB.lang === "fr" ? " Vous pouvez rejoindre le discord de support en cliquant [`ici`](https://discord.gg/SQsBWtjzTv)":" You can join our support discord by clicking [\`here\`](https://discord.gg/SQsBWtjzTv)"}`)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
        message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else if (message.content.includes("vote")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(guildDB.color)
            .setDescription(`${guildDB.lang === "fr" ? "Vous pouvez voter pour Green-bot [`ici`](https://top.gg/bot/783708073390112830/vote)":" You can upvote me by clicking [\`here\`](https://top.gg/bot/783708073390112830/vote)"}`)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
        message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(guildDB.color)
                .addField('Support:', '[' + here + '](https://discord.gg/SQsBWtjzTv)', true)
                .addField('Invite:', '[' + here + '](https://discord.com/oauth2/authorize?client_id=783708073390112830&response_type=code&permissions=19456&scope=applications.commands+bot&redirect_uri=https://green-bot.app/discord)', true)
                .addField('Dashboard:', '[' + here + '](https://green-bot.app/)', true)
                .addField('Vote:', '[' + here + '](https://top.gg/bot/783708073390112830/vote)', true)
                .setDescription(lang)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
            if (guildDB.lang === "fr") {
                embed.addField('Documentation:', '[`' + here + '`](https://docs.green-bot.xyz/)', true)
            }
            message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
        }
    },
};