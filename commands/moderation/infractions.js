const moment = require('moment');
const Discord = require('discord.js');
const Warn = require('../../database/models/warn');
module.exports = {
    name: 'infractions',
    description: 'Donne la liste des avertisements d\'un utilisateur',
    aliases: ["warns", "see-warns", "view-warns", "see-sanctions", "view-sanctions", "infractions", "view-infractions", "see-infractions"],
    guildOnly: true,
    args: 'member',
    usage: '@member',
    exemple: '@pauldb09',
    cat: 'moderation',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS"],

    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.includes(args.join(" ")) || m.displayName.includes(args.join(" ")) || m.user.username.includes(args.join(" "))).first()
        if (!member) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        if (member.user.bot) {
            let err = await message.translate("ERROR_BOT")
            return message.errorMessage(err)
        }
        const lang = await message.translate("INFRACTIONS")
        let warndb = await Warn.find({ serverID: message.guild.id, manID: member.id })
        if (warndb.length == 0) {
            const warnEmbed = new Discord.MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setColor("#F0B02F")
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(lang.noWarns.replace("{username}", member.user.username).replace("{username}", member.user.username).replace("{prefix}", message.guild.settings.prefix))
                .setTitle("Infractions")
            message.reply({ embeds: [warnEmbed], allowedMentions: { repliedUser: false } })
            return
        }
        if (warndb.length < 4) {
            const warnEmbed = new Discord.MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setColor(message.guild.settings.color)
                .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setDescription(lang.title.replace("{username}", member.user.username).replace("{username}", member.user.username).replace("{prefix}", message.guild.settings.prefix))
                .addFields({ name: `${lang.all} (${warndb.length})`, value: warndb.map(warn => `\`${warn.reason.slice(0, 400)}\`\n Date: ${moment(warn.date).locale(message.guild.settings.lang).format('LL LTS')}\n ${lang.mod} : <@${warn.moderator}>`).join(`\n`) || `${emoji.error} Cette personne n'a aucun avertisemment` })
            message.reply({ embeds: [warnEmbed], allowedMentions: { repliedUser: false } })
            return
        } else {
            let i0 = 0;
            let i1 = 4;
            let page = 1;
            let description = `${lang.all} (${warndb.length})\n\n` +
                warndb.map(warn => `\`${warn.reason.slice(0, 400)}\`\n Date: ${moment(warn.date).locale(message.guild.settings.lang).format('LL LTS')}\n ${lang.mod}: <@${warn.moderator}>`).slice(0, 4).join("\n");
            const embed = new Discord.MessageEmbed()
                .setColor(message.guild.settings.color)
                .setTitle(`${lang.title.replace("{username}", member.user.username).replace("{username}", member.user.username).replace("{prefix}",message.guild.settings.prefix)} (${page}/${Math.ceil(warndb.length / 4)})`)
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
                    i0 = i0 - 4;
                    i1 = i1 - 4;
                    page = page - 1
                    if (i0 < 0) return;
                    if (page < 1) return;
                    let description = `${lang.all} (${warndb.length})\n\n` +
                        warndb.map(warn => `\`${warn.reason.slice(0, 400)}\`\nDate ${moment(warn.date).locale(message.guild.settings.lang).format('LL LTS')}\n ${lang.mod} : <@${warn.moderator}>`).slice(i0, i1).join("\n");
                    embed.setTitle(`${lang.title.replace("{username}", member.user.username)} ${page}/${Math.ceil(warndb.length /4)}`)
                        .setDescription(description);
                    msg.edit({ embeds: [embed] });
                }
                if (reaction.emoji.name === "➡") {
                    i0 = i0 + 4;
                    i1 = i1 + 4;
                    page = page + 1
                    if (i1 > warndb.length + 4) return;
                    if (i0 < 0) return;
                    let description = `${lang.all} (${warndb.length})\n\n` +
                        warndb.map(warn => `\`${warn.reason.slice(0, 400)}\`\nDate ${moment(warn.date).locale(message.guild.settings.lang).format('LL LTS')} \n${lang.mod}: <@${warn.moderator}>`).slice(i0, i1).join("\n");
                    embed.setTitle(`${lang.title.replace("{username}", member.user.username)} ${page}/${Math.ceil(warndb.length / 4)}`)
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