const moment = require('moment');
const Discord = require('discord.js');
const Warn = require('../../database/models/warn');
const emoji = require('../../emojis.json')
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
            return message.errorMessage(`Vous devez mentionner un membre valide ou fournir un ID valide.`)
        }
        if (member.user.bot) {
            return message.errorMessage(` Un bot ne peut pas avoir d'avertisements !`)
        }






        let warndb = await Warn.find({ serverID: message.guild.id, manID: member.id })

        if (warndb.length == 0) return message.errorMessage(`**${member.user.username}** n'a encore eu aucun avertisement sur ce serveur !`)
        if (warndb.length < 8) {
            const warnEmbed = new Discord.MessageEmbed()
                .setAuthor(member.user.tag, member.user.displayAvatarURL())
                .setColor(message.client.color)
                .setFooter(message.client.footer)
                .setDescription(`Avertisements de ${member}`)
                .addFields({ name: `Tous les warn(s) (${warndb.length})`, value: warndb.map(warn => `\`${warn.reason}\` , le ${moment(warn.date).locale('fr').format('LL LTS')} Modérateur : <@${warn.moderator}>`).join(`\n`) || `${emoji.error} Cette personne n'a aucun avertisemment` })

            const msg = await message.channel.send(warnEmbed);
        } else {


            let i0 = 0;
            let i1 = 8;
            let page = 1;
            let description = `Tous les warn(s) (${warndb.length})\n\n` +
                warndb.map(warn => `\`${warn.reason}\` , le ${moment(warn.date).locale('fr').format('LL LTS')} Modérateur : <@${warn.moderator}>`).slice(0, 8).join("\n");


            const embed = new Discord.MessageEmbed()
                .setColor(message.client.color)
                .setTitle(`Avertisements de ${member.user.tag} ${page}/${Math.ceil(warndb.length / 8)}`)
                .setDescription(description)


            const msg = await message.channel.send(embed);

            await msg.react("⬅");
            await msg.react("➡");

            const c = msg.createReactionCollector((_reaction, user) => user.id === message.author.id);

            c.on("collect", async reaction => {
                if (reaction.emoji.name === "⬅") {
                    i0 = i0 - 8;
                    i1 = i1 - 8;
                    page = page - 1

                    if (i0 < 0) return;
                    if (page < 1) return;

                    let description = `Tous les warn(s) (${warndb.length})\n\n` +
                        warndb.map(warn => `\`${warn.reason}\` , le ${moment(warn.date).locale('fr').format('LL LTS')} Modérateur : <@${warn.moderator}>`).slice(i0, i1).join("\n");

                    embed.setTitle(`Avertisements de ${member.user.tag} ${page}/${Math.ceil(warndb.length / 8)}`)
                        .setDescription(description);

                    msg.edit(embed);
                }

                if (reaction.emoji.name === "➡") {
                    i0 = i0 + 8;
                    i1 = i1 + 8;
                    page = page + 1

                    if (i1 > warndb.length + 8) return;
                    if (i0 < 0) return;

                    let description = `Tous les warn(s) (${warndb.length})\n\n` +
                        warndb.map(warn => `\`${warn.reason}\` , le ${moment(warn.date).locale('fr').format('LL LTS')} Modérateur : <@${warn.moderator}>`).slice(i0, i1).join("\n");

                    embed.setTitle(`Avertisements de ${member.user.tag} ${page}/${Math.ceil(warndb.length / 8)}`)
                        .setDescription(description);

                    msg.edit(embed);
                }

                await reaction.users.remove(message.author.id);
            })
        }


    },
};