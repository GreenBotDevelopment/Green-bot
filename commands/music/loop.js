const Discord = require('discord.js');
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
module.exports = {
    name: 'loop',
    description: 'Active /désactive la répetition',
    cat: 'music',
    exemple: 'queue',
    args: true,
    usages: ["loop queue", "loop song"],
    usage: 'queue/song',
    aliases: ['lp', 'repeat'],
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

        let lang = await message.translate("LOOP")
        let ena = await message.translate("DISABLED/ENABLED")
        const queue = message.client.player.getQueue(message.guild.id);
        if (args.join(" ").toLowerCase() === 'queue') {
            if (queue.loopMode) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return message.succesMessage(lang.queue.replace("{status}", ena.disable));
            } else {
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                return message.succesMessage(lang.queue.replace("{status}", ena.enabled));
            };
        } else if (args.join(" ").toLowerCase() === 'song') {
            if (queue.repeatMode) {
                queue.setRepeatMode(QueueRepeatMode.OFF);
                return message.succesMessage(lang.music.replace("{status}", ena.disable));
            } else {
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                return message.succesMessage(lang.music.replace("{status}", ena.enabled));
            };
        } else {
            return message.usage()

        }
    },
};