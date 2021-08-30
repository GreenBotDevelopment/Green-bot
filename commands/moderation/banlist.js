const Discord = require('discord.js');
module.exports = {
        name: 'banlist',
        description: 'Donne la liste des membres bannis du serveur',
        guildOnly: true,
        cat: 'moderation',
        aliases: ['ban-list'],
        permissions: ['MANAGE_GUILD'],
        botpermissions: ["BAN_MEMBERS"],
        async execute(message, args, client) {
            const banList = await message.guild.bans.fetch({ cache: false })
            if (banList.size == 0) {
                let err = await message.translate("NO_BANS")
                return message.errorMessage(err)
            }
            const lang = await message.translate("BANLIST")

            if (banList.size < 8) {

                const embed = new Discord.MessageEmbed()

                .setTitle(`${lang.field1T} (${banList.size})`)

                .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL())
                    .setColor(message.guild.settings.color)
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.desc.replace("{size}", banList.size))
                    .addField(`Bans `, banList.map((track) => `\`${track.user.tag}\` : __${track.reason ? track.reason : lang.no}__`).join("\n"))
                    .setThumbnail(message.guild.icon ? message.guild.iconURL({ dynamic: true }) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128")



                message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })

            } else {

                let i0 = 0;
                let i1 = 8;
                let page = 1;

                let description = `${lang.desc.replace("{size}", banList.size)}\n\n${banList.map((track) => `\`${track.user.tag}\` : __${track.reason ? track.reason : "Aucunne raison fournie"}__`).slice(0, 8).join("\n")}`

            const embed = new Discord.MessageEmbed()
            .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL())
            .setColor(message.guild.settings.color)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setTitle(`${lang.field1T} ${page}/${Math.ceil(banList.size / 8)}`)
                .setDescription(description)
                .setThumbnail(message.guild.icon ? message.guild.iconURL({dynamic:true}) : "https://cdn.discordapp.com/attachments/748897191879245834/782271474450825226/0.png?size=128")

            const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false }  });

            await msg.react("⬅");
            await msg.react("➡");

            const c = msg.createReactionCollector((_reaction, user) => user.id == message.member.id);

            c.on("collect", async reaction => {
                if (reaction.emoji.name === "⬅") {
                    i0 = i0 - 8;
                    i1 = i1 - 8;
                    page = page - 1

                    if (i0 < 0) return;
                    if (page < 1) return;

                    let description =`${lang.desc.replace("{size}", banList.size)}\n\n${banList.map((track) => `\`${track.user.tag}\` : __${track.reason ? track.reason : "Aucunne raison fournie"}__`).slice(i0, i1).join("\n")}`;

                    embed.setTitle(`${lang.field1T} ${page}/${Math.ceil(banList.size / 8)}`)

                        .setDescription(description);

                    msg.edit({ embeds: [embed] });
                }

                if (reaction.emoji.name === "➡") {
                    i0 = i0 + 8;
                    i1 = i1 + 8;
                    page = page + 1

                    if (i1 > banList.size + 8) return;
                    if (i0 < 0) return;

                    let description =`${lang.desc.replace("{size}", banList.size)}\n\n${banList.map((track) => `\`${track.user.tag}\` : __${track.reason ? track.reason : "Aucunne raison fournie"}__`).slice(i0, i1).join("\n")}`;

                    embed.setTitle(`${lang.field1T} ${page}/${Math.ceil(banList.size / 8)}`)
                        .setDescription(description);

                    msg.edit({ embeds: [embed] });
                }

                await reaction.users.remove(message.author.id);
            })
            c.on("end", async reaction => {
                msg.reactions.removeAll()
                        })
        }
      
















    },
};