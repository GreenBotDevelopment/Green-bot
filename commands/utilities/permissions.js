const Discord = require('discord.js');
const moment = require('moment')
const guild = require('../../database/models/guild');
const backup = require('../../database/models/backup');
const sugg = require('../../database/models/sugg');
const permissions = Object.keys(Discord.Permissions.FLAGS);
const a = require("../../util/permissions.json")
module.exports = {
    name: 'permissions',
    description: 'Affiche toutes vos permissions ou du membre fourni sur le serveur .',
    aliases: ['perms'],
    usage: '[member]',
    exempe: '@pauldb09',
    cat: 'utilities',
    async execute(message, args) {
        let member;
        if (args.length) {
            member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
            if (!member) {
                let err = await message.translate("ERROR_USER")
                return message.errorMessage(err)
            }
        } else {
            member = message.member
        }
        let loadingTest = await message.translate("LOADING")
        let msg = await message.channel.send({ embeds: [new Discord.MessageEmbed().setColor(message.guild.settings.color).setDescription(loadingTest)] })
        const lang = await message.translate("PERMS")
        let text = "<:Dnd:823223157502378014> : **" + lang.not + "**\n<:ok:830437777388470282> :** " + lang.has + "**\n";
        const mPermissions = message.channel.permissionsFor(member);
        const total = {
            denied: 0,
            allowed: 0
        };
        permissions.forEach((perm) => {
            if (!a[perm]) return;
            if (!mPermissions.has(perm)) {
                text += `\`${a[perm][message.guild.settings.lang]}\` <:Dnd:823223157502378014>\n`;
                total.denied++;
            } else {
                text += `\`${a[perm][message.guild.settings.lang]}\` <:ok:830437777388470282>\n`;
                total.allowed++;
            }
        });
        text += `\n${total.allowed} <:ok:830437777388470282> | ${total.denied} <:Dnd:823223157502378014>`;
        let embed = new Discord.MessageEmbed()
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(message.guild.settings.color)
            .setTitle(lang.title.replace("{username}", member.user.username).replace("{channel}", message.channel.name))
            .setDescription(text)
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        msg.edit({ embeds: [embed] });
    },
};