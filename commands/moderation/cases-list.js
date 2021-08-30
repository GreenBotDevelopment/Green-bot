const moment = require('moment');
const Discord = require('discord.js');
const Warn = require('../../database/models/warn');
const Case = require('../../database/models/case');

module.exports = {
    name: 'cases-list',
    description: 'Gives the list of the server cases',
    aliases: ["case-list", "list-cases", "cases"],
    guildOnly: true,
    usage: '[member]',
    exemple: '@pauldb09',
    cat: 'moderation',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS"],

    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const lang = await message.translate("CASE_LIST")

        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
            if (!member) {
                let err = await message.translate("ERROR_USER")
                return message.errorMessage(err)
            }
        } else {
            member = null
        }
        if (member) {
            const check = await Case.find({ targetID: member.id })
            if (check.length == 0 || check.length < 1 || !check) {
                const warnEmbed = new Discord.MessageEmbed()
                    .setAuthor(member.user.tag, member.user.displayAvatarURL())
                    .setColor("#F0B02F")
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.noWarns.replace("{username}", member.user.username).replace("{username}", member.user.username).replace("{prefix}", message.guild.settings.prefix))
                    .setTitle(`${member.user.username}'s cases `)
                message.reply({ embeds: [warnEmbed], allowedMentions: { repliedUser: false } })
                return
            }
            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
            if (check.length < 4) {
                const warnEmbed = new Discord.MessageEmbed()
                    .setColor(message.guild.settings.color)
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.desc1.replace("{username}", member.user.username).replace("{x}", check.length).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))

                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
                check.forEach(caseInfo => {
                    warnEmbed.addField(`<:green_channel:824304682188537856> ${caseInfo.reason} (\`${caseInfo.id}\`)`, `<:663041911753277442:830432143800532993> **Type:** ${caseInfo.sanction}\n<:membres:830432144211705916> **${lang.mod}**: \`${message.guild.members.cache.get(caseInfo.mod) ? message.guild.members.cache.get(caseInfo.mod).user.tag : lang.no}\` \n(<@!${caseInfo.mod}>)`)
                });

                message.channel.send({ embeds: [warnEmbed] })
            } else {


                let i0 = 0;
                let i1 = 4;
                let page = 1;
                let description = check.map(caseInfo => `**<:green_channel:824304682188537856> ${caseInfo.reason} (\`${caseInfo.id}\`)**\n<:663041911753277442:830432143800532993> **Type:** ${caseInfo.sanction}\n<:membres:830432144211705916> **${lang.mod}**: \`${message.guild.members.cache.get(caseInfo.mod) ? message.guild.members.cache.get(caseInfo.mod).user.tag : lang.no}\` \n(<@!${caseInfo.mod}>)`).slice(0, 4).join("\n");


                const embed = new Discord.MessageEmbed()
                    .setColor(message.guild.settings.color)
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(`${lang.desc1.replace("{username}", member.user.username).replace("{x}", check.length).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix)} \nPage (${page}/${Math.ceil(check.length / 4)})\n\n${description}`)
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
                const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

                await msg.react("⬅");
                await msg.react("➡");

                const filter = (reaction, user) => user.id === message.author.id;
                const c = msg.createReactionCollector({ filter, time: 1000000 });

                c.on("collect", async reaction => {
                    if (reaction.emoji.name === "⬅") {
                        i0 = i0 - 4;
                        i1 = i1 - 4;
                        page = page - 1

                        if (i0 < 0) return;
                        if (page < 1) return;

                        let description =
                            check.map(caseInfo => `**<:green_channel:824304682188537856> ${caseInfo.reason} (\`${caseInfo.id}\`)**\n<:663041911753277442:830432143800532993> **Type:** ${caseInfo.sanction}\n<:membres:830432144211705916> **${lang.mod}**: \`${message.guild.members.cache.get(caseInfo.mod) ? message.guild.members.cache.get(caseInfo.mod).user.tag : lang.no}\` \n(<@!${caseInfo.mod}>)`).slice(i0, i1).join("\n");

                        embed.setDescription(`${lang.desc1.replace("{username}", member.user.username).replace("{x}", check.length).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix)} \nPage (${page}/${Math.ceil(check.length / 4)})\n\n${description}`)


                        msg.edit({ embeds: [embed] });
                    }

                    if (reaction.emoji.name === "➡") {
                        i0 = i0 + 4;
                        i1 = i1 + 4;
                        page = page + 1

                        if (i1 > check.length + 4) return;
                        if (i0 < 0) return;

                        let description =
                            check.map(caseInfo => `**<:green_channel:824304682188537856> ${caseInfo.reason} (\`${caseInfo.id}\`)**\n<:663041911753277442:830432143800532993> **Type:** ${caseInfo.sanction}\n<:membres:830432144211705916> **${lang.mod}**: \`${message.guild.members.cache.get(caseInfo.mod) ? message.guild.members.cache.get(caseInfo.mod).user.tag : lang.no}\` \n(<@!${caseInfo.mod}>)`).slice(i0, i1).join("\n");

                        embed.setDescription(`${lang.desc1.replace("{username}", member.user.username).replace("{x}", check.length).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix)} \nPage (${page}/${Math.ceil(check.length / 4)})\n\n${description}`)

                        msg.edit({ embeds: [embed] });
                    }

                    await reaction.users.remove(message.author.id);
                })
                c.on("end", async reaction => {
                    msg.reactions.removeAll()
                })
            }
        } else {
            const check = await Case.find({ serverID: message.guild.id })
            if (check.length == 0 || check.length < 1 || !check) {
                const warnEmbed = new Discord.MessageEmbed()
                    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL())
                    .setColor("#F0B02F")
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.err)
                    .setTitle("Server cases")
                message.reply({ embeds: [warnEmbed], allowedMentions: { repliedUser: false } })
                return
            }
            if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()
            if (check.length < 4) {
                const warnEmbed = new Discord.MessageEmbed()
                    .setColor(message.guild.settings.color)
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.desc.replace("{x}", check.length).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix))
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
                check.forEach(caseInfo => {
                    warnEmbed.addField(`<:green_channel:824304682188537856> ${caseInfo.reason} (\`${caseInfo.id}\`)`, `<:663041911753277442:830432143800532993> **Type:** ${caseInfo.sanction}\n<:membres:830432144211705916> **${lang.mod}**: \`${message.guild.members.cache.get(caseInfo.mod) ? message.guild.members.cache.get(caseInfo.mod).user.tag : lang.no}\` \n(<@!${caseInfo.mod}>)`)
                });

                message.channel.send({ embeds: [warnEmbed] })
            } else {


                let i0 = 0;
                let i1 = 4;
                let page = 1;
                let description = check.map(caseInfo => `**<:green_channel:824304682188537856> ${caseInfo.reason} (\`${caseInfo.id}\`)**\n<:663041911753277442:830432143800532993> **Type:** ${caseInfo.sanction}\n<:membres:830432144211705916> **${lang.mod}**: \`${message.guild.members.cache.get(caseInfo.mod) ? message.guild.members.cache.get(caseInfo.mod).user.tag : lang.no}\` \n(<@!${caseInfo.mod}>)`).slice(0, 4).join("\n");


                const embed = new Discord.MessageEmbed()
                    .setColor(message.guild.settings.color)
                    .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(`${lang.desc.replace("{x}", check.length).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix)} \nPage (${page}/${Math.ceil(check.length / 4)})\n\n${description}`)
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }));
                const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });

                await msg.react("⬅");
                await msg.react("➡");

                const filter = (reaction, user) => user.id === message.author.id;
                const c = msg.createReactionCollector({ filter, time: 1000000 });

                c.on("collect", async reaction => {
                    if (reaction.emoji.name === "⬅") {
                        i0 = i0 - 4;
                        i1 = i1 - 4;
                        page = page - 1

                        if (i0 < 0) return;
                        if (page < 1) return;

                        let description =
                            check.map(caseInfo => `**<:green_channel:824304682188537856> ${caseInfo.reason} (\`${caseInfo.id}\`)**\n<:663041911753277442:830432143800532993> **Type:** ${caseInfo.sanction}\n<:membres:830432144211705916> **${lang.mod}**: \`${message.guild.members.cache.get(caseInfo.mod) ? message.guild.members.cache.get(caseInfo.mod).user.tag : lang.no}\` \n(<@!${caseInfo.mod}>)`).slice(i0, i1).join("\n");

                        embed.setDescription(`${lang.desc.replace("{x}", check.length).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix)} \nPage (${page}/${Math.ceil(check.length / 4)})\n\n${description}`)


                        msg.edit({ embeds: [embed] });
                    }

                    if (reaction.emoji.name === "➡") {
                        i0 = i0 + 4;
                        i1 = i1 + 4;
                        page = page + 1

                        if (i1 > check.length + 4) return;
                        if (i0 < 0) return;

                        let description =
                            check.map(caseInfo => `**<:green_channel:824304682188537856> ${caseInfo.reason} (\`${caseInfo.id}\`)**\n<:663041911753277442:830432143800532993> **Type:** ${caseInfo.sanction}\n<:membres:830432144211705916> **${lang.mod}**: \`${message.guild.members.cache.get(caseInfo.mod) ? message.guild.members.cache.get(caseInfo.mod).user.tag : lang.no}\` \n(<@!${caseInfo.mod}>)`).slice(i0, i1).join("\n");

                        embed.setDescription(`${lang.desc.replace("{x}", check.length).replace("{prefix}", message.guild.settings.prefix).replace("{prefix}", message.guild.settings.prefix)} \nPage (${page}/${Math.ceil(check.length / 4)})\n\n${description}`)

                        msg.edit({ embeds: [embed] });
                    }

                    await reaction.users.remove(message.author.id);
                })
                c.on("end", async reaction => {
                    msg.reactions.removeAll()
                })

            }
        }



    },
};