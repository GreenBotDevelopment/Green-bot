const moment = require('moment');
const Discord = require('discord.js');
const Warn = require('../../database/models/warn');
const Case = require('../../database/models/case');

module.exports = {
    name: 'case',
    description: 'Gives some informations about a specific case',
    aliases: ["caseinfo", "case-info", ],
    guildOnly: true,
    args: 'member',
    usage: '<id>',
    exemple: 'EEF4F',
    cat: 'moderation',
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS"],

    permissions: ['MANAGE_GUILD'],

    async execute(message, args, client) {
        const lang = await message.translate("CASE")
        let id = args[0]
        const check = await Case.findOne({ serverID: message.guild.id, id: id })
        if (!check) return message.errorMessage(lang.err.replace("{id}", id))
        if (message.guild.memberCount !== message.guild.members.cache.size) await message.guild.members.fetch()

        const embed = new Discord.MessageEmbed()
            .setColor(message.guild.settings.color)
            .setAuthor(`${message.author.username}`, message.author.displayAvatarURL({ dynamic: true, size: 512 }))
            .setDescription(lang.desc.replace("{case}", check.reason))
            .addField("<:membres:830432144211705916> " + lang.mod + "", `\`${message.guild.members.cache.get(check.mod) ? message.guild.members.cache.get(check.mod).user.tag : lang.no}\` \n(<@!${check.mod}>)`, true)
            .addField("<:663041911753277442:830432143800532993> Type", check.sanction, true)
            .addField("<:green_members:811167997023485973> " + lang.target + "", `\`${message.guild.members.cache.get(check.targetID) ? message.guild.members.cache.get(check.targetID).user.tag : lang.no}\` \n(<@!${check.targetID}>)`, true)
            .addField("<:711541810098470913:830460210220630027> Case ID", `${id}`, true)
            .addField("<:612058498108227586:830440548007018517> " + lang.reason + "", `${check.reason}`, true)

        .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
        message.reply({
            embeds: [embed],
            allowedMentions: { repliedUser: false }
        })


    },
};