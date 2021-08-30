const Discord = require('discord.js');
const ms = require('ms');
const Case = require('../../database/models/case');
const Welcome = require('../../database/models/Welcome')

module.exports = {
    name: 'mute',
    description: 'Réduit au silence un membre pour un temps donné.',

    guildOnly: true,
    args: 'user',
    usage: '@user <time>',
    exemple: '@pauldb09 23s',
    cat: 'moderation',
    usages: ["mute @user", "mute @user <reason>", "mute @user <duration> <reason>", "mute @user <duration>"],

    permissions: ['MANAGE_ROLES'],
    botpermissions: ["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_ROLES"],
    async execute(message, args, client) {


        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.filter(m => m.user.tag.toLowerCase().includes(args[0].toLowerCase()) || m.displayName.toLowerCase().includes(args[0].toLowerCase()) || m.user.username.toLowerCase().includes(args[0].toLowerCase())).first()
        if (!user || user.id == message.client.user.id) {
            let err = await message.translate("ERROR_USER")
            return message.errorMessage(err)
        }
        const modErr = await message.translate("MODERATION")
        if (user.id === message.author.id) {
            return message.errorMessage(modErr.you)
        }
        if (user.id === message.guild.OWNER) return message.errorMessage(modErr.owner)
        const lang = await message.translate("MUTE")
        const member = await message.guild.members.fetch(user.id).catch(() => {});
        if (member) {
            const memberPosition = member.roles.highest.position;
            const moderationPosition = message.member.roles.highest.position;
            if (message.guild.OWNER !== message.author.id && !(moderationPosition > memberPosition)) {
                return message.errorMessage(modErr.superior)

            }
            if (user.permissions.has("ADMINISTRATOR")) return message.errorMessage(lang.admin);


        }
        let role = message.guild.roles.cache.find(role => role.name === "Muted");
        if (role) {
            if (user.roles.cache) {
                if (user.roles.cache.has(role.id)) return message.errorMessage(lang.already);
            }
        }
        let index = 1;
        let time = null;
        if (args[1] && ms(args[1])) {
            time = ms(args[1]);
            if (!time || time > 1209600000) return message.errorMessage(lang.time);
            index++;
        }
        let reason = args.slice(index).join(" ");
        if (!reason) {
            reason = modErr.raison;
        }
        if (!role) {
            try {
                role = await message.guild.roles.create({
                    name: "Muted",
                    color: "#000000",
                    reason: "Mute command",
                });
                message.guild.channels.cache.forEach(async(channel, id) => {
                    message.channel.permissionOverwrites.create(role, {
                        SEND_MESSAGES: false,
                        MANAGE_MESSAGES: false,
                        READ_MESSAGES: false,
                        CONNECT: false,
                        ADD_REACTIONS: false
                    })
                });
                message.succesMessage(lang.role.replace("{role}", role))
            } catch (e) {
                return message.errorMessage(modErr.bot)
            }
        }
        try {
            user.roles.add(role, { reason: "Mute command" });
            await user.send({
                embeds: [new Discord.MessageEmbed().setDescription(lang.dm.replace("{message.guild.name}", message.guild.name).replace("{member.user.tag}", member.user.tag).replace("{reason}", reason)).setColor(message.guild.settings.color)]
            }).catch(() => {});
            const uniqID = await message.uniqID(10)
            message.reply({
                embeds: [new Discord.MessageEmbed().setAuthor(lang.name, member.user.displayAvatarURL()).setDescription(`\`📚\` **${member.user.tag}** ${lang.desc} **${message.author.tag}** \n __\`📃\` ${lang.raison}__ : ${reason}.`).setColor(message.guild.settings.color).setFooter(`Case id: ${uniqID} | ${message.guild.settings.prefix}case ${uniqID}`, message.client.user.displayAvatarURL())],
                allowedMentions: { repliedUser: false }
            })

            const verynew = new Case({
                serverID: message.guild.id,
                id: uniqID,
                targetID: member.id,
                sanction: "Mute",
                reason: reason,
                mod: message.member.id,
            }).save()
            const logs = await Welcome.findOne({ serverID: message.guild.id, reason: `mod-logs` })
            if (logs) {
                if (message.guild.channels.cache.get(logs.channelID)) {
                    const translations = await message.translate("LOGS_MOD")
                    const embed = new Discord.MessageEmbed()
                        .setColor(message.guild.settings.color)
                        .setAuthor(`${member.user.username}`, member.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setTitle(translations.title.replace("{id}", uniqID))
                        .setDescription(translations.desc.replace("{user}", message.member.user.tag).replace("{member}", member.user.tag))
                        .addField("<:membres:830432144211705916> " + translations.mod + "", `\`${message.member.user.tag}\` \n(<@!${message.member.id}>)`, true)
                        .addField("<:663041911753277442:830432143800532993> Type", "Mute", true)
                        .addField("<:green_members:811167997023485973> " + translations.target + "", `\`${member.user.tag}\` \n(<@!${member.id}>)`, true)
                        .addField("<:711541810098470913:830460210220630027> Case ID", `${uniqID}`, true)
                        .addField("<:612058498108227586:830440548007018517> " + translations.reason + "", `${reason}`, true)

                    .setThumbnail(url = message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                        .setFooter(message.client.footer, message.client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                    message.guild.channels.cache.get(logs.channelID).send({ embeds: [embed] })
                }
            }
        } catch (err) {
            return message.errorMessage(modErr.bot)
        }

        if (time) {
            setTimeout(() => {
                user.roles.remove(role), { reason: "Mute command" }

            }, time);
        }



    },
};