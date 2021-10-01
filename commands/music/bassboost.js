const Discord = require('discord.js');
const { Player, QueryType, QueueRepeatMode } = require("discord-player");
module.exports = {
    name: 'bassboost',
    description: 'Toggles bassboost filter',
    cat: 'music',
    exemple: 'enable',
    args: true,
    usages: ["bassboost enable", "bassboost disable"],
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

        const lang = await message.translate("BASSBOOST")
        const queue = message.client.player.getQueue(message.guild.id);
        if (args.join(" ").toLowerCase() === 'enable') {
            if (!queue.getFiltersEnabled().includes("bassboost")) {
                await queue.setFilters({
                    bassboost: true,
                    normalizer2: true // because we need to toggle it with bass
                });
                return message.succesMessage(lang.enabled);
            } else {
                return message.errorMessage(lang.enabledSince);
            };
        } else if (args.join(" ").toLowerCase() === 'disable') {
            if (queue.getFiltersEnabled().includes("bassboost")) {
                await queue.setFilters({
                    bassboost: false,
                    normalizer2: false // because we need to toggle it with bass
                });
                return message.succesMessage(lang.disabled);
            } else {
                return message.errorMessage(lang.disabledSince);
            };
        } else {
            return message.usage()

        }
    },
};