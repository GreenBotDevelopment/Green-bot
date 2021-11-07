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
                        description: `Want to invite Green-bot on your server? [Click here](${client.config.links.invite})`,
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
                    .setDescription(`${guildDB.lang === "fr" ? " Vous pouvez rejoindre le discord de support en cliquant [ici]("+client.config.links.support+")":" You can join our support discord by clicking [\`here\`]("+client.config.links.support+")"}`)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
        message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else if (message.content.includes("vote")) {
            const embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(guildDB.color)
            .setDescription(`${guildDB.lang === "fr" ? "Vous pouvez voter pour Green-bot [ici]("+client.config.topgg_url+"/vote)":" You can upvote me by clicking [here]("+client.config.topgg_url+"/vote)"}`)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
        message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
        } else {
            const embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor(guildDB.color)
                .addField('Support:', '[' + here + ']('+client.config.links.support+')', true)
                .addField('Invite:', '[' + here + ']('+client.config.links.invite+')', true)
                .addField('Dashboard:', '[' + here + ']('+client.config.links.website+')', true)
                .addField('Vote:', '[' + here + ']('+client.config.topgg_url+'/vote)', true)
                .setDescription(lang)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
        
            message.channel.send({ embeds: [embed], allowedMentions: { repliedUser: false } })
        }
    },
};