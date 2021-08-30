const fetch = require('node-fetch');
const Discord = require('discord.js');
const Rmd = require("../../database/models/remind")
var hexColorRegex = require('hex-color-regex');
const ms = require('ms');
const moment = require("moment")
module.exports = {
    name: 'remind',
    description: 'Manage your reminders',
    cat: 'utilities',
    args: true,
    aliases: ['remindme', 'remind-me', 'reminder', 'reminders', 'reminds'],
    guildOnly: true,
    usages: ["remind create <time> <reason>", "remind delete <reason>", "remind list"],
    usage: 'create/list/delete',
    exemple: 'create 1d eat',
    async execute(message, args) {
        const lang = await message.translate("REMIND")
        let type = args[0];
        if (!type || (type.toLowerCase() !== "create" && type.toLowerCase() !== "list" && type.toLowerCase() !== "delete")) {
            let err = await message.translate("ARGS_REQUIRED")
            const reportEmbed = new Discord.MessageEmbed()
                .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(`${err.replace("{command}","remind")} \`${message.guild.settings.prefix}remind create/list/delete\``)
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor("#F0B02F")
            message.reply({ embeds: [reportEmbed], allowedMentions: { repliedUser: false } })
        }
        if (type.toLowerCase() === "create") {
            const time = args[1];
            if (!time || isNaN(ms(time))) {
                return message.errorMessage(lang.time)
            }
            if (ms(time) > (1209600000 * 30) || time.includes("-") || time.includes("+") || time.includes(",") || time.includes(".") || time.startsWith("0")) {
                return message.errorMessage(lang.time)
            }
            const msg = args.slice(2).join(" ");
            if (!msg) {
                return message.errorMessage(lang.msg)
            }
            if (msg.length > 2000 || msg.length < 1) {
                let numberErr = await message.translate("MESSAGE_ERROR")
                return message.errorMessage(numberErr.replace("{amount}", "2").replace("{range}", "2000"))
            }
            let crt = new Rmd({
                userID: message.author.id,
                time: time,
                reason: msg,
                ends_at: Date.now() + ms(time),
                lang: message.guild.settings.lang
            }).save()
            message.succesMessage(lang.succes.replace("{time}", time))
        }
        if (type.toLowerCase() === "delete") {
            const msg = args.slice(1).join(" ");
            if (!msg) {
                return message.errorMessage(lang.name)
            }
            const reminders = await Rmd.find({ userID: message.author.id });
            if (reminders.length == 0) {
                const warnEmbed = new Discord.MessageEmbed()
                    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL())
                    .setColor("#F0B02F")
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.no.replace("{prefix}", message.guild.settings.prefix))
                    .setTitle(lang.title)
                message.reply({ embeds: [warnEmbed], allowedMentions: { repliedUser: false } })
                return
            }
            let remind = reminders.filter(r => r.reason.toLowerCase().includes(msg.toLowerCase()))
            if (!remind[0] || !remind) {
                return message.errorMessage(lang.exist.replace("{text}", msg))
            }
            if (reminders.lengh == 1) {
                let del = await Rmd.findOneAndDelete({ _id: remind[0]._id })
                message.succesMessage(lang.del.replace("{text}", remind[0].reason))
            } else {
                const conf = await message.channel.send(Discord.Util.removeMentions(lang.found.replace("{msg}", remind[0].reason.slice(0, 400)).replace("{time}", remind[0].time).replace("{text}", msg)))
                const ID = message.member.id;
                const filter = m => m.author.id === ID && (m.content === "cancel" || m.content === "confirm");
                await message.channel.awaitMessages({ filter, max: 1, time: 90000 }).then(async(collected) => {
                    if (collected.first().content === "cancel") {
                        let okk = await message.translate("CANCELED")
                        return conf.edit(`**${okk}**`)
                    }
                    let del = await Rmd.findOneAndDelete({ _id: remind[0]._id })
                    message.succesMessage(lang.del.replace("{text}", remind[0].reason))
                    conf.delete()
                }).catch(async() => {
                    let okk = await message.translate("CANCELED")
                    return conf.edit(`**${okk}**`)
                });
            }
        }
        if (type.toLowerCase() === "list") {
            const reminders = await Rmd.find({ userID: message.author.id });
            if (reminders.length == 0) {
                const warnEmbed = new Discord.MessageEmbed()
                    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL())
                    .setColor("#F0B02F")
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.no.replace("{prefix}", message.guild.settings.prefix))
                    .setTitle(lang.title)
                message.reply({ embeds: [warnEmbed], allowedMentions: { repliedUser: false } })
                return
            }
            if (reminders.length < 6) {
                const warnEmbed = new Discord.MessageEmbed()
                    .setAuthor(message.member.user.tag, message.member.user.displayAvatarURL())
                    .setColor(message.guild.settings.color)
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setDescription(lang.desc.replace("{prefix}", message.guild.settings.prefix))
                    .addFields({ name: `${lang.title}`, value: reminders.map(warn => `\`${warn.reason.slice(0, 400)}\`\n ${message.guild.settings.lang === "fr" ? "Durée:":"Time:"} ${warn.time}`).join(`\n`) || `${emoji.error} Cette personne n'a aucun avertisemment` })

                message.reply({ embeds: [warnEmbed], allowedMentions: { repliedUser: false } })
                return
            } else {
                let i0 = 0;
                let i1 = 6;
                let page = 1;
                let description = `${lang.desc.replace("{prefix}", message.guild.settings.prefix)}\n\n` +
                    reminders.map(warn => `\`${warn.reason.slice(0, 400)}\`\n ${message.guild.settings.lang === "fr" ? "Durée:":"Time:"} ${warn.time}`).join(`\n`).slice(0, 6).join("\n");
                const embed = new Discord.MessageEmbed()
                    .setColor(message.guild.settings.color)
                    .setTitle(`${lang.title} (${page}/${Math.ceil(reminders.length /6)})`)
                    .setDescription(description)
                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                const msg = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
                await msg.react("⬅");
                await msg.react("➡");
                const filter = (reaction, user) => user.id === message.author.id;
                const c = msg.createReactionCollector({ filter, time: 1000000 });
                c.on("collect", async reaction => {
                    if (reaction.emoji.name === "⬅") {
                        i0 = i0 - 6;
                        i1 = i1 - 6;
                        page = page - 1
                        if (i0 < 0) return;
                        if (page < 1) return;
                        let description = `${lang.desc.replace("{prefix}", message.guild.settings.prefix)}\n\n` +
                            reminders.map(warn => `\`${warn.reason.slice(0, 400)}\`\n ${message.guild.settings.lang === "fr" ? "Durée:":"Time:"} ${warn.time}`).join(`\n`).slice(i0, i1).join("\n");
                        embed.setTitle(`${lang.title} ${page}/${Math.ceil(reminders.length /4)}`)
                            .setDescription(description);
                        msg.edit({ embeds: [embed] });
                    }
                    if (reaction.emoji.name === "➡") {
                        i0 = i0 + 6;
                        i1 = i1 + 6;
                        page = page + 1
                        if (i1 > reminders.length + 6) return;
                        if (i0 < 0) return;
                        let description = `${lang.desc.replace("{prefix}", message.guild.settings.prefix)}\n\n` +
                            reminders.map(warn => `\`${warn.reason.slice(0, 400)}\`\n ${message.guild.settings.lang === "fr" ? "Durée:":"Time:"} ${warn.time}`).join(`\n`).slice(i0, i1).join("\n");
                        embed.setTitle(`${lang.title} ${page}/${Math.ceil(reminders.length /6)}`)
                            .setDescription(description);
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