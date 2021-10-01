const Discord = require('discord.js');
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
const guildData = require('../../database/models/guildData');

module.exports = {
    name: '24/7',
    description: 'Enable/Disable The 24h/7 mode',
    cat: 'music',
    exemple: 'on',
    args: true,
    usages: ["24/7 enable", "24/7 disable"],
    aliases: ['247'],
    botpermissions: ['CONNECT', 'SPEAK'],
    async execute(message, args) {
        if (message.guild.settings.dj_system) {
            if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                let MissingRole = await message.translate("MISSING_ROLE");
                let Missingperm = await message.translate("MISSING_PERMISSIONS");
                let role = message.guild.roles.cache.get(message.guild.settings.dj_system)
                if (!role) return message.errorMessage(Missingperm.replace("{perm}", 'MANAGE_MESSAGES'))
                if (message.member.roles.cache) {
                    if (!message.member.roles.cache.has(role.id)) {
                        return message.errorMessage(MissingRole.replace("{perm}", 'MANAGE_MESSAGES').replace("{role}", role.name))
                    }
                } else {
                    return message.errorMessage(MissingRole.replace("{perm}", 'MANAGE_MESSAGES').replace("{role}", role.name))
                }
            }
        }
        const voice = message.member.voice.channel;
        if (!voice) {
            let err = await message.translate("NOT_VOC")
            return message.errorMessage(err)
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            let err = await message.translate("NOT_SAME_CHANNEL")
            return message.errorMessage(err);
        }
        if (!message.client.player.getQueue(message.guild.id) || !message.client.player.getQueue(message.guild.id).playing) {
            let err = await message.translate("NOT_MUSIC")
            return message.errorMessage(err)

        }

        const lang = await message.translate("24/7")
        const queue = message.client.player.getQueue(message.guild.id);
        if (args.join(" ").toLowerCase() === 'enable') {
            if (queue.options.leaveOnEnd) {
                message.guild.settings.h24 = true
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { h24: true } }, { new: true });
                queue.options.leaveOnEmpty = false;
                queue.options.leaveOnEnd = false;
                queue.options.leaveOnEmptyCooldown = null;
                return message.succesMessage(lang.enabled);
            } else {
                return message.errorMessage(lang.enabledSince);
            };
        } else if (args.join(" ").toLowerCase() === 'disable') {
            if (!queue.options.leaveOnEnd) {
                message.guild.settings.h24 = null
                const newchannel = await guildData.findOneAndUpdate({ serverID: message.guild.id }, { $set: { h24: null } }, { new: true });
                queue.options.leaveOnEmpty = true;
                queue.options.leaveOnEnd = true;
                queue.options.leaveOnEmptyCooldown = 3000;
                return message.succesMessage(lang.disabled);
            } else {
                return message.errorMessage(lang.disabledSince);
            };
        } else {
            return message.usage()

        }
    },
};