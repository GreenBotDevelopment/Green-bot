const Discord = require('discord.js');
const Welcome = require('../../database/models/Welcome')
const moment = require("moment")
module.exports = {
        name: 'check-users',
        description: 'Vérifie les utilisateurs de votre serveur',

        cat: 'antiraid',
        aliases: ["auto-check"],
        guildOnly: true,

        permissions: ['MANAGE_GUILD'],

        async execute(message, args) {
            const lang = await message.translate("CHECK")
            let embed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

            .setColor("#F0B02F")
                .setTitle(lang.title)
                .setDescription(lang.desc)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))


            const msg1 = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()

            const u = message.guild.members.cache.filter(m => m.user.createdTimestamp > (Date.now() - 432000000));
            const usernam = /^[a-z]+[0-9]+$/
            if (u.size == 0) {
                let embed = new Discord.MessageEmbed()
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setColor("#F0B02F")
                    .setTitle(lang.end)
                    .setDescription(lang.not)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))

                return msg1.edit({ embeds: [embed] })
            }
            if (u.size < 4) {

                const embed = new Discord.MessageEmbed()

                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

                .setColor("#F0B02F")
                    .setTitle(lang.end)
                    .setDescription(lang.sus.replace("{u}", u.size))
                    .addField(`Liste `, u.map(member => `**${member.user.username}** (${member})\n<:horloge3:830440548053024789> ${lang.creation}: ${moment(member.user.createdTimestamp).locale(message.guild.settings.lang).fromNow()}${member.user.username.match(usernam)? lang.common:""}`).join("\n") || "err")



                msg1.edit({ embeds: [embed] })

            } else {

                let i0 = 0;
                let i1 = 4;
                let page = 1;

                let description = `${lang.sus.replace("{u}", u.size)}. \n${u.map(member => `**${member.user.username}** (${member})\n<:horloge3:830440548053024789> ${lang.creation} : ${moment(member.user.createdTimestamp).locale(message.guild.settings.lang).fromNow()}${member.user.username.match(usernam)? lang.common:""}`).slice(0, 4).join("\n")}`

        const embed = new Discord.MessageEmbed()
        .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))

        .setColor("#F0B02F")
            .setTitle(lang.end)
            .setDescription(description)
            



        const msg = await  msg1.edit({ embeds: [embed] });

        await msg.react("⬅");
        await msg.react("➡");

        const c = msg.createReactionCollector((_reaction, user) => user.id === message.author.id);

        c.on("collect", async reaction => {
            if (reaction.emoji.name === "⬅") {
                i0 = i0 - 4;
                i1 = i1 - 4;
                page = page - 1

                if (i0 < 0) return;
                if (page < 1) return;

                let description =`${lang.sus.replace("{u}", u.size)} \n${u.map(member => `**${member.user.username}** (${member})\n<:horloge3:830440548053024789> ${lang.creation} : ${moment(member.user.createdTimestamp).locale(message.guild.settings.lang).fromNow()}${member.user.username.match(usernam)? lang.common:""}`).slice(i0, i1).join("\n")}`;

                embed.setTitle(`${lang.end} ${page}/${Math.ceil(u.size / 4)}`)

                    .setDescription(description);

               msg.edit({embed:embed});
            }

            if (reaction.emoji.name === "➡") {
                i0 = i0 + 4;
                i1 = i1 + 4;
                page = page + 1

                if (i1 > u.size + 4) return;
                if (i0 < 0) return;

                let description =`${lang.sus.replace("{u}", u.size)}s \n${u.map(member => `**${member.user.username}** (${member})\n<:horloge3:830440548053024789> ${lang.creation} : ${moment(member.user.createdTimestamp).locale(message.guild.settings.lang).fromNow()}${member.user.username.match(usernam)? lang.common:""}`).slice(i0, i1).join("\n")}`;

                embed.setTitle(`${lang.end} ${page}/${Math.ceil(u.size / 4)}`)
                    .setDescription(description);

               msg.edit({embed:embed});
            }

            await reaction.users.remove(message.author.id);
        })
    }











    },
};